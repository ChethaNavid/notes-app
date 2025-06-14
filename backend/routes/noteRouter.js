import express from 'express';
import { addNote, editNote, getAllNote, deleteNote, updateNotePinned, searchNote } from '../controllers/notesController.js'
import authenticateToken from '../middleware/authentication.js';

const noteRouter = express.Router();

noteRouter.get('/get-all-note', authenticateToken, getAllNote);
noteRouter.get('/search-note', authenticateToken, searchNote);
noteRouter.post('/add-note', authenticateToken, addNote);
noteRouter.put('/edit-note/:id', authenticateToken ,editNote);
noteRouter.delete('/delete-note/:id', authenticateToken, deleteNote);
noteRouter.put('/update-note-pinned/:id', authenticateToken, updateNotePinned);

export default noteRouter;