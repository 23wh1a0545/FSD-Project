

import React, { useEffect } from 'react';
import './ViewNoteModal.css';

const ViewNoteModal = ({ isOpen, onClose, note }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen || !note) return null;

  const accentColor = note.color === '#1e1e2e' || !note.color ? '#6c3fc4' : note.color;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="viewnote-overlay" onClick={onClose}>
      <div
        className="viewnote-container"
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `4px solid ${accentColor}` }}
      >
        <div className="viewnote-header">
          <div className="viewnote-meta">
            {note.isLocked && <span className="viewnote-lock-tag">🔓 Unlocked</span>}
            <span className="viewnote-date">Updated {formatDate(note.updatedAt)}</span>
          </div>
          <button className="viewnote-close" onClick={onClose}>✕</button>
        </div>

        <div className="viewnote-body">
          <h2 className="viewnote-title">{note.title}</h2>
          <div className="viewnote-divider" style={{ background: `${accentColor}50` }} />
          <p className="viewnote-description">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewNoteModal;
