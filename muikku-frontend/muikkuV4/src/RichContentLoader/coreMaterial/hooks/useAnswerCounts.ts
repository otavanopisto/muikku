import { useMaterialContentContext } from "../MaterialContentProvider";

/**
 * Hook to get the answer counts
 * @returns The answer counts
 */
export function useAnswerCounts() {
  const { answersChecked, answerRegistry } = useMaterialContentContext();
  const entries = Object.keys(answerRegistry ?? {});
  const total = entries.length;
  const correct = entries.filter((k) => answerRegistry[k]).length;
  return { answersChecked, total, correct };
}
