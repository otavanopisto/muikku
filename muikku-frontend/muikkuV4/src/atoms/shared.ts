import { atom } from "jotai";

// Global initialization
export const globalInitializedAtom = atom(false);

// Workspace initialization
export const workspaceInitializedAtom = atom<string | null>(null);
export const currentWorkspaceAtom = atom<string | null>(null);
