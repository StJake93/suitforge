// R-LIB-06 — lazy offscreen thumbnails, cached per (item, palette, override, skin).
import { Box3, Color, DirectionalLight, HemisphereLight, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { useEffect, useState } from 'react';
import { REF } from '@/character/metrics';
import type { Palette } from '@/character/types';
import { MaterialSet } from '@/library/materials';
import { getBaked } from './builds';
import { makeEnvironment } from './environment';

const SIZE = 128;
const BATCH = 4;

type Listener = (url: string) => void;

class ThumbnailService {
  private renderer: WebGLRenderer | null = null;
  private scene = new Scene();
  private camera = new PerspectiveCamera(28, 1, 0.01, 20);
  private materials = new MaterialSet();
  private cache = new Map<string, string>();
  private waiting = new Map<string, { itemId: string; input: { palette: Palette; override?: Partial<Palette>; skinTone: string }; listeners: Set<Listener> }>();
  private queue: string[] = [];
  private scheduled = false;

  private ensure(): WebGLRenderer | null {
    if (this.renderer) return this.renderer;
    try {
      const r = new WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: false });
      r.setPixelRatio(Math.min(2, typeof devicePixelRatio === 'number' ? devicePixelRatio : 1));
      r.setSize(SIZE, SIZE, false);
      r.toneMapping = ACESFilmicToneMapping;
      r.outputColorSpace = SRGBColorSpace;
      this.scene.environment = makeEnvironment(r);
      this.scene.environmentIntensity = 0.9;
      this.scene.add(new HemisphereLight(new Color('#c9d6ff'), new Color('#2a2420'), 0.6));
      const key = new DirectionalLight('#fff4e6', 2.2);
      key.position.set(2.5, 4, 3);
      this.scene.add(key);
      const rim = new DirectionalLight('#7fd0ff', 1.4);
      rim.position.set(-2, 3, -4);
      this.scene.add(rim);
      this.renderer = r;
      return r;
    } catch {
      return null;
    }
  }

  static key(itemId: string, palette: Palette, override: Partial<Palette> | undefined, skinTone: string): string {
    const o = override ? `${override.primary ?? ''},${override.secondary ?? ''},${override.accent ?? ''}` : '';
    return `${itemId}|${palette.primary}${palette.secondary}${palette.accent}|${o}|${skinTone}`;
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  request(key: string, itemId: string, input: { palette: Palette; override?: Partial<Palette>; skinTone: string }, listener: Listener): () => void {
    const hit = this.cache.get(key);
    if (hit) {
      listener(hit);
      return () => {};
    }
    let w = this.waiting.get(key);
    if (!w) {
      w = { itemId, input, listeners: new Set() };
      this.waiting.set(key, w);
      this.queue.push(key);
      this.schedule();
    }
    w.listeners.add(listener);
    return () => {
      w?.listeners.delete(listener);
    };
  }

  private schedule() {
    if (this.scheduled) return;
    this.scheduled = true;
    const run = () => {
      this.scheduled = false;
      this.flush();
      if (this.queue.length) this.schedule();
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
    else setTimeout(run, 0);
  }

  private flush() {
    const r = this.ensure();
    if (!r) return;
    for (let i = 0; i < BATCH && this.queue.length; i++) {
      const key = this.queue.shift()!;
      const w = this.waiting.get(key);
      if (!w) continue;
      this.waiting.delete(key);
      if (w.listeners.size === 0 && !this.cache.has(key)) continue; // nobody wants it any more
      const url = this.render(r, w.itemId, w.input);
      if (url) {
        this.cache.set(key, url);
        for (const l of w.listeners) l(url);
      }
    }
  }

  private render(r: WebGLRenderer, itemId: string, input: { palette: Palette; override?: Partial<Palette>; skinTone: string }): string | null {
    const baked = getBaked(itemId);
    if (!baked) return null;
    this.materials.update(input);
    const root = new Object3D();
    for (const part of baked.parts) {
      if (part.socket.endsWith('L')) continue; // right side only for paired items
      const obj = part.object.clone();
      this.materials.apply(obj);
      const t = REF.sockets[part.socket];
      const holder = new Object3D();
      holder.position.copy(t.position);
      holder.quaternion.copy(t.quaternion);
      holder.add(obj);
      root.add(holder);
    }
    this.scene.add(root);
    root.updateMatrixWorld(true);
    const box = new Box3().setFromObject(root);
    const centre = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const radius = Math.max(size.x, size.y, size.z) * 0.5 || 0.1;
    const dist = (radius / Math.tan((this.camera.fov * Math.PI) / 360)) * 1.25;
    const dir = new Vector3(0.55, 0.42, 1).normalize();
    this.camera.position.copy(centre).addScaledVector(dir, dist);
    this.camera.lookAt(centre);
    this.camera.updateProjectionMatrix();
    r.render(this.scene, this.camera);
    const url = r.domElement.toDataURL('image/png');
    this.scene.remove(root);
    return url;
  }
}

export const thumbnails = new ThumbnailService();

export function useThumbnail(itemId: string | null, palette: Palette, override: Partial<Palette> | undefined, skinTone: string): string | null {
  const key = itemId ? ThumbnailService.key(itemId, palette, override, skinTone) : null;
  const [url, setUrl] = useState<string | null>(() => (key ? (thumbnails.get(key) ?? null) : null));
  useEffect(() => {
    if (!key || !itemId) return;
    const hit = thumbnails.get(key);
    if (hit) {
      setUrl(hit);
      return;
    }
    setUrl(null);
    return thumbnails.request(key, itemId, { palette, override, skinTone }, setUrl);
    // palette/override are covered by key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, itemId]);
  return url;
}
