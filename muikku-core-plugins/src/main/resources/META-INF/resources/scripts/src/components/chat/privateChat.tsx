import * as React from "react";
import mApi from "~/lib/mApi";
import "~/sass/elements/chat.scss";
import "~/sass/elements/wcag.scss";
import { IBareMessageType } from "./chat";
import { ChatMessage } from "./chatMessage";
import promisify from "~/util/promisify";
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "~/components/general/dropdown";
import {
  requestPrescense,
  handleRosterDelete,
  handlePresenceSubscribe,
  handlePresenceSubscribed,
} from "~/helper-functions/chat";
import { IChatContact } from "./chat";

/**
 * IPrivateChatProps
 */
interface IPrivateChatProps {
  initializingStanza: Element;
  roster: IChatContact[];
  leaveChat: () => void;
  onAddFriend: (person: IChatContact) => void;
  connection: Strophe.Connection;
  jid: string;
  userRosterGroup?: string;
  subscribeOnMessage?: boolean;
  i18n: i18nType;
}

/**
 * IPrivateChatState
 */
interface IPrivateChatState {
  nick: string;
  messages: IBareMessageType[];
  minimized: boolean;
  messageNotification: boolean;
  targetPrescense: "away" | "chat" | "dnd" | "xa";
  isStudent: boolean;
  currentMessageToBeSent: string;
  loadingMessages: boolean;
  canLoadMoreMessages: boolean;
  lastMessageStamp: string;
}

const roleNode = document.querySelector('meta[name="muikku:role"]');

/**
 * PrivateChat
 */
export class PrivateChat extends React.Component<
  IPrivateChatProps,
  IPrivateChatState
> {
  private messagesListenerHandler: any = null;
  private presenceListenerHandler: any = null;
  private isFocused = false;
  private messagesEnd: React.RefObject<HTMLDivElement>;
  private isScrollDetached = false;
  private chatRef: React.RefObject<HTMLDivElement>;

  /**
   * constructor
   * @param props props
   */
  constructor(props: IPrivateChatProps) {
    super(props);

    this.state = {
      nick: null,
      messages: [],
      minimized: JSON.parse(
        window.sessionStorage.getItem("minimizedChats") || "[]"
      ).includes(props.jid),
      messageNotification: !!this.props.initializingStanza,
      currentMessageToBeSent: "",
      targetPrescense: "xa",
      isStudent: roleNode.getAttribute("value") === "STUDENT",
      loadingMessages: false,
      canLoadMoreMessages: true,
      lastMessageStamp: null,
    };

    this.messagesEnd = React.createRef();
    this.chatRef = React.createRef<HTMLDivElement>();

    this.sendMessage = this.sendMessage.bind(this);
    this.onPrivateChatMessage = this.onPrivateChatMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.onPresence = this.onPresence.bind(this);
    this.toggleMinimizeChats = this.toggleMinimizeChats.bind(this);
    this.onEnterPress = this.onEnterPress.bind(this);
    this.setCurrentMessageToBeSent = this.setCurrentMessageToBeSent.bind(this);
    this.onTextFieldFocus = this.onTextFieldFocus.bind(this);
    this.onTextFieldBlur = this.onTextFieldBlur.bind(this);
    this.checkScrollDetachment = this.checkScrollDetachment.bind(this);
    this.isScrolledToTop = this.isScrolledToTop.bind(this);
    this.loadMessages = this.loadMessages.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.messagesListenerHandler = this.props.connection.addHandler(
      this.onPrivateChatMessage,
      null,
      "message",
      "chat",
      null,
      this.props.jid,
      { matchBare: true }
    );
    this.presenceListenerHandler = this.props.connection.addHandler(
      this.onPresence,
      null,
      "presence",
      null,
      null,
      this.props.jid,
      { matchBare: true }
    );

    if (this.props.initializingStanza) {
      // this.onPrivateChatMessage(this.props.initializingStanza);
    }

    this.obtainNick();
    this.loadMessages();
    requestPrescense(this.props.jid, this.props.connection);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this.props.connection.deleteHandler(this.messagesListenerHandler);
    this.props.connection.deleteHandler(this.presenceListenerHandler);
  }

  /**
   * obtainNick
   */
  async obtainNick() {
    const user: any = (await promisify(
      mApi().chat.userInfo.read(this.props.jid.split("@")[0], {}),
      "callback"
    )()) as any;
    this.setState({
      nick: user.name,
    });
  }

  // /**
  //  * requestPrescense
  //  */
  // async requestPrescense() {
  //   await new Promise((resolve) => {
  //     resolve(
  //       this.props.connection.send(
  //         $pres({
  //           from: this.props.connection.jid,
  //           to: this.props.jid,
  //           type: "probe",
  //         })
  //       )
  //     );
  //   });
  // }

  // /**
  //  * Subscribe to another user's presence
  //  * @param type should you subscribe or unsubscribe from the presence
  //  */
  // handlePresenceSubscribe = async (
  //   type: "subscribe" | "unsubscribe"
  // ): Promise<void> => {
  //   await new Promise((resolve) =>
  //     resolve(
  //       this.props.connection.send(
  //         $pres({
  //           from: this.props.connection.jid,
  //           to: this.props.jid,
  //           type: type,
  //         })
  //       )
  //     )
  //   );
  // };

  // /**
  //  * Allow another user's presence
  //  * @param type should allow or unallow other person's subscription
  //  */
  // handlePresenceSubscribed = async (
  //   type: "subscribed" | "unsubscribed"
  // ): Promise<void> => {
  //   await new Promise((resolve) =>
  //     resolve(
  //       this.props.connection.send(
  //         $pres({
  //           from: this.props.connection.jid,
  //           to: this.props.jid,
  //           type: "type",
  //         })
  //       )
  //     )
  //   );
  // };

  // handleSubscriptions = async (): Promise<void> => {
  //   const subscribe = new Promise((resolve) =>
  //     resolve(
  //       this.props.connection.send(
  //         $pres({
  //           from: this.props.connection.jid,
  //           to: this.props.jid,
  //           type: "subscribe",
  //         })
  //       )
  //     )
  //   );

  //   const subscribed = new Promise((resolve) =>
  //     resolve(
  //       this.props.connection.send(
  //         $pres({
  //           from: this.props.connection.jid,
  //           to: this.props.jid,
  //           type: "subscribed",
  //         })
  //       )
  //     )
  //   );

  //   await Promise.all([subscribe, subscribed]);
  // };

  /**
   * setUserToRosterGroup sets user to a group in a roster
   * @param groupName given group name
   * @return Element stanza
   */
  setUserToRosterGroup = async (groupName: string): Promise<Element> => {
    const stanza = $iq({
      from: this.props.connection.jid,
      type: "set",
    })
      .c("query", { xmlns: Strophe.NS.ROSTER })
      .c("item", { jid: this.props.jid })
      .c("group", groupName);

    const answer: Element = await new Promise((resolve) =>
      this.props.connection.sendIQ(stanza, (answerStanza: Element) =>
        resolve(answerStanza)
      )
    );

    return answer;
  };

  handleMessageSend = async (text: string): Promise<void> => {
    await new Promise((resolve) => {
      resolve(
        this.props.connection.send(
          $msg({
            from: this.props.connection.jid,
            to: this.props.jid,
            type: "chat",
          })
            .c("body", text)
            .up()
            .c("active", { xmlns: "http://jabber.org/protocol/chatstates" })
        )
      );
    });
  };

  addToRoster = () => {
    handlePresenceSubscribe(this.props.jid, this.props.connection, "subscribe");
    handlePresenceSubscribed(
      this.props.jid,
      this.props.connection,
      "subscribed"
    );

    this.props.onAddFriend({ jid: this.props.jid, nick: this.state.nick });
  };

  // getRoster = () => {
  //   const stanza = $iq({
  //     from: this.props.connection.jid,
  //     type: "get",
  //   }).c("query", { xmlns: Strophe.NS.ROSTER });
  //   const friendList: string[] = [];
  //   this.props.connection.sendIQ(stanza, (answerStanza: Element) => {
  //     const roster = answerStanza.querySelectorAll("query item");

  //     roster.forEach((r) => {
  //       friendList.push(r.getAttribute("jid"));
  //     });
  //   });

  //   this.setState({ friends: friendList });
  // };

  /**
   * onTextFieldFocus
   */
  onTextFieldFocus() {
    this.isFocused = true;
    if (this.state.messageNotification) {
      this.setState({
        messageNotification: false,
      });
    }
  }

  /**
   * onTextFieldBlur
   */
  onTextFieldBlur() {
    this.isFocused = false;
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
   * sendMessage
   * @param event event
   */
  sendMessage(event: React.FormEvent) {
    event && event.preventDefault();

    const text = this.state.currentMessageToBeSent.trim();

    if (text) {
      this.handleMessageSend(text);

      this.props.userRosterGroup &&
        this.setUserToRosterGroup(this.props.userRosterGroup);

      const newMessage: IBareMessageType = {
        nick: null,
        message: text,
        stanzaId: null,
        timestamp: new Date(),
        userId: this.props.connection.jid.split("@")[0],
        isSelf: true,
        action: null,
        deleted: false,
        edited: null,
      };

      // this.setUserToRosterGroup("test");

      this.setState(
        {
          currentMessageToBeSent: "",
          messages: [...this.state.messages, newMessage],
        },
        this.scrollToBottom.bind(this, "smooth")
      );
    }
  }

  /**
   * scrollToBottom
   * @param method method
   */
  scrollToBottom(method: ScrollBehavior = "smooth") {
    if (this.messagesEnd.current && !this.isScrollDetached) {
      this.messagesEnd.current.scrollIntoView({ behavior: method });
    }
  }

  /**
   * onPrivateChatMessage
   * @param stanza stanza
   */
  onPrivateChatMessage(stanza: Element) {
    const from = stanza.getAttribute("from");
    const fromNick: string = null;

    const body = stanza.querySelector("body");
    if (body) {
      const content = body.textContent;
      const date = new Date();
      const userId = from.split("@")[0];
      const stanzaId: string = null;

      const messageReceived: IBareMessageType = {
        nick: fromNick,
        message: content,
        stanzaId,
        timestamp: date,
        userId,
        isSelf: userId === this.props.connection.jid.split("@")[0],
        action: null,
        deleted: false,
        edited: null,
      };

      const newMessagesList = [...this.state.messages, messageReceived];
      this.setState(
        {
          messages: newMessagesList,
          messageNotification:
            this.state.messageNotification || !this.isFocused,
        },
        this.scrollToBottom.bind(this, "smooth")
      );
    }

    return true;
  }

  /**
   * onEnterPress
   * @param e e
   */
  onEnterPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      this.sendMessage(null);

      return false;
    }
  }

  /**
   * toggleMinimizeChats
   */
  toggleMinimizeChats() {
    let minimizedChatList: string[] = JSON.parse(
      window.sessionStorage.getItem("minimizedChats") || "[]"
    );
    const newMinimized = !this.state.minimized;

    this.isScrollDetached = false;
    this.setState(
      {
        minimized: newMinimized,
        messageNotification: false,
      },
      this.scrollToBottom.bind(this, "auto")
    );

    if (newMinimized) {
      minimizedChatList.push(this.props.jid);
    } else {
      minimizedChatList = minimizedChatList.filter((r) => r !== this.props.jid);
    }

    window.sessionStorage.setItem(
      "minimizedChats",
      JSON.stringify(minimizedChatList)
    );
  }

  /**
   * onPresence
   * @param stanza stanza
   */
  onPresence(stanza: Element) {
    const show = stanza.querySelector("show");
    const precense: any = show ? show.textContent : "chat";

    this.setState({
      targetPrescense: precense,
    });

    return true;
  }

  /**
   * checkScrollDetachment
   * @param e e
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
   */
  isScrolledToTop() {
    if (this.chatRef.current) {
      return this.chatRef.current.scrollTop === 0;
    }

    return false;
  }

  existsInFriends = (roster: IChatContact[], person: string) =>
    roster.some((contact) => contact.jid === person);

  /**
   * loadMessages
   */
  loadMessages() {
    if (this.state.loadingMessages || !this.state.canLoadMoreMessages) {
      return;
    }

    this.setState({
      loadingMessages: true,
    });

    const stanza = $iq({
      type: "set",
    })
      .c("query", {
        xmlns: "otavanopisto:chat:history",
      })
      .c("type", {}, "chat")
      .c("with", {}, this.props.jid)
      .c("max", {}, "25");

    if (this.state.lastMessageStamp) {
      stanza.c("before", {}, this.state.lastMessageStamp);
    }

    this.props.connection.sendIQ(stanza, (answerStanza: Element) => {
      let lastMessageStamp: string = null;
      const allMessagesLoaded: boolean =
        answerStanza.querySelector("query").getAttribute("complete") === "true";
      const newMessages = Array.from(
        answerStanza.querySelectorAll("historyMessage")
      ).map((historyMessage: Element, index: number) => {
        const stanzaId: string = null;
        const stamp = historyMessage.querySelector("timestamp").textContent;

        if (index === 0) {
          lastMessageStamp = stamp;
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
          action: null,
          deleted: false,
          edited: null,
        };

        return messageReceived;
      });

      if (lastMessageStamp) {
        this.setState({
          lastMessageStamp,
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
            messages: [...newMessages, ...this.state.messages],
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
              canLoadMoreMessages: !allMessagesLoaded,
            });
          }
        );
      } else {
        this.setState({
          loadingMessages: false,
          canLoadMoreMessages: false,
        });
      }
    });
  }

  /**
   * render
   */
  render() {
    return (
      <div
        className={`chat__panel-wrapper ${
          this.state.minimized ? "chat__panel-wrapper--reorder" : ""
        }`}
      >
        {this.state.minimized === true ? (
          <div
            onClick={this.toggleMinimizeChats}
            className={
              this.state.messageNotification
                ? "chat__minimized chat__minimized--private chat__nofication--private"
                : "chat__minimized chat__minimized--private"
            }
          >
            <div className="chat__minimized-title">
              {/* ToDo: Add this back when we can show users presence to each other
              <span className={"chat__online-indicator chat__online-indicator--" + this.state.targetPrescense}></span>
              */}
              <span className="chat__target-nickname">{this.state.nick}</span>
            </div>
            <div
              onClick={this.props.leaveChat}
              className="chat__button chat__button--close icon-cross"
            ></div>
          </div>
        ) : (
          <div className="chat__panel chat__panel--private">
            <div className="chat__panel-header chat__panel-header--private">
              <div className="chat__panel-header-title">
                <span
                  className={
                    "chat__online-indicator chat__online-indicator--" +
                    this.state.targetPrescense
                  }
                ></span>
                <span className="chat__target-nickname">{this.state.nick}</span>
              </div>
              {this.existsInFriends(this.props.roster, this.props.jid) &&
              this.props.jid.includes("student") ? (
                <div className="chat__button chat__button--add-friend icon-plus disabled"></div>
              ) : (
                <Dropdown
                  openByHover
                  modifier="private-chat"
                  content={this.props.i18n.text.get("plugin.chat.addContact")}
                >
                  <div
                    onClick={this.addToRoster}
                    className="chat__button chat__button--add-friend icon-plus"
                  ></div>
                </Dropdown>
              )}
              <div
                onClick={this.toggleMinimizeChats}
                className="chat__button chat__button--minimize icon-minus"
              ></div>
              <div
                onClick={this.props.leaveChat}
                className="chat__button chat__button--close icon-cross"
              ></div>
            </div>

            <div className="chat__panel-body chat__panel-body--chatroom">
              <div
                className="chat__messages-container chat__messages-container--private"
                onScroll={this.checkScrollDetachment}
                ref={this.chatRef}
              >
                {this.state.messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    chatType="private"
                    canToggleInfo={!this.state.isStudent}
                    message={message}
                    i18n={this.props.i18n}
                  />
                ))}
                <div
                  className="chat__messages-last-message"
                  ref={this.messagesEnd}
                ></div>
              </div>
            </div>
            <form
              className="chat__panel-footer chat__panel-footer--chatroom"
              onSubmit={this.sendMessage}
            >
              {/* Need wcag.scss from another WIP branch
               <label htmlFor={`sendPrivateChatMessage-${this.props.jid.split("@")[0]}`} className="visually-hidden">{this.props.i18n.text.get("plugin.wcag.sendMessage.label")}</label> */}
              <textarea
                id={`sendPrivateChatMessage-${this.props.jid.split("@")[0]}`}
                className="chat__memofield chat__memofield--muc-message"
                onKeyDown={this.onEnterPress}
                placeholder={this.props.i18n.text.get("plugin.chat.writemsg")}
                value={this.state.currentMessageToBeSent}
                onChange={this.setCurrentMessageToBeSent}
                onFocus={this.onTextFieldFocus}
                onBlur={this.onTextFieldBlur}
                ref={(ref) => ref && ref.focus()}
              />
              <button
                className="chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-private"
                type="submit"
                value=""
              >
                <span className="icon-arrow-right"></span>
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }
}
