
const Note = require('../models/Note');

const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ createdAt: -1 }) 
      .select('-lockPassword');  

    const sanitizedNotes = notes.map((note) => ({
      _id: note._id,
      title: note.title,
      description: note.isLocked ? '🔒 This note is password protected.' : note.description,
      color: note.color,
      isLocked: note.isLocked,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));

    res.status(200).json({
      success: true,
      count: sanitizedNotes.length,
      notes: sanitizedNotes,
    });
  } catch (error) {
    next(error);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id).select('-lockPassword');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
        code: 'NOTE_NOT_FOUND',
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this note.',
        code: 'FORBIDDEN',
      });
    }

    if (note.isLocked) {
      return res.status(200).json({
        success: true,
        note: {
          _id: note._id,
          title: note.title,
          description: '🔒 This note is password protected.',
          color: note.color,
          isLocked: true,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        },
        locked: true,
      });
    }

    res.status(200).json({
      success: true,
      note,
      locked: false,
    });
  } catch (error) {
    next(error);
  }
};
const createNote = async (req, res, next) => {
  try {
    const { title, description, color, isLocked, lockPassword } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required.',
        code: 'MISSING_FIELDS',
      });
    }

    if (isLocked && !lockPassword) {
      return res.status(400).json({
        success: false,
        message: 'A lock password is required when locking a note.',
        code: 'LOCK_PASSWORD_REQUIRED',
      });
    }

    const noteData = {
      user: req.user._id,       
      title: title.trim(),
      description: description.trim(),
      color: color || '#ffffff',
      isLocked: isLocked || false,
      lockPassword: isLocked ? lockPassword : null, 
    };

    const note = await Note.create(noteData);

    res.status(201).json({
      success: true,
      message: 'Note created successfully!',
      note: {
        _id: note._id,
        title: note.title,
        description: note.description,
        color: note.color,
        isLocked: note.isLocked,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { title, description, color, isLocked, lockPassword, removeLock } = req.body;

    let note = await Note.findById(req.params.id).select('+lockPassword');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
        code: 'NOTE_NOT_FOUND',
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this note.',
        code: 'FORBIDDEN',
      });
    }

    if (title !== undefined) note.title = title.trim();
    if (description !== undefined) note.description = description.trim();
    if (color !== undefined) note.color = color;

    if (removeLock === true) {
      note.isLocked = false;
      note.lockPassword = null;
    } else if (isLocked === true && lockPassword) {
     
      note.isLocked = true;
      note.lockPassword = lockPassword; 
    }

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully!',
      note: {
        _id: updatedNote._id,
        title: updatedNote.title,
        description: updatedNote.description,
        color: updatedNote.color,
        isLocked: updatedNote.isLocked,
        createdAt: updatedNote.createdAt,
        updatedAt: updatedNote.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
        code: 'NOTE_NOT_FOUND',
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this note.',
        code: 'FORBIDDEN',
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully.',
      deletedId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

const unlockNote = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to unlock this note.',
        code: 'PASSWORD_REQUIRED',
      });
    }
    const note = await Note.findById(req.params.id).select('+lockPassword');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
        code: 'NOTE_NOT_FOUND',
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
        code: 'FORBIDDEN',
      });
    }

    if (!note.isLocked) {
      return res.status(400).json({
        success: false,
        message: 'This note is not locked.',
        code: 'NOT_LOCKED',
      });
    }

    const isMatch = await note.verifyLockPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password.',
        code: 'WRONG_PASSWORD',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note unlocked.',
      note: {
        _id: note._id,
        title: note.title,
        description: note.description, 
        color: note.color,
        isLocked: note.isLocked,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  unlockNote,
};
