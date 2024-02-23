import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import {
  ChatMessage,
  ChatUser,
  GuidanceCouncelorContact,
} from "~/generated/client";
import { ChatUserFilters, generateHash } from "../chat-helpers";
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
    searchFilters: ["offline", "online", "students", "staff"],
  });

  // Users related data
  const [users, setUsers] = React.useState<ChatUser[]>([]);
  // Discussions that currently are active
  const [bookmarkedUsers, setBookmarkedUsers] = React.useState<ChatUser[]>([]);
  const [myCounselors, setMyCounselors] =
    React.useState<GuidanceCouncelorContact[]>(null);
  const [blockedUsers, setBlockedUsers] = React.useState<ChatUser[]>([]);

  const usersRef = React.useRef([]);

  const componentMounted = React.useRef(true);

  usersRef.current = users;

  // When current user visibility changes we need to fetch all users again
  React.useEffect(() => {
    fetchAllUsers();
  }, [currentUser.visibility]);

  React.useEffect(() => {
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
              updatedPeople[index].nick = dataTyped.nick;
              updatedPeople[index].presence = "ONLINE";
              return updatedPeople;
            } else {
              return [...users, dataTyped];
            }
          });

          // Users with active discussion
          setBookmarkedUsers((users) => {
            const index = users.findIndex(
              (person) => person.id === dataTyped.id
            );

            if (index !== -1) {
              const updatedPeople = [...users];
              updatedPeople[index].nick = dataTyped.nick;
              updatedPeople[index].presence = "ONLINE";
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
            reason: "OFFLINE" | "HIDDEN" | "PERMANENT";
          } = JSON.parse(data);
          // Full users list
          setUsers((users) => {
            const index = users.findIndex(
              (person) => person.id === dataTyped.id
            );

            if (index !== -1) {
              const updatedPeople = [...users];

              switch (dataTyped.reason) {
                case "OFFLINE":
                  updatedPeople[index].presence = "OFFLINE";
                  break;
                case "HIDDEN":
                case "PERMANENT":
                  updatedPeople.splice(index, 1);
                  break;
              }

              return updatedPeople;
            }

            return users;
          });

          // Users with active discussion
          setBookmarkedUsers((users) => {
            const index = users.findIndex(
              (person) => person.id === dataTyped.id
            );

            if (index !== -1) {
              const updatedPeople = [...users];

              switch (dataTyped.reason) {
                case "OFFLINE":
                  updatedPeople[index].presence = "OFFLINE";
                  break;
                case "HIDDEN":
                  updatedPeople[index].presence =
                    currentUser.type === "STUDENT" ? "DISABLED" : "OFFLINE";
                  break;
                case "PERMANENT":
                  updatedPeople[index].presence = "DISABLED";
                  updatedPeople[index].nick = null;
                  break;
              }

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
          setBookmarkedUsers((users) => {
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

    /**
     * Handles updating active discussions list when new message is sent
     * @param data data
     */
    const onNewMgsSentUpdateActiveDiscussions = (data: unknown) => {
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
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocket.addEventCallback("chat:user-joined", onChatUserJoinedMsg);
    websocket.addEventCallback("chat:user-left", onChatUserLeftMsg);
    websocket.addEventCallback("chat:nick-change", ChatUsersNickChange);
    websocket.addEventCallback(
      "chat:message-sent",
      onNewMgsSentUpdateActiveDiscussions
    );

    return () => {
      // Remove callback when unmounting
      websocket.removeEventCallback("chat:user-joined", onChatUserJoinedMsg);
      websocket.removeEventCallback("chat:user-left", onChatUserLeftMsg);
      websocket.removeEventCallback("chat:nick-change", ChatUsersNickChange);
      websocket.removeEventCallback(
        "chat:message-sent",
        onNewMgsSentUpdateActiveDiscussions
      );
    };
  }, [currentUser.type, websocket]);

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

    setBookmarkedUsers(chatUsers);
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
  const blockUser = React.useCallback(async (user: ChatUser) => {
    await chatApi.blockUser({
      identifier: user.identifier,
    });

    unstable_batchedUpdates(() => {
      setBlockedUsers((prev) => [...prev, user]);
      setBookmarkedUsers((prev) => {
        const index = prev.findIndex((u) => u.id === user.id);

        if (index !== -1) {
          const updatedUsers = [...prev];
          updatedUsers.splice(index, 1);
          return updatedUsers;
        }

        return prev;
      });
    });
  }, []);

  /**
   * Unblock user
   * @param user user
   */
  const unblockUser = React.useCallback(async (user: ChatUser) => {
    await chatApi.unblockUser({
      identifier: user.identifier,
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
  }, []);

  /**
   * Close private discussion
   * @param user user
   */
  const closePrivateDiscussion = React.useCallback(async (user: ChatUser) => {
    await chatApi.closeConversation({
      identifier: user.identifier,
    });

    setBookmarkedUsers((prev) => {
      const index = prev.findIndex((u) => u.id === user.id);

      if (index !== -1) {
        const updatedUsers = [...prev];
        updatedUsers.splice(index, 1);
        return updatedUsers;
      }

      return prev;
    });
  }, []);

  /**
   * Adds user to active discussions list
   * @param user user
   */
  const addUserToActiveDiscussionsList = (user: ChatUser) => {
    setBookmarkedUsers((prev) => {
      const index = prev.findIndex((u) => u.id === user.id);

      if (index === -1) {
        return [user, ...prev];
      }

      return prev;
    });
  };

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

  // List of users with active chat
  const usersWithChatActiveIds = React.useMemo(
    () => users.map((user) => user.id),
    [users]
  );

  // List of users ids with active discussions
  const usersWithDiscussionIds = React.useMemo(
    () => bookmarkedUsers.map((user) => user.id),
    [bookmarkedUsers]
  );

  // List of counselor ids
  const counselorIds = React.useMemo(
    () =>
      myCounselors && myCounselors.length
        ? myCounselors.map((c) => c.userEntityId)
        : [],
    [myCounselors]
  );

  // List of blocked users ids
  const blockedUsersIds = React.useMemo(() => {
    if (!blockedUsers) {
      return [];
    }

    return blockedUsers.map((user) => user.id);
  }, [blockedUsers]);

  // Users object for easier access by id
  const usersObject: {
    [key: number]: ChatUser;
  } = React.useMemo(() => {
    /**
     * Maps user by adding hash to nick if user has no nick
     * @param user user
     */
    const mapUser = (user: ChatUser) => {
      if (user.nick === null) {
        user.nick = `Poistunut#${generateHash(user.identifier)}`;
      }
      return user;
    };

    // Lets combine users and bookmarked users
    const allUsers = [...users];

    // Add bookmarked users to all users if they are not already there
    // and set their presence to disabled
    bookmarkedUsers.forEach((user) => {
      if (!allUsers.find((u) => u.id === user.id)) {
        allUsers.push({
          ...user,
          presence: "DISABLED",
        });
      }
    });

    // Map users to object
    return allUsers
      .map(mapUser)
      .reduce((acc, user) => ({ ...acc, [user.id]: user }), {});
  }, [users, bookmarkedUsers]);

  return {
    blockedUsersIds,
    blockUser,
    closePrivateDiscussion,
    counselorIds,
    unblockUser,
    updateUserFilters,
    userFilters,
    usersObject,
    usersWithChatActiveIds,
    usersWithDiscussionIds,
  };
}

export default useUsers;
