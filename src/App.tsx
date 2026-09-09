import { useEffect, useState } from 'react';
import { Viewport } from '@/engine/Viewport';
import { registry } from '@/library';
import { readAutosave, writeAutosave } from '@/state/persist';
import { fromShareString, sanitise, shareStringFromHash } from '@/state/serialize';
import { useStore } from '@/state/store';
import { BodyPanel } from '@/ui/BodyPanel';
import { useHotkeys } from '@/ui/hooks/useHotkeys';
import { ItemDrawer } from '@/ui/ItemDrawer';
import { KeyboardHelp } from '@/ui/KeyboardHelp';
import { PalettePanel } from '@/ui/PalettePanel';
import { SavesDialog } from '@/ui/SavesDialog';
import { SlotRail } from '@/ui/SlotRail';
import { Toasts } from '@/ui/Toast';
import { TopBar } from '@/ui/TopBar';
import { TurntableBar } from '@/ui/TurntableBar';
import { RigCheck } from '@/dev/RigCheck';
import { Thumbs } from '@/dev/Thumbs';

type Route = 'app' | 'rigcheck' | 'thumbs';
const routeFromHash = (): Route =>
  location.hash.startsWith('#/rigcheck')
    ? 'rigcheck'
    : location.hash.startsWith('#/thumbs')
      ? 'thumbs'
      : 'app';

/** Boot: share link wins, else autosave, else the seeded default. */
function useBoot() {
  useEffect(() => {
    const s = useStore.getState();
    const share = shareStringFromHash(location.hash);
    if (share) {
      const r = fromShareString(share, registry);
      if (r) {
        s.load(r.character, { history: false });
        if (r.dropped.length) s.toast('Some items were missing and were removed');
        return;
      }
      s.toast('That share link could not be read');
    }
    const auto = readAutosave();
    if (auto) s.load(sanitise(auto, registry).character, { history: false });
  }, []);
  useEffect(() => {
    let t: number | null = null;
    return useStore.subscribe((state, prev) => {
      if (state.character === prev.character) return;
      if (t) clearTimeout(t);
      t = window.setTimeout(() => writeAutosave(state.character), 250);
    });
  }, []);
}

export default function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  if (route === 'rigcheck') return <RigCheck />;
  if (route === 'thumbs') return <Thumbs />;
  return <Creator />;
}

function Creator() {
  useBoot();
  useHotkeys();
  return (
    <div className="app">
      <div className="app-bg" />
      <Viewport />
      <div className="overlay">
        <div className="banner">SuitForge works best on a larger screen.</div>
        <TopBar />
        <SlotRail />
        <ItemDrawer />
        <BodyPanel />
        <PalettePanel />
        <TurntableBar />
        <Toasts />
        <KeyboardHelp />
        <SavesDialog />
      </div>
    </div>
  );
}
