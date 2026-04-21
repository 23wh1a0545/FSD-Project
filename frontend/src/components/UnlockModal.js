

import React, { useState, useEffect, useRef } from 'react';
import './UnlockModal.css';

const UnlockModal = ({ isOpen, onClose, onUnlock, noteTitle, loading, error }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    onUnlock(password);
  };

  return (
    <div className="unlock-overlay" onClick={onClose}>
      <div className="unlock-container" onClick={(e) => e.stopPropagation()}>
        <div className="unlock-icon-wrap">
          <div className="unlock-icon">🔒</div>
        </div>

        <h3 className="unlock-title">Locked Note</h3>
        <p className="unlock-subtitle">
          <strong>"{noteTitle}"</strong> is password protected.
          Enter the password to unlock it.
        </p>

        <form onSubmit={handleSubmit} className="unlock-form">
          <div className="unlock-input-wrap">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter lock password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="unlock-input"
            />
            <button
              type="button"
              className="unlock-eye-btn"
              onClick={() => setShowPassword((p) => !p)}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {error && (
            <div className="unlock-error">
              🚫 {error}
            </div>
          )}

          <div className="unlock-actions">
            <button
              type="button"
              className="unlock-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="unlock-submit-btn"
              disabled={loading || !password.trim()}
            >
              {loading ? <span className="btn-spinner" /> : 'Unlock →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnlockModal;
