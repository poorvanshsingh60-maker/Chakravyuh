import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TimezoneProvider } from './context/TimezoneContext';
import { NotificationProvider } from './context/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TimezoneProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </TimezoneProvider>
  </React.StrictMode>
);

