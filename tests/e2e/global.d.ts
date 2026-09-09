import type { useStore } from '../../src/state/store';
import type { registry } from '../../src/library';

declare global {
  interface Window {
    __suitforge?: {
      store: typeof useStore;
      registry: typeof registry;
      bridge: { gl: unknown; scene: unknown; camera: unknown };
    };
  }
}
export {};
