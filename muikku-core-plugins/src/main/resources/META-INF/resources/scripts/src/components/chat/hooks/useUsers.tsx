import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import {
  ChatMessage,
  ChatUser,
  GuidanceCounselorContact,
} from "~/generated/client";
import i18n from "~/locales/i18n";
import { ChatUserFilters, generateHash } from "../chat-helpers";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

/**
 * useChatSettings
 */
interface UseUsersProps {
  /**
   * current chat user
   */
  currentUser: ChatUser;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Custom hook to handle loading and updating users from rest api.
 * @param props props
 */
function useUsers(props: UseUsersProps) {
  const { currentUser, displayNotification } = props;

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
    React.useState<GuidanceCounselorContact[]>(null);
  const [blockedUsers, setBlockedUsers] = React.useState<ChatUser[]>([]);

  const usersRef = React.useRef<ChatUser[]>([]);

  const { t } = useTranslation("chat");

  const componentMounted = React.useRef(true);

  usersRef.current = users;

  // When current user visibility changes we need to fetch all users again
  React.useEffect(() => {
    /**
     * Fetch users
     */
    const fetchAllUsers = async () => {
      try {
        const users = await chatApi.getChatUsers({
          onlyOnline: false,
        });

        setUsers(users);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        displayNotification(
          i18n.t("notifications.loadError", {
            context: "users",
          }),
          "error"
        );
      }
    };

    if (currentUser.visibility !== "NONE") {
      fetchAllUsers();
    }
  }, [currentUser.visibility, displayNotification]);

  React.useEffect(() => {
    /**
     * Fetch users that have active discussions with current user
     */
    const fetchUsersWithDiscussions = async () => {
      try {
        const chatUsers = await chatApi.getPrivateDiscussions();

        chatUsers.reverse();

        setBookmarkedUsers(chatUsers);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        displayNotification(
          i18n.t("notifications.loadError", {
            context: "discussions",
          }),
          "error"
        );
      }
    };

    /**
     * Fetch blocked users
     */
    const fetchBlockedUsers = async () => {
      try {
        const blockedUsers = await chatApi.getBlocklist();

        setBlockedUsers(blockedUsers);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        displayNotification(
          i18n.t("notifications.loadError", {
            context: "blockedUsers",
          }),
          "error"
        );
      }
    };

    /**
     * Fetch my counselors
     */
    const fetchMyCounselors = async () => {
      try {
        const counselors = await chatApi.getChatGuidanceCounselors();

        setMyCounselors(counselors);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        displayNotification(
          i18n.t("notifications.loadError", {
            context: "counselors",
          }),
          "error"
        );
      }
    };

    fetchUsersWithDiscussions();
    fetchBlockedUsers();

    if (currentUser.type === "STUDENT") {
      fetchMyCounselors();
    }
  }, [currentUser.type, displayNotification]);

  React.useEffect(() => {
    /**
     * Handles updating user presence when user joins chat
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
     * Handles updating user presence when user leaves chat
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
     * Handles updating user nick when user changes it
     * @param data data from server.
     */
    const onChatUsersNickChange = (data: unknown) => {
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

          // If message is from room, skip
          if (dataTyped.targetIdentifier.startsWith("room-")) {
            return;
          }

          const sender = usersRef.current.find((u) =>
            [
              `user-${dataTyped.sourceUserEntityId}`,
              dataTyped.targetIdentifier,
            ].includes(u.identifier)
          );

          if (sender) {
            setBookmarkedUsers((prev) => {
              const index = prev.findIndex((u) => u.id === sender.id);

              if (index === -1) {
                return [sender, ...prev];
              }

              return prev;
            });
          }
        }
      }
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocket.addEventCallback("chat:user-joined", onChatUserJoinedMsg);
    websocket.addEventCallback("chat:user-left", onChatUserLeftMsg);
    websocket.addEventCallback("chat:nick-change", onChatUsersNickChange);
    websocket.addEventCallback(
      "chat:message-sent",
      onNewMgsSentUpdateActiveDiscussions
    );

    return () => {
      // Remove callback when unmounting
      websocket.removeEventCallback("chat:user-joined", onChatUserJoinedMsg);
      websocket.removeEventCallback("chat:user-left", onChatUserLeftMsg);
      websocket.removeEventCallback("chat:nick-change", onChatUsersNickChange);
      websocket.removeEventCallback(
        "chat:message-sent",
        onNewMgsSentUpdateActiveDiscussions
      );
    };
  }, [currentUser.type, websocket]);

  /**
   * Blocks user and removes it from bookmarked users
   * @param user target chat user
   * @param type type of block. SOFT only hides and HARD also prevents user from sending messages.
   */
  const blockUser = React.useCallback(
    async (user: ChatUser) => {
      try {
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
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        displayNotification(
          i18n.t("notifications.blockUserError", {
            ns: "chat",
          }),
          "error"
        );
      }
    },
    [displayNotification]
  );

  /**
   * Unblocks user
   * @param user user
   */
  const unblockUser = React.useCallback(
    async (user: ChatUser) => {
      try {
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
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        displayNotification(
          i18n.t("notifications.unblockUserError", {
            ns: "chat",
          }),
          "error"
        );
      }
    },
    [displayNotification]
  );

  /**
   * Close private discussion and remove it from bookmarked users
   * @param user user
   */
  const closePrivateDiscussion = React.useCallback(
    async (user: ChatUser) => {
      try {
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
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        displayNotification(
          i18n.t("notifications.closeDiscussionError", {
            ns: "chat",
          }),
          "error"
        );
      }
    },
    [displayNotification]
  );

  /**
   * Update user filters
   * @param key key of filter
   * @param value value of filter
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
        user.nick = `${t("labels.gone", {
          ns: "chat",
        })}#${generateHash(user.identifier)}`;
      }
      return user;
    };

    // Lets combine users and bookmarked users
    const allUsers = [...users];

    // Add bookmarked users to all users if they are not already there
    // and set their presence to disabled because main user list is source of truth
    // and if not included already in that list we can assume that user is offline
    // or users presence cannot be shown
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
  }, [users, bookmarkedUsers, t]);

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
