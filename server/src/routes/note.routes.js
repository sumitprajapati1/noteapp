import express from 'express';
import { createNote, getNotes, deleteNote } from '../controllers/note.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.post('/', createNote);
router.get('/', getNotes);
router.delete('/:id', deleteNote);

export default router;