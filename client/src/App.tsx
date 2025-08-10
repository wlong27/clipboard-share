import React, { useState } from 'react';

const API_URL = 'http://localhost:3001';

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
      <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2>Enter Pin</h2>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          maxLength={6}
          placeholder="6-digit pin"
          style={{ fontSize: 18, width: '100%', marginBottom: 12 }}
        />
        <button onClick={handleAuth} style={{ width: '100%', fontSize: 18 }}>Access Clipboard</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2>Set Pin & Clipboard</h2>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          maxLength={6}
          placeholder="6-digit pin"
          style={{ fontSize: 18, width: '100%', marginBottom: 12 }}
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={10}
          style={{ width: '100%', fontSize: 16, marginBottom: 12 }}
          placeholder="Paste or type your text here..."
        />
        <button onClick={handleSetup} style={{ width: '100%', fontSize: 18 }}>Set Clipboard</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    );
  }

  // Clipboard view
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Shared Clipboard</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={12}
        style={{ width: '100%', fontSize: 16, marginBottom: 12 }}
        placeholder="Paste or type your text here..."
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleUpdate} style={{ flex: 1, fontSize: 18 }}>Update</button>
        <button onClick={() => { navigator.clipboard.writeText(text); setError('Copied!'); }} style={{ flex: 1, fontSize: 18 }}>Copy</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <input
          type="password"
          value={newPin}
          onChange={e => setNewPin(e.target.value)}
          maxLength={6}
          placeholder="New 6-digit pin"
          style={{ fontSize: 16, width: 180, marginRight: 8 }}
        />
        <button onClick={handleResetPin} style={{ fontSize: 16 }}>Reset Pin</button>
      </div>
      {error && <div style={{ color: error === 'Copied!' ? 'green' : 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export default App;
