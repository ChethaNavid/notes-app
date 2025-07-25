import { Note } from "../models/notes.js";
import { Op, where } from "sequelize";

// GET /notes/get-all-note
const getAllNote = async(req, res) => {

    const { user_id } = req.user;

    try {
        const note = await Note.findAll({
            where: { userId: user_id },
            order: [["isPinned", "DESC"]]
        })

        return res.status(200).json({
            error: false,
            note,
            message: "All notes retrieved successfully",
        })

    } catch(error) {
        console.error(error);
        return res.status(500).json({ error: true, message: error.message});
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

    try {
        const note = await Note.create({
            title, content, tags, userId: user_id
        })

        return res.status(200).json({
            error: false,
            note,
            message: "Note added successfully."
        });

    } catch (error) {
        console.error("Error adding note:", error);
        return res.status(500).json({error: true, message: error.message });
    }
}

// GET /notes/search-note
const searchNote = async (req, res) => {
    const {user_id} = req.user;
    const {query} = req.query;

    if(!query) {
        return res.status(400).json({ error: true, message: "Query is required!" });
    }

    try {
        const matchingNotes = await Note.findAll({
            where: { userId: user_id },
            [Op.or] : [
                { title: { [Op.like]: `%${query}%` } },
                { content: { [Op.like]: `%${query}%` } },
                { tags: { [Op.like]: `%${query}%` } },
            ]
        })

        return res.status(200).json({
            error: false,
            note: matchingNotes,
            message: "Notes matching the search query retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

// PUT /notes/edit-note/:id
const editNote = async(req, res) => {
    const note_id = req.params.id;
    const { title, content, tags = [], isPinned } = req.body;
    const { user_id } = req.user;


    if(!title && !content && (!tags || tags.length === 0)) {
        return res.status(400).json({
            error: true, message: "No changes provided"
        });
    }

    try {
        const existingNote = await Note.findOne({
            where: {
                id: note_id,
                userId: user_id
            }
        })

        if(!existingNote) return res.status(404).json({ error: true, message: "Note not found" });

        if (title !== undefined) existingNote.title = title;
        if (content !== undefined) existingNote.content = content;
        if (tags.length > 0) existingNote.tags = tags;
        if (isPinned !== undefined) existingNote.is_pinne = isPinned;

        await existingNote.save();

        return res.status(200).json({
            error: false,
            note: existingNote,
            message: "Note updated successfully",
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({ error: true, message: error.message });
    }
}

// DELETE /notes/delete-note/:id
const deleteNote = async (req, res) => {
    const note_id = req.params.id;

    try {
        const existingNote = await Note.findOne({
            where: { id: note_id }
        })

        if(!existingNote) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.destroy({ where: { id: note_id } });

        return res.status(200).json({ error: false, message: "Note deleted successfully."} );

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: error.message });
    }
}

// PUT /notes/update-note-pinned/:id
const updateNotePinned = async (req, res) => {
    const note_id = req.params.id;
    const { isPinned } = req.body;
    const { user_id } = req.user;

    try {
        const existingNote = await Note.findOne({
            where: {
                id: note_id,
                userId: user_id
            }
        });

        if(!existingNote) return res.status(404).json({ error: true, message: "Note not found" });

        existingNote.isPinned = isPinned;
        await existingNote.save();

        return res.status(200).json({
            error: false,
            note: existingNote,
            message: "Note updated successfully",
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({ error: true, message: error.message });
    }
}

export {getAllNote, addNote, editNote, deleteNote, updateNotePinned, searchNote};