import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ExperienceProvider } from './context/Experience';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ExperienceProvider>
        <App />
      </ExperienceProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
