// UX §5 — item card with hover/focus preview, click commit, touch long-press preview.
import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import type { Palette } from '@/character/types';
import { useThumbnail } from '@/engine/thumbnails';
import type { ItemDefinition } from '@/library/types';
import { I } from './icons';

interface Props {
  item: ItemDefinition | null;
  equipped: boolean;
  previewing: boolean;
  palette: Palette;
  override?: Partial<Palette>;
  skinTone: string;
  onPreview: (id: string | null) => void;
  onPreviewEnd: () => void;
  onEquip: (id: string | null) => void;
}

export function ItemCard({
  item,
  equipped,
  previewing,
  palette,
  override,
  skinTone,
  onPreview,
  onPreviewEnd,
  onEquip,
}: Props) {
  const url = useThumbnail(item?.id ?? null, palette, override, skinTone);
  const id = item?.id ?? null;
  const touch = useRef<{ timer: number | null; longPressed: boolean }>({ timer: null, longPressed: false });

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') return;
    touch.current.longPressed = false;
    touch.current.timer = window.setTimeout(() => {
      touch.current.longPressed = true;
      onPreview(id);
    }, 400);
  };
  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') return;
    if (touch.current.timer) clearTimeout(touch.current.timer);
    if (touch.current.longPressed) {
      onPreviewEnd();
      e.preventDefault();
    }
  };
  const onClick = () => {
    if (touch.current.longPressed) {
      touch.current.longPressed = false;
      return;
    }
    onEquip(id);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEquip(id);
    }
  };

  return (
    <button
      className={`card${equipped ? ' equipped' : ''}${previewing ? ' previewing' : ''}${item ? '' : ' none'}`}
      data-testid={`card-${id ?? 'none'}`}
      aria-pressed={equipped}
      aria-label={item ? item.name : 'None'}
      onPointerEnter={(e) => e.pointerType !== 'touch' && onPreview(id)}
      onPointerLeave={(e) => e.pointerType !== 'touch' && onPreviewEnd()}
      onFocus={() => onPreview(id)}
      onBlur={onPreviewEnd}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
      onKeyDown={onKey}
    >
      <div className={`thumb${item && !url ? ' loading' : ''}`}>
        {item ? url && <img src={url} alt="" draggable={false} /> : <I.x />}
      </div>
      <div className="card-name">{item ? item.name : 'None'}</div>
      {item?.hands && <span className="card-hands">{item.hands === 2 ? '2H' : '1H'}</span>}
      {equipped && (
        <span className="card-badge" aria-hidden>
          <I.check />
        </span>
      )}
    </button>
  );
}
