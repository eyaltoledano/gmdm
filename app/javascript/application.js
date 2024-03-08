import React from 'react';
import { createRoot } from 'react-dom/client';
import './services/polyfill.js';
import './app.css';
import App from './app.jsx';
import './services/csrfInterceptor.js';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const envVarsJSON = rootElement.getAttribute('data-rainbow');
const envVars = JSON.parse(envVarsJSON);


root.render(
    <App
     envVars={envVars} 
     />
);