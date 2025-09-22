import { createStore, type Atom, type WritableAtom } from "jotai";

export const jotaiStore = createStore();

export function getAtomValue<T>(atom: Atom<T>): T {
  return jotaiStore.get(atom);
}

export function setAtomValue<T>(
  atom: WritableAtom<T, [T], unknown>,
  value: T
): void {
  jotaiStore.set(atom, value);
}

// NEW: Execute atom actions (for loaders)
export async function executeAtomAction<T, Args extends unknown[]>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  atom: WritableAtom<T, Args, any>,
  ...args: Args
): Promise<void> {
  await jotaiStore.set(atom, ...args);
}
