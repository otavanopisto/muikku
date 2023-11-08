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
   * Fetch rooms
   */
  const fetchPeople = async () => {
    setLoadingPeople(true);

    const rooms = await chatApi.getChatUsers();

    unstable_batchedUpdates(() => {
      setPeople(rooms);
      setLoadingPeople(false);
    });
  };

  React.useEffect(() => {
    /**
     * onChatUserJoinedMsg
     * @param data user joined chat.
     */
    const onChatUserJoinedMsg = (data: ChatUser) => {
      console.log("onChatUserJoinedMsg", data);
      if (componentMounted.current) {
        setPeople((people) => [...people, data]);
      }
    };

    /**
     * onChatUserLeftMsg
     * @param data data from server.
     * @param data.id user left chat.
     */
    const onChatUserLeftMsg = (data: { id: number }) => {
      console.log("onChatUserLeftMsg", data);
      if (componentMounted.current) {
        setPeople((people) => {
          const index = people.findIndex((person) => person.id === data.id);

          if (index !== -1) {
            const newPeople = [...people];
            newPeople.splice(index, 1);
            return newPeople;
          }

          return people;
        });
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

  return { people, loadingPeople, searchPeople, setSearchPeople };
}

export default usePeople;
