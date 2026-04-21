
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../services/api';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import UnlockModal from '../components/UnlockModal';
import ViewNoteModal from '../components/ViewNoteModal';
import './HomePage.css';

const HomePage = () => {
  const { user, logout } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null = create mode
  const [savingNote, setSavingNote] = useState(false);


  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [unlockingNote, setUnlockingNote] = useState(null); // which note to unlock
  const [unlockPurpose, setUnlockPurpose] = useState('view'); // 'view' | 'edit'
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await notesAPI.getAll();
      setNotes(response.data.notes);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSaveNote = async (noteData) => {
    setSavingNote(true);
    try {
      if (editingNote) {
        const response = await notesAPI.update(editingNote._id, noteData);
        setNotes((prev) =>
          prev.map((n) => (n._id === editingNote._id ? response.data.note : n))
        );
        showToast('Note updated successfully!');
      } else {
        const response = await notesAPI.create(noteData);
        setNotes((prev) => [response.data.note, ...prev]);
        showToast('Note created!');
      }
      setNoteModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Save note error:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await notesAPI.delete(noteId);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
      showToast('Note deleted.', 'info');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete note.', 'error');
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteModalOpen(true);
  };

  const handleUnlockRequest = (note, purpose = 'view') => {
    setUnlockingNote(note);
    setUnlockPurpose(purpose);
    setUnlockError('');
    setUnlockModalOpen(true);
  };

  const handleUnlockSubmit = async (password) => {
    setUnlockLoading(true);
    setUnlockError('');
    try {
      const response = await notesAPI.unlock(unlockingNote._id, password);
      const unlockedNote = response.data.note;

      setUnlockModalOpen(false);

      if (unlockPurpose === 'view') {
        setViewingNote(unlockedNote);
        setViewModalOpen(true);
      } else if (unlockPurpose === 'edit') {
        setEditingNote(unlockedNote);
        setNoteModalOpen(true);
      }
    } catch (err) {
      setUnlockError(err.response?.data?.message || 'Incorrect password.');
    } finally {
      setUnlockLoading(false);
    }
  };

  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      (!note.isLocked && note.description.toLowerCase().includes(q))
    );
  });

  const lockedCount = notes.filter((n) => n.isLocked).length;
  const totalCount = notes.length;

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-left">
          <div className="header-brand">
            <span className="header-logo">📝</span>
            <span className="header-title">NoteStack</span>
          </div>
          <div className="header-stats">
            <span className="stat-item">
              <span className="stat-num">{totalCount}</span> Notes
            </span>
            {lockedCount > 0 && (
              <span className="stat-item locked-stat">
                <span className="stat-num">🔒 {lockedCount}</span> Locked
              </span>
            )}
          </div>
        </div>

        <div className="header-right">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="user-menu">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              <button className="logout-btn" onClick={logout}>Sign out</button>
            </div>
          </div>
        </div>
      </header>

      <main className="home-main">
        <div className="notes-toolbar">
          <div>
            <h2 className="notes-heading">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : 'My Notes'}
            </h2>
            {searchQuery && (
              <p className="search-result-count">
                {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <button
            className="add-note-btn"
            onClick={() => {
              setEditingNote(null);
              setNoteModalOpen(true);
            }}
          >
            <span>+</span> New Note
          </button>
        </div>

        {loading && (
          <div className="notes-loading">
            <div className="loading-spinner" />
            <p>Loading your notes...</p>
          </div>
        )}

        {!loading && error && (
          <div className="notes-error">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={fetchNotes} className="retry-btn">Try Again</button>
          </div>
        )}

        {!loading && !error && filteredNotes.length === 0 && (
          <div className="notes-empty">
            {searchQuery ? (
              <>
                <div className="empty-icon">🔍</div>
                <h3>No results found</h3>
                <p>No notes match "{searchQuery}"</p>
              </>
            ) : (
              <>
                <div className="empty-icon">📋</div>
                <h3>No notes yet</h3>
                <p>Create your first note to get started!</p>
                <button
                  className="add-note-btn"
                  onClick={() => {
                    setEditingNote(null);
                    setNoteModalOpen(true);
                  }}
                >
                  + Create First Note
                </button>
              </>
            )}
          </div>
        )}

        {!loading && !error && filteredNotes.length > 0 && (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onUnlock={handleUnlockRequest}
              />
            ))}
          </div>
        )}
      </main>

      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => {
          setNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        note={editingNote}
        loading={savingNote}
      />

      <UnlockModal
        isOpen={unlockModalOpen}
        onClose={() => {
          setUnlockModalOpen(false);
          setUnlockError('');
        }}
        onUnlock={handleUnlockSubmit}
        noteTitle={unlockingNote?.title || ''}
        loading={unlockLoading}
        error={unlockError}
      />

      <ViewNoteModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setViewingNote(null);
        }}
        note={viewingNote}
      />

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' && '✅'}
          {toast.type === 'error' && '❌'}
          {toast.type === 'info' && 'ℹ️'}
          {' '}{toast.message}
        </div>
      )}
    </div>
  );
};

export default HomePage;
