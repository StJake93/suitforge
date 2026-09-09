import type { Camera, Scene, WebGLRenderer } from 'three';

/** Handles to the live renderer for export and test hooks. */
export const bridge: { gl: WebGLRenderer | null; scene: Scene | null; camera: Camera | null } = {
  gl: null,
  scene: null,
  camera: null,
};
