import * as React from "react";
import mApi from "~/lib/mApi";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/chat.scss";
import "~/sass/elements/wcag.scss";
import promisify from "~/util/promisify";
import {
  IAvailableChatRoomType,
  IBareMessageActionType,
  IBareMessageType,
  IChatOccupant,
  IChatRoomType,
} from "./chat";
import { ChatMessage } from "./chatMessage";
import DeleteRoomDialog from "./deleteMUCDialog";

/**
 * IGroupChatProps
 */
interface IGroupChatProps {
  chat: IAvailableChatRoomType;
  nick: string;
  leaveChatRoom: () => void;
  joinPrivateChat: (jid: string) => void;
  onUpdateChatRoomConfig: (chat: IAvailableChatRoomType) => void;
  requestExtraInfoAboutRoom: () => void;
  removeChatRoom: () => void;
  connection: Strophe.Connection;
  i18n: i18nType;
  presence: "away" | "chat" | "dnd" | "xa"; // these are defined by the XMPP protocol https://xmpp.org/rfcs/rfc3921.html 2.2.2
  active?: boolean;
}

/**
 * IGroupChatOccupant
 */
interface IGroupChatOccupant {
  occupant: IChatOccupant;
  affilation: "none" | "owner";
  role: "moderator" | "participant";
}

/**
 * IGroupChatState
 */
interface IGroupChatState {
  messages: IBareMessageType[];
  processedMessages: IBareMessageType[];
  openChatSettings: boolean;
  isStudent: boolean;
  isOwner: boolean;
  isModerator: boolean;
  showRoomInfo: boolean;
  minimized: boolean;
  occupants: IGroupChatOccupant[];
  showOccupantsList: boolean;

  roomNameField: string;
  roomDescField: string;

  lastMessageStamp: string;
  loadingMessages: boolean;
  canLoadMoreMessages: boolean;
  // roomPersistent: boolean,

  updateFailed: boolean;

  deleteMUCDialogOpen: boolean;
  currentMessageToBeSent: string;
  currentEditedMessageToBeSent: string;
  active: boolean;
}

const roleNode = document.querySelector('meta[name="muikku:role"]');

/**
 * Groupchat
 */
export class Groupchat extends React.Component<
  IGroupChatProps,
  IGroupChatState
> {
  private messagesListenerHandler: any = null;
  private presenceListenerHandler: any = null;
  private messagesEnd: React.RefObject<HTMLDivElement>;
  private isScrollDetached = false;
  private chatRef: React.RefObject<HTMLDivElement>;
  private chatWrapperRef: React.RefObject<HTMLDivElement>;
  private unmounted = false;

  /**
   * constructor
   * @param props props
   */
  constructor(props: IGroupChatProps) {
    super(props);

    this.state = {
      messages: [],
      processedMessages: [],
      openChatSettings: false,
      isStudent: roleNode.getAttribute("value") === "STUDENT",
      isOwner: false,
      isModerator: false,
      showRoomInfo: false,
      minimized: JSON.parse(
        window.sessionStorage.getItem("minimizedChats") || "[]"
      ).includes(props.chat.roomJID),
      occupants: [],
      showOccupantsList: false,
      lastMessageStamp: null,
      loadingMessages: false,
      canLoadMoreMessages: true,

      roomNameField: this.props.chat.roomName,
      roomDescField: this.props.chat.roomDesc,
      // roomPersistent: this.props.chat.roomPersistent,

      updateFailed: false,
      currentMessageToBeSent: "",
      currentEditedMessageToBeSent: "",

      deleteMUCDialogOpen: false,

      active: false,
    };

    this.messagesEnd = React.createRef();
    this.chatRef = React.createRef();

    this.sendMessageToChatRoom = this.sendMessageToChatRoom.bind(this);
    this.setChatroomConfiguration = this.setChatroomConfiguration.bind(this);
    this.toggleMinimizeChats = this.toggleMinimizeChats.bind(this);
    this.toggleOccupantsList = this.toggleOccupantsList.bind(this);
    this.onGroupChatMessage = this.onGroupChatMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.toggleChatRoomSettings = this.toggleChatRoomSettings.bind(this);
    this.setCurrentMessageToBeSent = this.setCurrentMessageToBeSent.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.onPresence = this.onPresence.bind(this);
    this.sendRoomPrescense = this.sendRoomPrescense.bind(this);
    this.onEnterPress = this.onEnterPress.bind(this);
    this.updateRoomNameField = this.updateRoomNameField.bind(this);
    this.updateRoomDescField = this.updateRoomDescField.bind(this);
    this.checkScrollDetachment = this.checkScrollDetachment.bind(this);
    this.toggleDeleteMUCDialog = this.toggleDeleteMUCDialog.bind(this);
    this.onMUCDeleted = this.onMUCDeleted.bind(this);
    this.loadMessages = this.loadMessages.bind(this);
    this.isScrolledToTop = this.isScrolledToTop.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.editMessage = this.editMessage.bind(this);
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: IGroupChatProps) {
    if (prevProps.chat && this.props.chat) {
      if (prevProps.chat.roomName !== this.props.chat.roomName) {
        this.setState({
          roomNameField: this.props.chat.roomName || "",
        });
      }
      if (prevProps.chat.roomDesc !== this.props.chat.roomDesc) {
        this.setState({
          roomDescField: this.props.chat.roomDesc || "",
        });
      }
      // if (prevProps.chat.roomPersistent !== this.props.chat.roomPersistent) {
      //   this.setState({
      //     roomPersistent: this.props.chat.roomPersistent,
      //   });
      // }
    }

    if (
      this.props.chat.roomJID !== prevProps.chat.roomJID ||
      this.props.nick !== prevProps.nick ||
      this.props.connection !== prevProps.connection
    ) {
      this.leaveRoom(prevProps);
      this.joinRoom();
    } else if (this.props.presence !== prevProps.presence) {
      // we don't do this on the rejoining because it's automatically done
      // if rejoining
      this.sendRoomPrescense();
    }
  }

  /**
   * toggleDeleteMUCDialog
   * @param e e
   */
  toggleDeleteMUCDialog(e?: React.MouseEvent) {
    e && e.stopPropagation();
    e && e.preventDefault();

    if (!this.unmounted) {
      this.setState({
        deleteMUCDialogOpen: !this.state.deleteMUCDialogOpen,
      });
    }
  }

  /**
   * onMUCDeleted
   */
  onMUCDeleted() {
    this.props.removeChatRoom();
  }

  /**
   * updateRoomNameField
   * @param e e
   */
  updateRoomNameField(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      roomNameField: e.target.value,
    });
  }

  /**
   * updateRoomDescField
   * @param e e
   */
  updateRoomDescField(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      roomDescField: e.target.value,
    });
  }

  /**
   * setCurrentMessageToBeSent
   * @param e e
   */
  setCurrentMessageToBeSent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      currentMessageToBeSent: e.target.value,
    });
  }

  /**
   * sendMessageToChatRoom
   * @param event event
   */
  sendMessageToChatRoom(event: React.FormEvent) {
    event && event.preventDefault();

    const text = this.state.currentMessageToBeSent.trim();

    if (text) {
      this.props.connection.send(
        $msg({
          from: this.props.connection.jid,
          to: this.props.chat.roomJID,
          type: "groupchat",
        }).c("body", text)
      );

      this.setState(
        {
          currentMessageToBeSent: "",
        },
        this.scrollToBottom.bind(this, "auto")
      );
    }
  }

  /**
   * Custom Message DELETE, we send empty stanza with custom attribute
   * Attribute contains stanzaId that is from original 'to be deleted' mmessage
   * @param stanzaId stanzaId
   */
  deleteMessage(stanzaId: string) {
    this.props.connection.send(
      $msg({
        from: this.props.connection.jid,
        to: this.props.chat.roomJID,
        type: "groupchat",
      }).c("body", { "otavanopisto-delete": stanzaId })
    );
  }

  /**
   * Custom Message EDIT, we send new stanza with new content and with custom attribute
   * Attribute contains stanzaId that is from original 'to be edited' mmessage
   * @param stanzaId stanzaId
   * @param textContent textContent
   */
  editMessage(stanzaId: string, textContent: string) {
    const text = textContent.trim();

    if (text) {
      this.props.connection.send(
        $msg({
          from: this.props.connection.jid,
          to: this.props.chat.roomJID,
          type: "groupchat",
        }).c("body", { "otavanopisto-edit": stanzaId }, text)
      );
    }
  }

  /**
   * setChatroomConfiguration
   * Set chat room configurations
   * @param event event
   */
  async setChatroomConfiguration(event: React.FormEvent) {
    event.preventDefault();

    const chat: IAvailableChatRoomType = {
      ...this.props.chat,
      roomName: this.state.roomNameField,
      roomDesc: this.state.roomDescField,
    };

    try {
      const chatRoom: IChatRoomType = (await promisify(
        mApi().chat.publicRoom.update({
          title: chat.roomName,
          description: chat.roomDesc,
          name: Strophe.getNodeFromJid(chat.roomJID),
        }),
        "callback"
      )()) as IChatRoomType;

      chat.roomName = chatRoom.title;
      chat.roomDesc = chatRoom.description;

      this.setState({
        updateFailed: false,
        openChatSettings: false,
      });

      this.props.onUpdateChatRoomConfig(chat);
    } catch {
      this.setState({
        updateFailed: true,
      });
    }
  }

  /**
   * toggleChatRoomSettings
   */
  public toggleChatRoomSettings() {
    this.setState({
      openChatSettings: !this.state.openChatSettings,
      updateFailed: false,
    });
    this.props.requestExtraInfoAboutRoom();
  }

  /**
   * toggleMinimizeChats
   */
  toggleMinimizeChats() {
    const roomJID = this.props.chat.roomJID;
    let minimizedRoomList: string[] = JSON.parse(
      window.sessionStorage.getItem("minimizedChats") || "[]"
    );
    const newMinimized = !this.state.minimized;

    this.isScrollDetached = false;
    this.setState(
      {
        minimized: newMinimized,
      },
      this.scrollToBottom.bind(this, "auto")
    );

    if (newMinimized) {
      minimizedRoomList.push(roomJID);
    } else {
      minimizedRoomList = minimizedRoomList.filter((r) => r !== roomJID);
    }

    window.sessionStorage.setItem(
      "minimizedChats",
      JSON.stringify(minimizedRoomList)
    );
  }

  /**
   * toggleOccupantsList
   */
  async toggleOccupantsList() {
    this.setState({
      showOccupantsList: !this.state.showOccupantsList,
    });
  }

  /**
   * scrollToBottom
   * Scroll selected view to the bottom
   * @param method method
   */
  scrollToBottom(method: ScrollBehavior = "smooth") {
    if (this.messagesEnd.current && !this.isScrollDetached) {
      this.messagesEnd.current.scrollIntoView({ behavior: method });
    }
  }

  /**
   * onEnterPress
   * @param e e
   */
  onEnterPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      this.sendMessageToChatRoom(null);

      return false;
    }
  }

  /**
   * onGroupChatMessage
   * @param stanza
   * @returns
   */
  onGroupChatMessage(stanza: Element) {
    const from = stanza.getAttribute("from");
    const fromNick = from.split("/")[1];
    const body = stanza.querySelector("body");

    if (body) {
      const editForId = body.getAttribute("otavanopisto-edit");
      const deleteForId = body.getAttribute("otavanopisto-delete");
      let action: IBareMessageActionType = null;
      if (editForId || deleteForId) {
        action = {
          editForId,
          deleteForId,
        };
      }

      const content = body.textContent;
      let date: Date = null;

      const delay = stanza.querySelector("delay");
      let userId: string = null;
      if (delay) {
        date = new Date(delay.getAttribute("stamp"));
        userId = delay.getAttribute("from").split("@")[0];
      } else {
        date = new Date();
      }

      const stanzaId = stanza.querySelector("stanza-id").getAttribute("id");

      // message is already loaded, this can happen when the server
      // broadcasts messages twice, as when you change your presense
      if (this.state.messages.find((m) => m.stanzaId === stanzaId)) {
        return true;
      }

      if (!userId) {
        // we might not find it, if occupants is not ready
        const groupChatOccupant = this.state.occupants.find(
          (o) => o.occupant.nick === fromNick
        );
        // whenever occupants get added this should be fixed
        if (groupChatOccupant) {
          userId = groupChatOccupant.occupant.userId;
        }
      }

      const messageReceived: IBareMessageType = {
        nick: fromNick,
        message: content,
        stanzaId,
        timestamp: date,
        userId,
        isSelf: userId === this.props.connection.jid.split("@")[0],
        action,
        deleted: false,
        edited: null,
      };

      const newMessagesList = [...this.state.messages, messageReceived];
      this.setState(
        {
          messages: newMessagesList,
          processedMessages: this.processMessages(newMessagesList),
        },
        this.scrollToBottom.bind(this, "auto")
      );
    }

    return true;
  }

  /**
   * onPresence
   * @param stanza
   * @returns
   */
  onPresence(stanza: Element) {
    const from = stanza.getAttribute("from");
    const fromNick = from.split("/")[1];

    const show = stanza.querySelector("show");
    const precense: any = show ? show.textContent : "chat";

    const item = stanza.querySelector("item");
    const jid = item.getAttribute("jid");

    // strange unavailable detected, kicking user out of the room
    if (jid === null) {
      this.props.leaveChatRoom();
      return;
    }

    const userJIDBare = jid.split("/")[0];
    const userId = userJIDBare.split("@")[0];
    const affilation: any = item.getAttribute("affiliation");
    const role: any = item.getAttribute("role");

    if (stanza.getAttribute("type") === "unavailable") {
      const newOccupants = this.state.occupants.filter(
        (o) => o.occupant.userId !== userId
      );

      this.setState({
        occupants: newOccupants,
      });

      if (userId === this.props.connection.jid.split("@")[0]) {
        this.props.leaveChatRoom();
        return;
      }
    } else {
      const groupOccupant: IGroupChatOccupant = {
        occupant: {
          additional: null,
          nick: fromNick,
          isSelf: userId === this.props.connection.jid.split("@")[0],
          precense,
          userId,
          isStaff: userJIDBare.startsWith("muikku-staff"),
          jid: userJIDBare,
        },
        affilation,
        role,
      };

      if (groupOccupant.occupant.isSelf) {
        this.setState({
          isOwner: groupOccupant.affilation === "owner",
          isModerator:
            groupOccupant.role === "moderator" ||
            groupOccupant.affilation === "owner",
        });
      }

      const newChatMessages = this.state.messages.map((m) => {
        if (m.nick === groupOccupant.occupant.nick && !m.userId) {
          return {
            ...m,
            userId: groupOccupant.occupant.userId,
            isSelf:
              groupOccupant.occupant.userId ===
              this.props.connection.jid.split("@")[0],
          } as IBareMessageType;
        }

        return m;
      });

      let found = false;
      const newOccupants = this.state.occupants.map((o) => {
        if (o.occupant.userId === groupOccupant.occupant.userId) {
          groupOccupant.occupant.additional = o.occupant.additional;
          found = true;
          return groupOccupant;
        }

        return o;
      });
      if (!found) {
        newOccupants.push(groupOccupant);
      }

      this.setState({
        occupants: newOccupants,
        messages: newChatMessages,
        processedMessages: this.processMessages(newChatMessages),
      });
    }

    return true;
  }

  /**
   * joinRoom
   * @param props
   */
  joinRoom(props: IGroupChatProps = this.props) {
    const roomJID = props.chat.roomJID;

    this.messagesListenerHandler = props.connection.addHandler(
      this.onGroupChatMessage,
      null,
      "message",
      "groupchat",
      null,
      roomJID,
      { matchBare: true }
    );
    this.presenceListenerHandler = props.connection.addHandler(
      this.onPresence,
      null,
      "presence",
      null,
      null,
      roomJID,
      { matchBare: true }
    );

    if (!props.nick) {
      return;
    }

    this.sendRoomPrescense(props);
  }

  /**
   * sendRoomPrescense
   * @param props
   */
  sendRoomPrescense(props: IGroupChatProps = this.props) {
    const roomJID = props.chat.roomJID;

    // XEP-0045: 7.2 Entering a Room
    const presStanza = $pres({
      from: props.connection.jid,
      to: roomJID + "/" + props.nick,
    })
      .c("x", { xmlns: Strophe.NS.MUC })
      .up()
      .c("show", {}, this.props.presence);

    props.connection.send(presStanza);
  }

  /**
   * leaveRoom
   * @param props
   */
  leaveRoom(props: IGroupChatProps = this.props) {
    props.connection.deleteHandler(this.messagesListenerHandler);
    props.connection.deleteHandler(this.presenceListenerHandler);

    const roomJID = props.chat.roomJID;

    // XEP-0045: 7.14 Exiting a Room
    const presStanza = $pres({
      from: props.connection.jid,
      to: roomJID + "/" + props.nick,
      type: "unavailable",
    });

    this.setState({
      messages: [],
      processedMessages: [],
    });

    props.connection.send(presStanza);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    if (this.props.active) {
      this.setState({
        active: true,
      });
    }

    document.addEventListener("mousedown", this.handleClickOutside);

    this.joinRoom();
    this.loadMessages();
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);

    this.leaveRoom();

    this.unmounted = true;
  }

  /**
   * @param event
   */
  handleClickOutside = (event: any) => {
    this.setState({ active: false });
  };

  /**
   * checkScrollDetachment
   * @param e
   */
  checkScrollDetachment(e: React.UIEvent<HTMLDivElement>) {
    if (this.chatRef.current) {
      this.isScrollDetached =
        Math.abs(
          this.chatRef.current.scrollHeight -
            this.chatRef.current.offsetHeight -
            this.chatRef.current.scrollTop
        ) > 64;
    }

    if (this.isScrolledToTop()) {
      this.loadMessages();
    }
  }

  /**
   * isScrolledToTop
   * @returns
   */
  isScrolledToTop() {
    if (this.chatRef.current) {
      return this.chatRef.current.scrollTop === 0;
    }

    return false;
  }

  /**
   * processMessages
   * @param messages
   * @returns
   */
  processMessages(messages: IBareMessageType[]): IBareMessageType[] {
    const actionMessages = messages.filter((m) => m.action);
    const standardMessages = messages.filter((m) => !m.action);
    const result: IBareMessageType[] = standardMessages.map((m) => {
      const shouldDelete = actionMessages.some(
        (a) => a.action.deleteForId === m.stanzaId
      );
      if (shouldDelete) {
        const newMessage: IBareMessageType = {
          ...m,
          deleted: true,
        };
        return newMessage;
      }
      const foundActions = actionMessages.filter(
        (a) => a.action.editForId === m.stanzaId
      );
      if (!foundActions.length) {
        return m;
      }

      const lastAction = foundActions[foundActions.length - 1];
      const newMessage: IBareMessageType = {
        ...m,
        edited: lastAction,
      };
      newMessage.message = lastAction.message;

      return newMessage;
    });
    return result;
  }

  /**
   * loadMessages
   * @returns
   */
  async loadMessages() {
    if (this.state.loadingMessages || !this.state.canLoadMoreMessages) {
      return;
    }

    this.setState({
      loadingMessages: true,
    });

    const newMessages: IBareMessageType[] = [];
    let processedNewMessages: IBareMessageType[] = [];
    let thereIsNoMore = false;
    let beforeLastMessageStamp: string = null;

    while (processedNewMessages.length < 25 && !thereIsNoMore) {
      const stanza = $iq({
        type: "set",
      })
        .c("query", {
          xmlns: "otavanopisto:chat:history",
        })
        .c("type", {}, "groupchat")
        .c("with", {}, this.props.chat.roomJID)
        .c("includeStanzaIds")
        .c("max", {}, (25 - processedNewMessages.length).toString());

      if (this.state.lastMessageStamp) {
        stanza.c(
          "before",
          {},
          beforeLastMessageStamp || this.state.lastMessageStamp
        );
      }

      const answerStanza: Element = await new Promise((resolve, reject) => {
        this.props.connection.sendIQ(stanza, (answerStanza: Element) => {
          resolve(answerStanza);
        });
      });

      const allMessagesLoaded: boolean =
        answerStanza.querySelector("query").getAttribute("complete") === "true";
      if (allMessagesLoaded) {
        thereIsNoMore = true;
      }

      Array.from(answerStanza.querySelectorAll("historyMessage")).map(
        (historyMessage: Element, index: number) => {
          const messageElement = historyMessage.querySelector("message");

          const editForId = messageElement.getAttribute("otavanopisto-edit");
          const deleteForId = messageElement.getAttribute(
            "otavanopisto-delete"
          );
          let action: IBareMessageActionType = null;
          if (editForId || deleteForId) {
            action = {
              editForId,
              deleteForId,
            };
          }

          const stanzaId = historyMessage.querySelector("stanzaId").textContent;

          const stamp = historyMessage.querySelector("timestamp").textContent;
          if (index === 0) {
            beforeLastMessageStamp = stamp;
          }

          const nick = historyMessage
            .querySelector("toJID")
            .textContent.split("/")[1];
          const message = historyMessage.querySelector("message").textContent;
          const date = new Date(stamp);
          const userId = historyMessage
            .querySelector("fromJID")
            .textContent.split("@")[0];

          const messageReceived: IBareMessageType = {
            nick,
            message,
            stanzaId,
            timestamp: date,
            userId,
            isSelf: userId === this.props.connection.jid.split("@")[0],
            action,
            deleted: false,
            edited: null,
          };

          newMessages.push(messageReceived);
        }
      );

      processedNewMessages = this.processMessages(newMessages);
    }

    if (beforeLastMessageStamp) {
      this.setState({
        lastMessageStamp: beforeLastMessageStamp,
      });
    }

    if (newMessages.length) {
      const oldScrollHeight =
        this.chatRef.current && this.chatRef.current.scrollHeight;
      // most likely 0, but who knows, fast fingers
      const oldScrollTop =
        this.chatRef.current && this.chatRef.current.scrollTop;

      this.setState(
        {
          messages: newMessages,
          processedMessages: processedNewMessages,
        },
        () => {
          if (!this.isScrollDetached) {
            this.scrollToBottom("auto");
          } else if (this.chatRef.current) {
            const currentScrollHeight = this.chatRef.current.scrollHeight;
            const diff = currentScrollHeight - oldScrollHeight;
            this.chatRef.current.scrollTop = diff + oldScrollTop;
          }
          this.setState({
            loadingMessages: false,
            canLoadMoreMessages: !thereIsNoMore,
          });
        }
      );
    } else {
      this.setState({
        loadingMessages: false,
        canLoadMoreMessages: false,
      });
    }
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const chatRoomTypeClassName = this.props.chat.roomJID.startsWith(
      "workspace-"
    )
      ? "workspace"
      : "other";

    const staffOccupants = this.state.occupants.filter(
      (o) => o.occupant.isStaff
    );
    const studentOccupants = this.state.occupants.filter(
      (o) => !o.occupant.isStaff
    );

    return (
      <div
        onClick={(e) => this.setState({ active: true })}
        className={`chat__panel-wrapper ${
          this.state.minimized ? "chat__panel-wrapper--reorder" : ""
        }`}
        ref={this.chatWrapperRef}
      >
        {this.state.minimized === true ? (
          <div
            className={`chat__minimized chat__minimized--${chatRoomTypeClassName}`}
          >
            <div
              onClick={this.toggleMinimizeChats}
              className="chat__minimized-title"
            >
              {this.props.chat.roomName}
            </div>
            <div
              onClick={this.props.leaveChatRoom}
              className="chat__button chat__button--close icon-cross"
            ></div>
          </div>
        ) : (
          <div
            className={`chat__panel chat__panel--${chatRoomTypeClassName} ${
              this.state.active ? "chat__panel--active" : ""
            }`}
          >
            <div
              className={`chat__panel-header chat__panel-header--${chatRoomTypeClassName}`}
            >
              <div className="chat__panel-header-title">
                {this.props.chat.roomName}
              </div>
              <div
                onClick={this.toggleOccupantsList}
                className="chat__button chat__button--occupants icon-users"
              ></div>
              <div
                onClick={this.toggleMinimizeChats}
                className="chat__button chat__button--minimize icon-minus"
              ></div>
              {this.state.isOwner ? (
                <div
                  onClick={this.toggleChatRoomSettings}
                  className="chat__button chat__button--room-settings icon-cogs"
                ></div>
              ) : null}
              <div
                onClick={this.props.leaveChatRoom}
                className="chat__button chat__button--close icon-cross"
              ></div>
            </div>

            {this.state.openChatSettings && (
              <div className="chat__subpanel">
                <div
                  className={`chat__subpanel-header chat__subpanel-header--room-settings-${chatRoomTypeClassName}`}
                >
                  <div className="chat__subpanel-title">
                    {this.props.i18n.text.get("plugin.chat.room.settingsTitle")}
                  </div>
                  <div
                    onClick={this.toggleChatRoomSettings}
                    className="chat__button chat__button--close icon-cross"
                  ></div>
                </div>
                <div className="chat__subpanel-body">
                  <form onSubmit={this.setChatroomConfiguration}>
                    <div className="chat__subpanel-row">
                      <label
                        htmlFor={`chatRoomName-${
                          this.props.chat.roomJID.split("@")[0]
                        }`}
                        className="chat__label"
                      >
                        {this.props.i18n.text.get("plugin.chat.room.name")}
                      </label>
                      <input
                        id={`chatRoomName-${
                          this.props.chat.roomJID.split("@")[0]
                        }`}
                        className={`chat__textfield chat__textfield--${chatRoomTypeClassName}`}
                        name="newroomName"
                        disabled={
                          this.props.chat.roomJID.startsWith("workspace-")
                            ? true
                            : null
                        }
                        value={this.state.roomNameField}
                        onChange={this.updateRoomNameField}
                        type="text"
                      ></input>
                    </div>
                    <div className="chat__subpanel-row">
                      <label
                        htmlFor={`chatRoomDesc-${
                          this.props.chat.roomJID.split("@")[0]
                        }`}
                        className="chat__label"
                      >
                        {this.props.i18n.text.get("plugin.chat.room.desc")}
                      </label>
                      <textarea
                        id={`chatRoomDesc-${
                          this.props.chat.roomJID.split("@")[0]
                        }`}
                        className={`chat__memofield chat__memofield--${chatRoomTypeClassName}`}
                        name="newroomDescription"
                        value={this.state.roomDescField || ""}
                        onChange={this.updateRoomDescField}
                      ></textarea>
                    </div>
                    {/* {(!this.state.isStudent) && <div className="chat__subpanel-row">
                    <label className="chat__label">Pysyvä huone: </label>
                    <input className={`chat__checkbox chat__checkbox--room-settings-${chatRoomTypeClassName}`} type="checkbox" name="persistent"></input>
                  </div>} */}
                    <div className="chat__subpanel-row chat__subpanel-row--buttonset">
                      <input
                        className={`chat__submit chat__submit--room-settings-${chatRoomTypeClassName}`}
                        type="submit"
                        value={this.props.i18n.text.get(
                          "plugin.chat.button.save"
                        )}
                      ></input>
                      {!this.props.chat.roomJID.startsWith("workspace-") && (
                        <button
                          className="chat__submit chat__submit--room-settings-delete"
                          onClick={this.toggleDeleteMUCDialog}
                        >
                          {this.props.i18n.text.get(
                            "plugin.chat.button.deleteRoom"
                          )}
                        </button>
                      )}
                    </div>
                  </form>

                  <div>{this.state.updateFailed ? "failed" : null}</div>
                </div>
              </div>
            )}

            <div className="chat__panel-body chat__panel-body--chatroom">
              <div
                className={`chat__messages-container chat__messages-container--${chatRoomTypeClassName}`}
                onScroll={this.checkScrollDetachment}
                ref={this.chatRef}
              >
                {this.state.processedMessages.map((message) => (
                  <ChatMessage
                    chatType="group"
                    canModerate={!this.state.isStudent}
                    key={message.stanzaId}
                    canToggleInfo={!this.state.isStudent}
                    message={message}
                    i18n={this.props.i18n}
                    editMessage={this.editMessage}
                    deleteMessage={this.deleteMessage}
                  />
                ))}
                <div
                  className="chat__messages-last-message"
                  ref={this.messagesEnd}
                ></div>
              </div>
              {this.state.showOccupantsList && (
                <div className="chat__occupants-container">
                  <div className="chat__occupants-staff">
                    {staffOccupants.length > 0 ? (
                      <div className="chat__occupants-title">
                        {this.props.i18n.text.get(
                          "plugin.chat.occupants.staff"
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    {staffOccupants.map((staffOccupant) => (
                      <div
                        title={this.props.i18n.text.get(
                          "plugin.chat.state." + staffOccupant.occupant.precense
                        )}
                        className="chat__occupants-item chat__occupants-item--has-access-to-pm"
                        onClick={this.props.joinPrivateChat.bind(
                          null,
                          staffOccupant.occupant.jid,
                          null
                        )}
                        key={staffOccupant.occupant.userId}
                      >
                        <span
                          className={
                            "chat__online-indicator chat__online-indicator--" +
                            staffOccupant.occupant.precense
                          }
                        ></span>
                        {staffOccupant.occupant.nick}
                      </div>
                    ))}
                  </div>
                  <div className="chat__occupants-student">
                    {studentOccupants.length > 0 ? (
                      <div className="chat__occupants-title">
                        {this.props.i18n.text.get(
                          "plugin.chat.occupants.students"
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    {studentOccupants.map((studentOccupant) => (
                      <div
                        title={this.props.i18n.text.get(
                          "plugin.chat.state." +
                            studentOccupant.occupant.precense
                        )}
                        className={`chat__occupants-item ${
                          !this.state.isStudent &&
                          "chat__occupants-item--has-access-to-pm"
                        } `}
                        onClick={
                          this.state.isStudent
                            ? null
                            : this.props.joinPrivateChat.bind(
                                this,
                                studentOccupant.occupant.jid,
                                null
                              )
                        }
                        key={studentOccupant.occupant.userId}
                      >
                        <span
                          className={
                            "chat__online-indicator chat__online-indicator--" +
                            studentOccupant.occupant.precense
                          }
                        ></span>
                        {studentOccupant.occupant.nick}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <form
              className="chat__panel-footer chat__panel-footer--chatroom"
              onSubmit={this.sendMessageToChatRoom}
            >
              <input
                name="chatRecipient"
                className="chat__muc-recipient"
                value={this.props.chat.roomJID}
                readOnly
              />
              <label
                htmlFor={`sendGroupChatMessage-${
                  this.props.chat.roomJID.split("@")[0]
                }`}
                className="visually-hidden"
              >
                {this.props.i18n.text.get("plugin.wcag.sendMessage.label")}
              </label>
              <textarea
                id={`sendGroupChatMessage-${
                  this.props.chat.roomJID.split("@")[0]
                }`}
                className="chat__memofield chat__memofield--muc-message"
                onKeyDown={this.onEnterPress}
                placeholder={this.props.i18n.text.get("plugin.chat.writemsg")}
                onChange={this.setCurrentMessageToBeSent}
                value={this.state.currentMessageToBeSent}
                ref={(ref) =>
                  ref &&
                  this.state.active &&
                  !this.state.openChatSettings &&
                  ref.focus()
                }
              />
              <button
                className={`chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-${chatRoomTypeClassName}`}
                type="submit"
                value=""
              >
                <span className="icon-arrow-right"></span>
              </button>
            </form>
          </div>
        )}

        <DeleteRoomDialog
          isOpen={this.state.deleteMUCDialogOpen}
          onClose={this.toggleDeleteMUCDialog}
          chat={this.props.chat}
          onDelete={this.onMUCDeleted}
        />
      </div>
    );
  }
}
