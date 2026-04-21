
import React, { useState } from 'react';
import './NoteCard.css';

const NoteCard = ({ note, onEdit, onDelete, onUnlock }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const accentColor = note.color === '#1e1e2e' || !note.color ? '#6c3fc4' : note.color;

  const handleEditClick = () => {
    if (note.isLocked) {
      onUnlock(note, 'edit');
    } else {
      onEdit(note);
    }
  };

  const handleViewClick = () => {
    if (note.isLocked) {
      onUnlock(note, 'view');
    }
  };

  return (
    <div
      className={`note-card ${note.isLocked ? 'locked' : ''}`}
      style={{
        background: note.color || '#1e1e2e',
        borderColor: `${accentColor}30`,
      }}
    >
      <div className="note-card-accent" style={{ background: accentColor }} />

      {note.isLocked && (
        <div className="note-lock-badge" title="Password protected">
          🔒
        </div>
      )}

      <div className="note-card-content">
        <h3 className="note-card-title">
          {note.title}
        </h3>

        <p className={`note-card-description ${note.isLocked ? 'locked-description' : ''}`}>
          {note.isLocked
            ? 'Password protected — click to unlock'
            : note.description}
        </p>
      </div>

      <div className="note-card-footer">
        <span className="note-card-date">
          {formatDate(note.updatedAt)}
        </span>

        <div className="note-card-actions">
          {note.isLocked && (
            <button
              className="card-action-btn unlock-btn"
              onClick={handleViewClick}
              title="Unlock to view"
            >
              🔓
            </button>
          )}

          <button
            className="card-action-btn edit-btn"
            onClick={handleEditClick}
            title={note.isLocked ? 'Unlock to edit' : 'Edit note'}
          >
            ✏️
          </button>

          {!showDeleteConfirm ? (
            <button
              className="card-action-btn delete-btn"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete note"
            >
              🗑️
            </button>
          ) : (
            <div className="delete-confirm">
              <span className="delete-confirm-text">Sure?</span>
              <button
                className="card-action-btn confirm-yes"
                onClick={() => onDelete(note._id)}
                title="Confirm delete"
              >
                ✓
              </button>
              <button
                className="card-action-btn confirm-no"
                onClick={() => setShowDeleteConfirm(false)}
                title="Cancel"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
