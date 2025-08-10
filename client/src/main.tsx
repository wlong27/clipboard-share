import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './index'; // Changed from './App' to './index'

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
