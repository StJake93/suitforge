// MaterialSet: one set of real materials per mounted item; palette changes mutate colours in place (R-CHAR-06).
import { Color, DoubleSide, Material, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import type { Palette } from '@/character/types';
import { MATERIAL_ROLES, type MaterialRole } from './types';

export interface MaterialInputs {
  palette: Palette;
  override?: Partial<Palette>;
  skinTone: string;
}

export class MaterialSet {
  readonly materials: Record<MaterialRole, MeshStandardMaterial>;
  private lastKey = '';

  constructor() {
    const std = (opts: ConstructorParameters<typeof MeshStandardMaterial>[0]) =>
      new MeshStandardMaterial({ flatShading: true, ...opts });
    this.materials = {
      primary: std({ color: '#888', metalness: 0.55, roughness: 0.42 }),
      secondary: std({ color: '#444', metalness: 0.25, roughness: 0.7 }),
      accent: std({ color: '#fff', metalness: 0.6, roughness: 0.3, emissiveIntensity: 0.25 }),
      metal: std({ color: '#c9ccd3', metalness: 0.95, roughness: 0.28 }),
      dark: std({ color: '#15171c', metalness: 0.1, roughness: 0.9 }),
      glass: new MeshPhysicalMaterial({ color: '#203040', metalness: 0.2, roughness: 0.06, transparent: true, opacity: 0.78, side: DoubleSide, flatShading: true, envMapIntensity: 1.6 }),
      glow: std({ color: '#fff', emissive: '#fff', emissiveIntensity: 1.6, roughness: 1, metalness: 0 }),
      skin: new MeshStandardMaterial({ color: '#c68642', metalness: 0, roughness: 0.75 }),
    };
  }

  get(role: MaterialRole): Material {
    return this.materials[role];
  }

  update(input: MaterialInputs): void {
    const p = { ...input.palette, ...input.override };
    const key = `${p.primary}|${p.secondary}|${p.accent}|${input.skinTone}`;
    if (key === this.lastKey) return;
    this.lastKey = key;
    const m = this.materials;
    m.primary.color.set(p.primary);
    m.secondary.color.set(p.secondary);
    m.accent.color.set(p.accent);
    m.accent.emissive.set(p.accent);
    m.glass.color.copy(new Color(p.accent).lerp(new Color('#06090f'), 0.6));
    m.glow.color.set(p.accent);
    m.glow.emissive.set(p.accent);
    m.skin.color.set(input.skinTone);
  }

  /** Replace role-stub materials on every mesh under `root` with this set's materials. */
  apply(root: Object3D): void {
    root.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      const role = (mesh.material as Material | undefined)?.userData?.role as MaterialRole | undefined;
      if (role && MATERIAL_ROLES.includes(role)) mesh.material = this.materials[role];
    });
  }

  dispose(): void {
    for (const m of Object.values(this.materials)) m.dispose();
  }
}
