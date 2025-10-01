import { atom } from "jotai";
import type { GuiderStudent } from "~/generated/client";

// Current student atom
export const currentStudentAtom = atom<{
  currentStudent: GuiderStudent | null;
  currentStudentState: "idle" | "loading" | "ready" | "error";
}>({
  currentStudent: null,
  currentStudentState: "idle",
});
