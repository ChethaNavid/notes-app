import { getConnection } from '../db.js';

// GET /notes/get-all-note
const getAllNote = async(req, res) => {

    const connection = await getConnection();

    try {
        const [note] = await connection.execute('SELECT * FROM notes');

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
    const connection = await getConnection();

    if(!title) return res.status(400).json({
        error: true, message: "Title is required."
    });

    if(!content) return res.status(400).json({
        error: true, message: "Content is required."
    });

    console.log("Authenticated user_id:", user_id);

    try {
        const [result] = await connection.execute(
            'INSERT INTO notes (title, content, tags, created_on, user_id) VALUES (?, ?, ?, NOW(), ?)',
            [title, content, JSON.stringify(tags), user_id]
        );

        const note = {
            id: result.insertId,
            title,
            content,
            tags,
            user_id,
        }
        return res.status(200).json({
            error: false,
            note,
            message: "Note added successfully."
        });

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
    const connection = await getConnection();
    const sanitize = (val) => val === undefined ? null : val;


    console.log(note_id);

    if(!title && !content && (!tags || tags.length === 0)) {
        return res.status(400).json({
            error: true, message: "No changes provided"
        });
    }

    try {
        const [existingNote] = await connection.execute(
            ('SELECT * FROM notes WHERE id = ? AND user_id = ?'),
            [note_id, user_id]
        );

        if(existingNote.length === 0) return res.status(404).json({ error: true, message: "Note not found" });

        const [updateNote] = await connection.execute(
            `UPDATE notes
            SET 
                title = COALESCE(?, title),
                content = COALESCE(?, content),
                tags = COALESCE(?, tags),
                is_pinned = COALESCE(?, is_pinned)
            WHERE id = ? AND user_id = ?;`, 
            [
                sanitize(title),
                sanitize(content),
                sanitize(JSON.stringify(tags)),
                sanitize(isPinned),
                note_id,
                user_id
            ]
        );

        return res.status(200).json({
            error: false,
            note: updateNote[0],
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
    const connection = await getConnection();

    try {
        const [existingNote] = await connection.execute(
            'SELECT * FROM notes WHERE id = ?', [note_id]
        );

        if(existingNote.length === 0) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await connection.execute('DELETE FROM notes WHERE id = ?', [note_id]);

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
    const connection = await getConnection();
    const sanitize = (val) => val === undefined ? null : val;

    try {
        const [existingNote] = await connection.execute(
            ('SELECT * FROM notes WHERE id = ? AND user_id = ?'),
            [note_id, user_id]
        );

        if(existingNote.length === 0) return res.status(404).json({ error: true, message: "Note not found" });

        const [updateNote] = await connection.execute(
            `UPDATE notes
            SET 
                is_pinned = COALESCE(?, is_pinned)
            WHERE id = ? AND user_id = ?;`, [sanitize(isPinned), note_id, user_id]
        );

        return res.status(200).json({
            error: false,
            note: updateNote[0],
            message: "Note updated successfully",
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Internal Server Error "});
    }
}

export {getAllNote, addNote, editNote, deleteNote, updateNotePinned};