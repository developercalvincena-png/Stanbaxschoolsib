import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { hydrateFromSupabase, installLocalStorageSync } from './lib/supabase.ts';
import './index.css';

installLocalStorageSync();

const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
};

// Pull shared remote state into localStorage before the app mounts so every
// collection initializer reads the latest data. Falls back instantly when
// Supabase isn't configured or is unreachable.
void hydrateFromSupabase().finally(renderApp);
