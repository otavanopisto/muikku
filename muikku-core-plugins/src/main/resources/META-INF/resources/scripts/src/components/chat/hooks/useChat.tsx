// Hook to handle loading roooms and people list from rest api.
import * as React from "react";
import usePeople from "./usePeople";
import useRooms from "./useRooms";

export type UseChat = ReturnType<typeof useChat>;

/**
 * useChat
 * @param userId userId
 */
function useChat(userId: number) {
  const { searchPeople, people, loadingPeople } = usePeople();
  const { searchRooms, rooms, loadingRooms } = useRooms();
  const [peopleSelected, setPeopleSelected] = React.useState<number[]>([]);
  const [roomsSelected, setRoomsSelected] = React.useState<string[]>([]);

  // Whether to show the control box or bubble
  const [minimized, setMinimized] = React.useState<boolean>(false);

  // These are the private rooms that are opened
  const openPrivateRooms = React.useMemo(
    () => people.filter((p) => peopleSelected.includes(p.id)),
    [peopleSelected, people]
  );

  // These are the public rooms that are opened
  const openPublicRooms = React.useMemo(
    () => rooms.filter((r) => roomsSelected.includes(r.identifier)),
    [roomsSelected, rooms]
  );

  // Toggles the control box
  const toggleControlBox = React.useCallback(() => {
    setMinimized(!minimized);
  }, [minimized]);

  return {
    userId,
    loadingPeople,
    loadingRooms,
    people,
    rooms,
    searchPeople,
    searchRooms,
    setRoomsSelected,
    setPeopleSelected,
    openPublicRooms,
    openPrivateRooms,
    minimized,
    toggleControlBox,
  };
}

export default useChat;
