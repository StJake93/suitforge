import { createContext, useContext } from 'react';
import type { Group } from 'three';
import type { SocketId } from '@/character/slots';

export type SocketGroups = Record<SocketId, Group>;

export const SocketsContext = createContext<SocketGroups | null>(null);

export function useSockets(): SocketGroups {
  const s = useContext(SocketsContext);
  if (!s) throw new Error('useSockets outside CharacterRig');
  return s;
}
