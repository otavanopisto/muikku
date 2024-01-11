import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import { ChatUser } from "~/generated/client";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

/**
 * Custom hook to handle loading users from rest api.
 */
function useUsers() {
  const websocket = useChatWebsocketContext();

  const [users, setUsers] = React.useState<ChatUser[]>([]);
  const [usersWithActiveDiscussion, setUsersWithActiveDiscussion] =
    React.useState<ChatUser[]>([]);

  const [loadingUsers, setLoadingUsers] = React.useState(false);
  const [
    loadingUsersWithActiveDiscussion,
    setLoadingUsersWithActiveDiscussion,
  ] = React.useState(false);

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    fetchAllUsers();
    fetchUsersWithDiscussions();
  }, []);

  /**
   * Fetch users
   */
  const fetchAllUsers = async () => {
    setLoadingUsers(true);

    const users = await chatApi.getChatUsers({
      onlyOnline: false,
    });

    unstable_batchedUpdates(() => {
      setUsers(users);
      setLoadingUsers(false);
    });
  };

  /**
   * Fetch users that have active discussions with current user
   */
  const fetchUsersWithDiscussions = async () => {
    setLoadingUsersWithActiveDiscussion(true);

    const chatUsers = await chatApi.getPrivateDiscussions();

    chatUsers.reverse();

    unstable_batchedUpdates(() => {
      setUsersWithActiveDiscussion(chatUsers);
      setLoadingUsersWithActiveDiscussion(false);
    });
  };

  /**
   * addUserToActiveDiscussionsList
   * @param user user
   */
  const addUserToActiveDiscussionsList = (user: ChatUser) => {
    setUsersWithActiveDiscussion((prev) => [user, ...prev]);
  };

  /**
   * moveActiveDiscussionToTop
   * @param index index
   */
  const moveActiveDiscussionToTop = (index: number) => {
    setUsersWithActiveDiscussion((prev) => {
      const user = prev[index];

      const newDiscussions = [...prev];
      newDiscussions.splice(index, 1);
      newDiscussions.unshift(user);

      return newDiscussions;
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

          // Full users list
          setUsers((users) => {
            const index = users.findIndex(
              (person) => person.id === dataTyped.id
            );

            if (index !== -1) {
              const updatedPeople = [...users];
              updatedPeople[index].isOnline = true;
              return updatedPeople;
            }

            return users;
          });

          // Users with active discussion
          setUsersWithActiveDiscussion((users) => {
            const index = users.findIndex(
              (person) => person.id === dataTyped.id
            );

            if (index !== -1) {
              const updatedPeople = [...users];
              updatedPeople[index].isOnline = true;
              return updatedPeople;
            }

            return users;
          });
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
          // Full users list
          setUsers((users) => {
            const index = users.findIndex(
              (person) => person.id === dataTyped.id
            );

            if (index !== -1) {
              const updatedPeople = [...users];
              updatedPeople[index].isOnline = false;
              return updatedPeople;
            }

            return users;
          });

          // Users with active discussion
          setUsersWithActiveDiscussion((users) => {
            const index = users.findIndex(
              (person) => person.id === dataTyped.id
            );

            if (index !== -1) {
              const updatedPeople = [...users];
              updatedPeople[index].isOnline = false;
              return updatedPeople;
            }

            return users;
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

  return {
    users,
    loadingUsers,
    usersWithActiveDiscussion,
    loadingUsersWithActiveDiscussion,
    addUserToActiveDiscussionsList,
    moveActiveDiscussionToTop,
  };
}

export default useUsers;
