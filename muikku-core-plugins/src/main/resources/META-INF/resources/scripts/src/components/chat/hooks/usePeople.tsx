import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import { ChatUser } from "~/generated/client";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

/**
 * Custom hook to handle loading people from rest api.
 */
function usePeople() {
  const websocket = useChatWebsocketContext();

  const [people, setPeople] = React.useState<ChatUser[]>([]);
  const [loadingPeople, setLoadingPeople] = React.useState<boolean>(false);
  const [searchPeople, setSearchPeople] = React.useState<string>("");

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    fetchPeople();
  }, []);

  /**
   * Fetch people
   */
  const fetchPeople = async () => {
    setLoadingPeople(true);

    const people = await chatApi.getChatUsers();

    unstable_batchedUpdates(() => {
      setPeople(people);
      setLoadingPeople(false);
    });
  };

  React.useEffect(() => {
    /**
     * onChatUserJoinedMsg
     * @param data user joined chat.
     */
    const onChatUserJoinedMsg = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatUser = JSON.parse(data);
          setPeople((people) => [...people, dataTyped]);
        }
      }
    };

    /**
     * onChatUserLeftMsg
     * @param data data from server.
     * @param data.id user left chat.
     */
    const onChatUserLeftMsg = (data: { id: number }) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: {
            id: number;
          } = JSON.parse(data);
          setPeople((people) => {
            const index = people.findIndex(
              (person) => person.id === dataTyped.id
            );

            if (index !== -1) {
              const updatedPeople = [...people];
              updatedPeople.splice(index, 1);
              return updatedPeople;
            }

            return people;
          });
        }
      }
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocket.addEventCallback("chat:user-joined", onChatUserJoinedMsg);
    websocket.addEventCallback("chat:user-left", onChatUserLeftMsg);

    return () => {
      // Remove callback when unmounting
      websocket.removeEventCallback("chat:user-joined", onChatUserJoinedMsg);
      websocket.removeEventCallback("chat:user-left", onChatUserLeftMsg);
    };
  }, [websocket]);

  const updateSearchPeople = React.useCallback((searchQuery: string) => {
    setSearchPeople(searchQuery);
  }, []);

  return { people, loadingPeople, searchPeople, updateSearchPeople };
}

export default usePeople;
