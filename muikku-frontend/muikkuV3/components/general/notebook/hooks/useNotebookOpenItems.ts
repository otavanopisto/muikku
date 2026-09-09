import { useLocalStorage } from "usehooks-ts";

/**
 * Persisted open/closed state for notebook list items.
 * @param storageKey storageKey
 * @param initialOpenedIds initialOpenedIds
 * @returns number[]
 */
export function useNotebookOpenItems(
  storageKey: string,
  initialOpenedIds: number[] = []
) {
  const [openedIds, setOpenedIds] = useLocalStorage<number[]>(
    storageKey,
    initialOpenedIds
  );

  /**
   * isOpen
   * @param noteId noteId
   * @returns boolean
   */
  const isOpen = (noteId: number) => openedIds.includes(noteId);

  /**
   * toggle
   * @param noteId noteId
   */
  const toggle = (noteId: number) => {
    setOpenedIds((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  };

  /**
   * openAll
   * @param noteIds noteIds
   */
  const openAll = (noteIds: number[]) => {
    setOpenedIds(noteIds);
  };

  /**
   * closeAll
   */
  const closeAll = () => {
    setOpenedIds([]);
  };

  return {
    openedIds,
    isOpen,
    toggle,
    openAll,
    closeAll,
  };
}
