// Undo/redo ring for immutable snapshots (R-UI-07).
export interface History<T> {
  past: T[];
  future: T[];
}

export const HISTORY_LIMIT = 120;

export const emptyHistory = <T>(): History<T> => ({ past: [], future: [] });

export function push<T>(h: History<T>, snapshot: T): History<T> {
  const past =
    h.past.length >= HISTORY_LIMIT ? h.past.slice(h.past.length - HISTORY_LIMIT + 1) : h.past.slice();
  past.push(snapshot);
  return { past, future: [] };
}

export function undo<T>(h: History<T>, current: T): { history: History<T>; value: T } | null {
  if (h.past.length === 0) return null;
  const past = h.past.slice();
  const value = past.pop() as T;
  return { history: { past, future: [current, ...h.future] }, value };
}

export function redo<T>(h: History<T>, current: T): { history: History<T>; value: T } | null {
  if (h.future.length === 0) return null;
  const [value, ...future] = h.future;
  return { history: { past: [...h.past, current], future }, value: value as T };
}
