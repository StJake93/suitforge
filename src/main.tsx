import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { bridge } from './engine/bridge';
import { registry } from './library';
import { useStore } from './state/store';

declare global {
  interface Window {
    __suitforge?: { store: typeof useStore; registry: typeof registry; bridge: typeof bridge };
  }
}
window.__suitforge = { store: useStore, registry, bridge };

function webgl2(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}

const root = createRoot(document.getElementById('root')!);
if (!webgl2()) {
  root.render(
    <div className="fallback">
      <div>
        <h1>SuitForge needs WebGL 2</h1>
        <p>Your browser or device could not start a 3D context. Try the latest Chrome, Edge, Firefox or Safari with hardware acceleration enabled.</p>
      </div>
    </div>,
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
