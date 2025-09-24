import { createStore, type Atom, type WritableAtom } from "jotai";

/**
 * jotaiStore - Jotai store
 */
export const jotaiStore = createStore();

/**
 * getAtomValue - Get atom value
 * @param atom - Atom to get value from
 * @returns Value of the atom
 */
export function getAtomValue<T>(atom: Atom<T>): T {
  return jotaiStore.get(atom);
}

/**
 * setAtomValue - Set atom value
 * @param atom - Atom to set value for
 * @param value - Value to set
 */
export function setAtomValue<T>(
  atom: WritableAtom<T, [T], unknown>,
  value: T
): void {
  jotaiStore.set(atom, value);
}

/**
 * executeAtomAction - Execute atom actions (for loaders)
 * @param atom - Atom to execute
 * @param args - Arguments to pass to the atom
 */
export async function executeAtomAction<T, Args extends unknown[]>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  atom: WritableAtom<T, Args, any>,
  ...args: Args
): Promise<void> {
  await jotaiStore.set(atom, ...args);
}
