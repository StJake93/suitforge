// R-SAVE-04 — render the current view at 2× and hand the viewer a PNG.
import { Vector2 } from 'three';
import { bridge } from './bridge';

export interface ExportOptions {
  transparent: boolean;
  scale?: number;
  background?: string;
}

export function renderPng(opts: ExportOptions): string | null {
  const { gl, scene, camera } = bridge;
  if (!gl || !scene || !camera) return null;
  const scale = opts.scale ?? 2;
  const size = gl.getSize(new Vector2());
  const dpr = gl.getPixelRatio();
  gl.setPixelRatio(dpr * scale);
  gl.render(scene, camera);
  const webgl = gl.domElement.toDataURL('image/png');
  gl.setPixelRatio(dpr);
  gl.setSize(size.x, size.y, false);
  return webgl;
}

export async function composeWithBackground(dataUrl: string, background: string): Promise<string> {
  const img = new Image();
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error('image load failed'));
    img.src = dataUrl;
  });
  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(c.width / 2, c.height * 0.45, c.height * 0.1, c.width / 2, c.height * 0.5, c.height * 0.8);
  grad.addColorStop(0, '#1a2030');
  grad.addColorStop(1, background);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0);
  return c.toDataURL('image/png');
}

export async function exportPng(name: string, opts: ExportOptions): Promise<boolean> {
  const raw = renderPng(opts);
  if (!raw) return false;
  const url = opts.transparent ? raw : await composeWithBackground(raw, opts.background ?? '#0b0e14');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/[^\w\- ]+/g, '').trim() || 'hero'}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}
