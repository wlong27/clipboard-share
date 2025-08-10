import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { materialTheme as theme } from './theme';

const API_URL = 'http://localhost:3001';

const cardStyle: React.CSSProperties = {
  background: theme.surface,
  borderRadius: theme.borderRadius,
  boxShadow: theme.shadow,
  border: `1px solid ${theme.border}`,
  padding: 32,
  maxWidth: 420,
  margin: '48px auto',
  fontFamily: theme.font,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontSize: 18,
  padding: '12px 14px',
  borderRadius: 6,
  border: `1px solid ${theme.border}`,
  marginBottom: 18,
  background: theme.background,
  fontFamily: theme.font,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  fontSize: 18,
  padding: '12px 0',
  borderRadius: 6,
  border: 'none',
  background: theme.primary,
  color: theme.onPrimary,
  fontWeight: 600,
  cursor: 'pointer',
  marginBottom: 8,
  boxShadow: '0 2px 4px rgba(25, 118, 210, 0.08)',
  fontFamily: theme.font,
  transition: 'background 0.2s',
};

const secondaryButton: React.CSSProperties = {
  ...buttonStyle,
  background: theme.secondary,
  color: theme.onSecondary,
  marginLeft: 8,
};

const errorStyle: React.CSSProperties = {
  color: theme.error,
  marginTop: 8,
  fontWeight: 500,
};

const successStyle: React.CSSProperties = {
  color: '#388e3c',
  marginTop: 8,
  fontWeight: 500,
};

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  marginBottom: 4,
  color: '#333',
  fontSize: 15,
  display: 'block',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  fontSize: 16,
  minHeight: 120,
  resize: 'vertical',
  marginBottom: 18,
};

function App() {
  const [pin, setPin] = useState('');
  const [text, setText] = useState('');
  const [step, setStep] = useState<'setup' | 'auth' | 'clipboard'>('auth');
  const [error, setError] = useState('');
  const [newPin, setNewPin] = useState('');

  // Try to authenticate
  const handleAuth = async () => {
    setError('');
    if (!/^\d{6}$/.test(pin)) {
      setError('Pin must be 6 digits.');
      return;
    }
    const res = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    const data = await res.json();
    if (res.ok) {
      setText(data.text);
      setStep('clipboard');
    } else if (data.error === 'Pin not set yet.') {
      setStep('setup');
    } else {
      setError(data.error || 'Auth failed');
    }
  };

  // Set pin and text (first user)
  const handleSetup = async () => {
    setError('');
    if (!/^\d{6}$/.test(pin)) {
      setError('Pin must be 6 digits.');
      return;
    }
    const res = await fetch(`${API_URL}/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, text })
    });
    if (res.ok) {
      setStep('clipboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Setup failed');
    }
  };

  // Update clipboard text
  const handleUpdate = async () => {
    setError('');
    const res = await fetch(`${API_URL}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, text })
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Update failed');
    }
  };

  // Reset pin
  const handleResetPin = async () => {
    setError('');
    if (!/^\d{6}$/.test(newPin)) {
      setError('New pin must be 6 digits.');
      return;
    }
    const res = await fetch(`${API_URL}/reset-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, newPin })
    });
    if (res.ok) {
      setPin(newPin);
      setNewPin('');
      setError('Pin reset!');
    } else {
      const data = await res.json();
      setError(data.error || 'Reset failed');
    }
  };


  if (step === 'auth') {
    return (
      <div style={cardStyle}>
        <h2 style={{ color: theme.primary, fontWeight: 700, marginBottom: 24, fontSize: 28, letterSpacing: 1 }}>🔒 Clipboard Login</h2>
        <label style={labelStyle}>Enter Pin</label>
        <input
          type="password"
          value={pin}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPin(e.target.value)}
          maxLength={6}
          placeholder="6-digit pin"
          style={inputStyle}
        />
        <button onClick={handleAuth} style={buttonStyle}>Access Clipboard</button>
        {error && <div style={errorStyle}>{error}</div>}
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div style={cardStyle}>
        <h2 style={{ color: theme.secondary, fontWeight: 700, marginBottom: 24, fontSize: 28, letterSpacing: 1 }}>📝 Set Pin & Clipboard</h2>
        <label style={labelStyle}>Set Pin</label>
        <input
          type="password"
          value={pin}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPin(e.target.value)}
          maxLength={6}
          placeholder="6-digit pin"
          style={inputStyle}
        />
        <label style={labelStyle}>Clipboard Text</label>
        <textarea
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          rows={10}
          style={textareaStyle}
          placeholder="Paste or type your text here..."
        />
        <button onClick={handleSetup} style={buttonStyle}>Set Clipboard</button>
        {error && <div style={errorStyle}>{error}</div>}
      </div>
    );
  }

  // Clipboard view
  return (
    <div style={{ ...cardStyle, maxWidth: 600 }}>
      <h2 style={{ color: theme.primary, fontWeight: 700, marginBottom: 24, fontSize: 28, letterSpacing: 1 }}>📋 Shared Clipboard</h2>
      <label style={labelStyle}>Clipboard Text</label>
      <textarea
        value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
        rows={12}
        style={textareaStyle}
        placeholder="Paste or type your text here..."
      />
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <button onClick={handleUpdate} style={buttonStyle}>Update</button>
        <button onClick={() => { navigator.clipboard.writeText(text); setError('Copied!'); }} style={secondaryButton}>Copy</button>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center' }}>
        <input
          type="password"
          value={newPin}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPin(e.target.value)}
          maxLength={6}
          placeholder="New 6-digit pin"
          style={{ ...inputStyle, width: 180, marginRight: 8, marginBottom: 0 }}
        />
        <button onClick={handleResetPin} style={{ ...buttonStyle, width: 140, fontSize: 16 }}>Reset Pin</button>
      </div>
      {error && <div style={error === 'Copied!' ? successStyle : errorStyle}>{error}</div>}
    </div>
  );
}

export default App;

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
