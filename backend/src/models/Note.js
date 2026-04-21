

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Note must belong to a user'],
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },

    color: {
      type: String,
      default: '#ffffff',
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    lockPassword: {
      type: String,
      default: null,
      select: false,
    },

  },
  {
    timestamps: true, 
  }
);

noteSchema.pre('save', async function (next) {
  if (!this.isModified('lockPassword') || !this.lockPassword) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.lockPassword = await bcrypt.hash(this.lockPassword, salt);

  next();
});

noteSchema.methods.verifyLockPassword = async function (enteredPassword) {
  if (!this.lockPassword) return false;
  return await bcrypt.compare(enteredPassword, this.lockPassword);
};

module.exports = mongoose.model('Note', noteSchema);
