import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import { ChatUser, GuidanceCouncelorContact } from "~/generated/client";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();
const meApi = MApi.getMeApi();

/**
 * useChatSettings
 */
interface UseUsersProps {
  currentUser: ChatUser;
}

/**
 * Custom hook to handle loading users from rest api.
 * @param props props
 */
function useUsers(props: UseUsersProps) {
  const { currentUser } = props;

  const websocket = useChatWebsocketContext();

  // Filters
  const [searchUsers, setSearchUsers] = React.useState<string>("");

  // Users related data
  const [users, setUsers] = React.useState<ChatUser[]>([]);
  const [usersWithActiveDiscussion, setUsersWithActiveDiscussion] =
    React.useState<ChatUser[]>([]);
  const [myCounselors, setMyCounselors] =
    React.useState<GuidanceCouncelorContact[]>(null);

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    fetchAllUsers();
    fetchUsersWithDiscussions();

    if (currentUser.type === "STUDENT") {
      fetchMyCounselors();
    }
  }, [currentUser.type]);

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

    /**
     * ChatUsersNickChange
     * @param data data from server.
     */
    const ChatUsersNickChange = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped = JSON.parse(data) as {
            userEntityId: number;
            nick: string;
          };

          // Full users list
          setUsers((users) => {
            const index = users.findIndex(
              (person) => person.id === dataTyped.userEntityId
            );

            if (index !== -1) {
              const updatedPeople = [...users];
              updatedPeople[index].nick = dataTyped.nick;
              return updatedPeople;
            }

            return users;
          });

          // Users with active discussion
          setUsersWithActiveDiscussion((users) => {
            const index = users.findIndex(
              (person) => person.id === dataTyped.userEntityId
            );

            if (index !== -1) {
              const updatedPeople = [...users];
              updatedPeople[index].nick = dataTyped.nick;
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
    websocket.addEventCallback("chat:nick-change", ChatUsersNickChange);

    return () => {
      // Remove callback when unmounting
      websocket.removeEventCallback("chat:user-joined", onChatUserJoinedMsg);
      websocket.removeEventCallback("chat:user-left", onChatUserLeftMsg);
    };
  }, [websocket]);

  /**
   * Fetch users
   */
  const fetchAllUsers = async () => {
    const users = await chatApi.getChatUsers({
      onlyOnline: false,
    });

    unstable_batchedUpdates(() => {
      setUsers(users);
    });
  };

  /**
   * Fetch users that have active discussions with current user
   */
  const fetchUsersWithDiscussions = async () => {
    const chatUsers = await chatApi.getPrivateDiscussions();

    chatUsers.reverse();

    unstable_batchedUpdates(() => {
      setUsersWithActiveDiscussion(chatUsers);
    });
  };

  /**
   * Fetch my counselors
   */
  const fetchMyCounselors = async () => {
    const counselors = await meApi.getGuidanceCounselors();

    unstable_batchedUpdates(() => {
      setMyCounselors(counselors);
    });
  };

  /**
   * Adds user to active discussions list
   * @param user user
   */
  const addUserToActiveDiscussionsList = (user: ChatUser) => {
    setUsersWithActiveDiscussion((prev) => [user, ...prev]);
  };

  /**
   * Removes user from active discussions list
   * @param user user
   */
  const removeUserFromActiveDiscussionsList = (user: ChatUser) => {
    setUsersWithActiveDiscussion((prev) => {
      const index = prev.findIndex((u) => u.id === user.id);

      if (index !== -1) {
        const updatedUsers = [...prev];
        updatedUsers.splice(index, 1);
        return updatedUsers;
      }

      return prev;
    });
  };

  /**
   * Moves active discussion to top of the list
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

  const updateSearchUsers = React.useCallback(
    (search: string) => {
      setSearchUsers(search);
    },
    [setSearchUsers]
  );

  // Memoized users with active discussion
  const usersWithActiveDiscussionMemoized = React.useMemo(() => {
    // Remove users that are already in myCounselors list
    if (myCounselors && myCounselors.length) {
      let listWithoutCouncelors = [...usersWithActiveDiscussion];

      listWithoutCouncelors = listWithoutCouncelors.filter((user) => {
        const counselor = myCounselors.find(
          (counselor) => counselor.userEntityId === user.id
        );

        return !counselor;
      });

      return listWithoutCouncelors;
    }

    return usersWithActiveDiscussion;
  }, [myCounselors, usersWithActiveDiscussion]);

  // Memoized counselor users
  const counselorUsersMemoized = React.useMemo(() => {
    if (myCounselors && myCounselors.length && users.length) {
      const councerlorIds = myCounselors.map(
        (counselor) => counselor.userEntityId
      );

      return users.filter((user) => councerlorIds.includes(user.id));
    }

    return [];
  }, [myCounselors, users]);

  return {
    searchUsers,
    updateSearchUsers,
    users,
    counselorUsers: counselorUsersMemoized,
    usersWithActiveDiscussion: usersWithActiveDiscussionMemoized,
    addUserToActiveDiscussionsList,
    removeUserFromActiveDiscussionsList,
    moveActiveDiscussionToTop,
  };
}

export default useUsers;
