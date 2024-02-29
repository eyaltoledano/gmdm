import './services/rainbowkit.css'
import React from 'react';
import { createRoot } from 'react-dom/client';
import './services/polyfill.js';
import './app.css';
import App from './app.jsx';

createRoot(document.getElementById('root')).render(<App />);
