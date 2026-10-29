import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { startCloudSync } from './lib/firebase';
import './index.css';

void startCloudSync();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
