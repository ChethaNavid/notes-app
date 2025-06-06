import pool from '../db.js';

// GET /notes/get-all-notes
const getAllNote = async(req, res) => {

    try {
        const result = await pool.query('SELECT * FROM notes');

        const note = result.rows;

        return res.status(200).json({
            error: false,
            note,
            message: "All notes retrieved successfully",
        })

    } catch(error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

// POST /notes/add-note
const addNote = async(req, res) => {
    const { title, content, tags = [] } = req.body;
    const { user_id } = req.user;

    if(!title) return res.status(400).json({
        error: true, message: "Title is required."
    });

    if(!content) return res.status(400).json({
        error: true, message: "Content is required."
    });

    console.log("Authenticated user_id:", user_id);

    try {
        const result = await pool.query(
            'INSERT INTO notes (title, content, tags, created_on, user_id) VALUES ($1, $2, $3, NOW(), $4) RETURNING *',
            [title, content, tags, user_id]
        );

        const note = result.rows[0];

        if(note) {
            return res.status(200).json({
                error: false,
                note,
                message: "Note added successfully."
            })
        };
    } catch (error) {
        console.error("Error adding note:", error);
        return res.status(500).json({error: true, message: "Internal Server Error"});
    }
}

// PUT /notes/edit-note/:id
const editNote = async(req, res) => {
    const note_id = req.params.id;
    const { title, content, tags = [], isPinned } = req.body;
    const { user_id } = req.user;

    console.log(note_id);

    if(!title && !content && !tags) {
        return res.status(400).json({
            error: true, message: "No changes provided"
        });
    }

    try {
        const existingNote = await pool.query(
            ('SELECT * FROM notes WHERE id = $1 AND user_id = $2'),
            [note_id, user_id]
        );

        if(existingNote.rows.length === 0) return res.status(404).json({ error: true, message: "Note not found" });

        const updateNote = await pool.query(
            `UPDATE notes
            SET 
                title = COALESCE($1, title),
                content = COALESCE($2, content),
                tags = COALESCE($3, tags),
                is_pinned = COALESCE($4, is_pinned)
            WHERE id = $5 AND user_id = $6
            RETURNING *;`, [title, content, tags, isPinned, note_id, user_id]
        );

        const note = updateNote.rows[0];

        return res.status(200).json({
            error: false,
            note,
            message: "Note updated successfully",
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Internal Server Error "});
    }
}

// DELETE /notes/delete-note/:id
const deleteNote = async (req, res) => {
    const note_id = req.params.id;

    try {
        const existingNote = await pool.query(
            'SELECT * FROM notes WHERE id = $1', [note_id]
        );

        if(existingNote.rows.length === 0) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await pool.query('DELETE FROM notes WHERE id = $1', [note_id]);

        return res.status(200).json({ error: false, message: "Note deleted successfully."} );

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

// PUT /notes/update-note-pinned/:id
const updateNotePinned = async (req, res) => {
    const note_id = req.params.id;
    const { isPinned } = req.body;
    const { user_id } = req.user;

    try {
        const existingNote = await pool.query(
            ('SELECT * FROM notes WHERE id = $1 AND user_id = $2'),
            [note_id, user_id]
        );

        if(existingNote.rows.length === 0) return res.status(404).json({ error: true, message: "Note not found" });

        const updateNote = await pool.query(
            `UPDATE notes
            SET 
                is_pinned = COALESCE($1, is_pinned OR FALSE)
            WHERE id = $2 AND user_id = $3
            RETURNING *;`, [isPinned, note_id, user_id]
        );

        const note = updateNote.rows[0];

        return res.status(200).json({
            error: false,
            note,
            message: "Note updated successfully",
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Internal Server Error "});
    }
}

export {getAllNote, addNote, editNote, deleteNote, updateNotePinned};