import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routes from './routes.tsx';
import { Toaster } from 'sonner';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement // Add type assertion for the root element
);

root.render(
  // <React.StrictMode>
  <>
    <Routes />
    <Toaster position="bottom-right" richColors />
  </>
  // </React.StrictMode>
);

