import React from 'react';
import ReactDOM from 'react-dom/client';
import { DesignTokensImport } from './components/DesignTokensImport';
import '@penpot/plugin-styles/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DesignTokensImport />
  </React.StrictMode>
);
