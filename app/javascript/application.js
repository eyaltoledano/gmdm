import React from 'react';
import { createRoot } from 'react-dom/client';
import './services/polyfill.js';
import './app.css';
import App from './app.jsx';
import './services/csrfInterceptor.js';
import 'react-dotenv'

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <App />
);import "./channels"
