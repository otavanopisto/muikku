import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import {
  ChatMessage,
  ChatUser,
  GuidanceCouncelorContact,
  UpdateBlockRequestBlockTypeEnum,
} from "~/generated/client";
import { ChatUserFilters } from "../chat-helpers";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();
const meApi = MApi.getMeApi();

/**
 * useChatSettings
 */
interface UseUsersProps {
  /**
   * current chat user
   */
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
  const [userFilters, setUserFilters] = React.useState<ChatUserFilters>({
    search: "",
    searchFilters: [],
  });

  // Users related data
  const [users, setUsers] = React.useState<ChatUser[]>([]);
  const [usersWithActiveDiscussion, setUsersWithActiveDiscussion] =
    React.useState<ChatUser[]>([]);
  const [myCounselors, setMyCounselors] =
    React.useState<GuidanceCouncelorContact[]>(null);
  const [blockedUsers, setBlockedUsers] = React.useState<ChatUser[]>([]);

  const usersRef = React.useRef([]);

  const componentMounted = React.useRef(true);

  usersRef.current = users;

  React.useEffect(() => {
    fetchAllUsers();
    fetchUsersWithDiscussions();
    fetchBlockedUsers();

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
     */
    const onChatUserLeftMsg = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: {
            id: number;
            permanent: boolean;
          } = JSON.parse(data);
          // Full users list
          setUsers((users) => {
            const index = users.findIndex(
              (person) => person.id === dataTyped.id
            );

            if (index !== -1) {
              const updatedPeople = [...users];
              if (dataTyped.permanent) {
                updatedPeople.splice(index, 1);
                return updatedPeople;
              }

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

    setUsers(users);
  };

  /**
   * Fetch users that have active discussions with current user
   */
  const fetchUsersWithDiscussions = async () => {
    const chatUsers = await chatApi.getPrivateDiscussions();

    chatUsers.reverse();

    setUsersWithActiveDiscussion(chatUsers);
  };

  /**
   * Fetch my counselors
   */
  const fetchMyCounselors = async () => {
    const counselors = await meApi.getGuidanceCounselors();

    setMyCounselors(counselors);
  };

  /**
   * Fetch blocked users
   */
  const fetchBlockedUsers = async () => {
    const blockedUsers = await chatApi.getBlocklist();

    setBlockedUsers(blockedUsers);
  };

  /**
   * Soft block user aka only hide user from my discussions and depending
   * on the block type also prevents user from sending messages to me.
   *
   * @param user target chat user
   * @param type type of block. SOFT only hides and HARD also prevents user from sending messages.
   */
  const blockUser = async (
    user: ChatUser,
    type: UpdateBlockRequestBlockTypeEnum
  ) => {
    await chatApi.updateBlock({
      updateBlockRequest: {
        blockType: type,
        targetUserEntityId: user.id,
      },
    });

    unstable_batchedUpdates(() => {
      setBlockedUsers((prev) => [...prev, user]);
      setUsersWithActiveDiscussion((prev) => {
        const index = prev.findIndex((u) => u.id === user.id);

        if (index !== -1) {
          const updatedUsers = [...prev];
          updatedUsers.splice(index, 1);
          return updatedUsers;
        }

        return prev;
      });
    });
  };

  /**
   * Unblock user
   * @param user user
   */
  const unblockUser = async (user: ChatUser) => {
    await chatApi.updateBlock({
      updateBlockRequest: {
        blockType: "NONE",
        targetUserEntityId: user.id,
      },
    });

    setBlockedUsers((prev) => {
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
   * Adds user to active discussions list
   * @param user user
   */
  const addUserToActiveDiscussionsList = (user: ChatUser) => {
    setUsersWithActiveDiscussion((prev) => {
      const index = prev.findIndex((u) => u.id === user.id);

      if (index === -1) {
        return [user, ...prev];
      }

      return prev;
    });
  };

  /**
   * Handles updating active discussions list when new message is sent
   * @param data data
   */
  const onNewMgsSentUpdateActiveDiscussions = React.useCallback(
    (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatMessage = JSON.parse(data);

          const sender = usersRef.current.find((u) =>
            [
              `user-${dataTyped.sourceUserEntityId}`,
              dataTyped.targetIdentifier,
            ].includes(u.identifier)
          );

          if (sender) {
            addUserToActiveDiscussionsList(sender);
          }
        }
      }
    },
    []
  );

  /**
   * Update user filters
   */
  const updateUserFilters = React.useCallback(
    <T extends keyof ChatUserFilters>(key: T, value: ChatUserFilters[T]) => {
      setUserFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
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

  // Memoized blocked users with status
  const blockedUsersWithStatusMemoized = React.useMemo(() => {
    if (!blockedUsers || !users) {
      return [];
    }

    return blockedUsers.map((user) => {
      const userWithStatus = users.find((activity) => activity.id === user.id);

      return {
        ...user,
        ...userWithStatus,
      };
    });
  }, [blockedUsers, users]);

  return {
    userFilters,
    updateUserFilters,
    users,
    counselorUsers: counselorUsersMemoized,
    usersWithActiveDiscussion: usersWithActiveDiscussionMemoized,
    blockedUsers: blockedUsersWithStatusMemoized,
    blockUser,
    unblockUser,
    onNewMgsSentUpdateActiveDiscussions,
  };
}

export default useUsers;
