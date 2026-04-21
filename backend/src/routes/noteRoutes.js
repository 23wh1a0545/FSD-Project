

const express = require('express');
const router = express.Router();

const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  unlockNote,
} = require('../controllers/notesController');

const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getAllNotes).post(createNote);

router.route('/:id').get(getNoteById).put(updateNote).delete(deleteNote);

router.post('/:id/unlock', unlockNote);

module.exports = router;
