
import React, { useState, useEffect } from 'react';
import './NoteModal.css';

const NOTE_COLORS = [
  { value: '#1e1e2e', label: 'Midnight' },
  { value: '#1a2a1a', label: 'Forest' },
  { value: '#1a1a2a', label: 'Ocean' },
  { value: '#2a1a1a', label: 'Crimson' },
  { value: '#2a2a1a', label: 'Amber' },
  { value: '#1a2a2a', label: 'Teal' },
];
const NoteModal = ({ isOpen, onClose, onSave, note, loading }) => {
  const isEditMode = !!note;

 
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#1e1e2e',
    isLocked: false,
    lockPassword: '',
    confirmLockPassword: '',
    removeLock: false,
  });

  const [error, setError] = useState('');
  const [showLockSection, setShowLockSection] = useState(false);

  
  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        description: note.isLocked ? '' : (note.description || ''),
        color: note.color || '#1e1e2e',
        isLocked: note.isLocked || false,
        lockPassword: '',
        confirmLockPassword: '',
        removeLock: false,
      });
      setShowLockSection(note.isLocked || false);
    } else {
     
      setFormData({
        title: '',
        description: '',
        color: '#1e1e2e',
        isLocked: false,
        lockPassword: '',
        confirmLockPassword: '',
        removeLock: false,
      });
      setShowLockSection(false);
    }
    setError('');
  }, [note, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const toggleLockSection = () => {
    setShowLockSection((prev) => !prev);
    if (showLockSection) {
      setFormData((prev) => ({
        ...prev,
        isLocked: false,
        lockPassword: '',
        confirmLockPassword: '',
        removeLock: true,
      }));
    } else {
      setFormData((prev) => ({ ...prev, removeLock: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) return setError('Title is required.');
    if (!formData.description.trim() && !(isEditMode && note.isLocked && !formData.removeLock)) {
      return setError('Description is required.');
    }

    if (showLockSection && !formData.removeLock) {
      if (!formData.lockPassword) return setError('Enter a password to lock this note.');
      if (formData.lockPassword.length < 4) return setError('Lock password must be at least 4 characters.');
      if (formData.lockPassword !== formData.confirmLockPassword) {
        return setError('Lock passwords do not match.');
      }
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || (isEditMode ? note.description : ''),
      color: formData.color,
      isLocked: showLockSection && !formData.removeLock,
      removeLock: formData.removeLock,
    };

    if (showLockSection && !formData.removeLock && formData.lockPassword) {
      payload.lockPassword = formData.lockPassword;
    }

    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()} 
        style={{ borderTop: `4px solid ${formData.color === '#1e1e2e' ? '#6c3fc4' : formData.color}` }}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditMode ? '✏️ Edit Note' : '✨ New Note'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              type="text"
              name="title"
              placeholder="Note title..."
              value={formData.title}
              onChange={handleChange}
              maxLength={100}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="modal-field">
            <label htmlFor="note-description">
              Description
              {isEditMode && note?.isLocked && !formData.removeLock && (
                <span className="locked-hint">🔒 Locked — enter new content to update</span>
              )}
            </label>
            <textarea
              id="note-description"
              name="description"
              placeholder={
                isEditMode && note?.isLocked
                  ? 'Enter new content to update locked note...'
                  : 'Write your note here...'
              }
              value={formData.description}
              onChange={handleChange}
              rows={5}
              maxLength={5000}
              disabled={loading}
            />
            <span className="char-count">{formData.description.length} / 5000</span>
          </div>

          <div className="modal-field">
            <label>Color</label>
            <div className="color-picker">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`color-dot ${formData.color === c.value ? 'selected' : ''}`}
                  style={{ background: c.value, border: `2px solid ${c.value === '#1e1e2e' ? '#555' : c.value}` }}
                  onClick={() => handleColorSelect(c.value)}
                  title={c.label}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className="lock-section">
            <button
              type="button"
              className={`lock-toggle-btn ${showLockSection ? 'active' : ''}`}
              onClick={toggleLockSection}
              disabled={loading}
            >
              <span>{showLockSection ? '🔒' : '🔓'}</span>
              <span>{showLockSection ? 'Password Lock Enabled' : 'Enable Password Lock'}</span>
              <span className={`lock-badge ${showLockSection ? 'on' : 'off'}`}>
                {showLockSection ? 'ON' : 'OFF'}
              </span>
            </button>

            {showLockSection && (
              <div className="lock-fields">
                <p className="lock-description">
                  🛡️ This note will be hidden behind a password. Only you can unlock it.
                </p>
                <div className="modal-field">
                  <label htmlFor="lockPassword">Lock Password</label>
                  <input
                    id="lockPassword"
                    type="password"
                    name="lockPassword"
                    placeholder="Set a lock password (min. 4 chars)"
                    value={formData.lockPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="modal-field">
                  <label htmlFor="confirmLockPassword">Confirm Lock Password</label>
                  <input
                    id="confirmLockPassword"
                    type="password"
                    name="confirmLockPassword"
                    placeholder="Re-enter lock password"
                    value={formData.confirmLockPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="modal-error">
              ⚠️ {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-spinner" />
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Create Note'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
