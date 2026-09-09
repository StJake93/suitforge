import type { BuildContext, ItemDefinition, ItemPart } from '../types';

/** Undersuit legs shared by suit-style leg items. */
export function legUndersuit({ ref, kit }: BuildContext, role: 'secondary' | 'primary' = 'secondary'): ItemPart[] {
  const thigh = () =>
    kit.group(
      kit.at(kit.mesh(kit.sphere(ref.thighR * 1.1, 14), role), 0, 0, 0),
      kit.at(kit.mesh(kit.cyl(ref.thighR * 1.06, ref.thighR * 0.98, ref.thighLen, 12), role), 0, ref.thighLen * 0.5, 0),
      kit.at(kit.mesh(kit.sphere(ref.shinR * 1.16, 12), role), 0, ref.thighLen, 0),
    );
  const shin = () =>
    kit.group(
      kit.at(kit.mesh(kit.cyl(ref.shinR * 1.1, ref.shinR * 0.98, ref.shinLen, 12), role), 0, ref.shinLen * 0.5, 0),
      kit.at(kit.mesh(kit.sphere(ref.shinR * 0.82, 10), role), 0, ref.shinLen, 0),
    );
  const shorts = kit.at(kit.mesh(kit.rbox(ref.pelvisHalfW * 2 * 1.06, ref.hu * 0.66, ref.pelvisDepth * 1.08, ref.pelvisDepth * 0.2), role), 0, -ref.hu * 0.02, 0);
  return [
    { socket: 'pelvis', object: shorts },
    { socket: 'thighR', object: thigh() },
    { socket: 'thighL', object: thigh() },
    { socket: 'shinR', object: shin() },
    { socket: 'shinL', object: shin() },
  ];
}

export const vanguard: ItemDefinition[] = [
  {
    id: 'legs.undersuit',
    slot: 'legs',
    name: 'Undersuit Legs',
    tags: ['light', 'stealth'],
    build: (ctx) => ({ parts: legUndersuit(ctx) }),
  },
  {
    id: 'legs.vanguard-greaves',
    slot: 'legs',
    name: 'Vanguard Greaves',
    tags: ['armour', 'tech', 'heavy'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const parts = legUndersuit(ctx);
      const thighPlate = () => kit.at(kit.mesh(kit.plate(ref.thighR * 2.0, ref.thighLen * 0.62, ref.thighR * 0.5, ref.thighR * 0.3), 'primary'), 0, ref.thighLen * 0.42, ref.thighR * 0.9);
      const kneeCap = () => kit.at(kit.mesh(kit.sphere(ref.shinR * 1.25, 10), 'primary'), 0, ref.shinLen * 0.04, ref.shinR * 0.55);
      const shinPlate = () => kit.at(kit.mesh(kit.plate(ref.shinR * 1.9, ref.shinLen * 0.6, ref.shinR * 0.45, ref.shinR * 0.3), 'secondary'), 0, ref.shinLen * 0.5, ref.shinR * 0.85);
      const stripe = () => kit.at(kit.mesh(kit.box(ref.thighR * 0.25, ref.thighLen * 0.5, ref.thighR * 0.1), 'accent'), ref.thighR * 0.95, ref.thighLen * 0.42, ref.thighR * 0.45);
      const [tr, tl] = kit.mirror(() => kit.group(thighPlate(), stripe()));
      const [sr, sl] = kit.mirror(() => kit.group(kneeCap(), shinPlate()));
      parts.find((p) => p.socket === 'thighR')!.object.add(tr);
      parts.find((p) => p.socket === 'thighL')!.object.add(tl);
      parts.find((p) => p.socket === 'shinR')!.object.add(sr);
      parts.find((p) => p.socket === 'shinL')!.object.add(sl);
      return { parts };
    },
  },
];
