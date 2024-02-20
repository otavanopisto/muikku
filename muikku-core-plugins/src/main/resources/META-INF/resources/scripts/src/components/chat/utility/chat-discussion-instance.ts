/* eslint-disable @typescript-eslint/no-explicit-any */
import MApi from "~/api/api";
import { ChatMessage } from "~/generated/client";
import Websocket from "~/util/websocket";

const chatApi = MApi.getChatApi();

/**
 * Listener interface
 */
interface Listener {
  [name: string]: ((...args: any[]) => any)[];
}

/**
 * ChatInstanceInfo
 */
export interface ChatDiscussionInstanceState {
  targetIdentifier: string;
  currentUserIdentifier: string;
  messages: ChatMessage[];
  newMessage: string;
  canLoadMore: boolean;
  loadingMoreChatMsgs: boolean;
  postMessage: () => Promise<void>;
  loadMoreMessages: () => Promise<void>;
}

/**
 * Utility class to hold one chat discussion instance between two users or room
 * Includes messages and methods to post messages and receive messages and some other utility values
 * like scroll position
 */
export class ChatDiscussionInstance {
  /**
   * targetIdentifier
   */
  private _targetIdentifier: string;
  /**
   * currentUserIdentifier
   */
  private _currentUserIdentifier: string;
  /**
   * Websocket instance
   */
  private websocket: Websocket;
  /**
   * Initializing
   */
  private initializing = true;
  /**
   * new message
   */
  private _newMessage = "";
  /**
   * scrollTop
   */
  private _scrollHeight: number = null;
  /**
   * listener
   */
  private listener: Listener = {
    instanceHasUpdated: [],
  };
  /**
   * messages
   */
  private messages: ChatMessage[] = [];

  /**
   * canLoadMore
   */
  private canLoadMore = true;
  /**
   * loadingMoreChatMsgs
   */
  private loadingMoreChatMsgs = false;

  /**
   * Constructor for ChatInstance
   * @param targetIdentifier targetIdentifier
   * @param currentUserIdentifier currentUserIdentifier
   * @param websocket websocket
   */
  constructor(
    targetIdentifier: string,
    currentUserIdentifier: string,
    websocket: Websocket
  ) {
    this._targetIdentifier = targetIdentifier;
    this._currentUserIdentifier = currentUserIdentifier;
    this.websocket = websocket;

    this.getInitialMessages = this.getInitialMessages.bind(this);
    this.loadMoreMessages = this.loadMoreMessages.bind(this);
    this.postMessage = this.postMessage.bind(this);

    this.getInitialMessages();

    websocket.addEventCallback("chat:message-sent", this.onChatMsgSentMsg);
    websocket.addEventCallback("chat:message-edited", this.onChatMsgEditedMsg);
    websocket.addEventCallback(
      "chat:message-deleted",
      this.onChatMsgDeletedMsg
    );
  }

  /**
   * getTargetIdentifier
   * @returns targetIdentifier
   */
  get targetIdentifier(): string {
    return this._targetIdentifier;
  }

  /**
   * setTargetIdentifier
   * @param targetIdentifier targetIdentifier
   */
  set targetIdentifier(targetIdentifier: string) {
    this._targetIdentifier = targetIdentifier;
    this.triggerChangeListeners();
  }

  /**
   * getTargetIdentifiersToListen
   * @returns currentUserIdentifier
   */
  get currentUserIdentifier(): string {
    return this._currentUserIdentifier;
  }

  /**
   * setTargetIdentifiersToListen
   * @param currentUserIdentifier currentUserIdentifier
   */
  set currentUserIdentifier(currentUserIdentifier: string) {
    this._currentUserIdentifier = currentUserIdentifier;
    this.triggerChangeListeners();
  }

  /**
   * getScrollHeight
   * @returns scrollTop
   */
  get scrollTop(): number {
    return this._scrollHeight;
  }

  /**
   * setScrollHeight
   * @param scrollTop scrollTop
   */
  set scrollTop(scrollTop: number) {
    this._scrollHeight = scrollTop;
  }

  /**
   * getNewMessage
   * @returns newMessage
   */
  get newMessage(): string {
    return this._newMessage;
  }

  /**
   * setNewMessage
   * @param newMessage newMessage
   */
  set newMessage(newMessage: string) {
    this._newMessage = newMessage;
    this.triggerChangeListeners();
  }

  /**
   * getInitialMessages
   * @returns messages
   */
  private async getInitialMessages() {
    this.messages = await chatApi.getChatMessagesByTarget({
      targetIdentifier: this._targetIdentifier,
      count: 35,
    });

    this.initializing = false;

    this.triggerChangeListeners();
  }

  /**
   * onChatMsgSentMsg
   * @param data created ChatMessage.
   */
  private onChatMsgSentMsg = (data: unknown) => {
    if (typeof data === "string") {
      const dataTyped: ChatMessage = JSON.parse(data);

      const [senderIsCurrentUser, senderIsTarget, messageToRoom] =
        this.whoIsSender(dataTyped);

      if (senderIsCurrentUser || senderIsTarget || messageToRoom) {
        this.messages.push(dataTyped);

        this.triggerChangeListeners();
      }
    }
  };

  /**
   * onChatMsgEditedMsg
   * @param data edited ChatMessage.
   */
  private onChatMsgEditedMsg = (data: unknown) => {
    if (typeof data === "string") {
      const dataTyped: ChatMessage = JSON.parse(data);

      const [senderIsCurrentUser, senderIsTarget, messageToRoom] =
        this.whoIsSender(dataTyped);

      if (senderIsCurrentUser || senderIsTarget || messageToRoom) {
        const index = this.messages.findIndex((msg) => msg.id === dataTyped.id);

        if (index !== -1) {
          this.messages[index] = dataTyped;

          this.triggerChangeListeners();
        }
      }
    }
  };

  /**
   * onChatMsgDeletedMsg
   * @param data data from server.
   */
  private onChatMsgDeletedMsg = (data: unknown) => {
    if (typeof data === "string") {
      const dataTyped: ChatMessage = JSON.parse(data);

      const [senderIsCurrentUser, senderIsTarget, messageToRoom] =
        this.whoIsSender(dataTyped);

      if (senderIsCurrentUser || senderIsTarget || messageToRoom) {
        const index = this.messages.findIndex((msg) => msg.id === dataTyped.id);

        if (index !== -1) {
          this.messages[index] = dataTyped;

          this.triggerChangeListeners();
        }
      }
    }
  };

  /**
   * Checks if the sender is the current user or the target
   * @param msg msg
   */
  private whoIsSender = (msg: ChatMessage) => {
    const sourceIdentifier = `user-${msg.sourceUserEntityId}`;

    const senderIsCurrentUser =
      this._currentUserIdentifier === sourceIdentifier &&
      msg.targetIdentifier === this.targetIdentifier;

    const senderIsTarget =
      this.targetIdentifier === sourceIdentifier &&
      this.currentUserIdentifier === msg.targetIdentifier;

    let messageToRoom = false;

    if (this.targetIdentifier.startsWith("room-")) {
      messageToRoom = this.targetIdentifier === msg.targetIdentifier;
    }

    return [senderIsCurrentUser, senderIsTarget, messageToRoom];
  };

  /**
   * Method to call to notify listener that the instance has updated
   */
  private triggerChangeListeners() {
    if (this.listener["instanceHasUpdated"]) {
      this.listener["instanceHasUpdated"].forEach((callback) => callback());
    }
  }

  /**
   * loadMoreMessages
   * @returns messages
   */
  async loadMoreMessages() {
    if (this.initializing || !this.canLoadMore || this.loadingMoreChatMsgs) {
      return;
    }

    this.loadingMoreChatMsgs = true;

    const olderMsgs = await chatApi.getChatMessagesByTarget({
      targetIdentifier: this.targetIdentifier,
      count: 10,
      earlierThan: this.messages[0].sentDateTime,
    });

    if (olderMsgs.length === 0) {
      this.canLoadMore = false;
      this.loadingMoreChatMsgs = false;
    } else {
      this.messages = [...olderMsgs, ...this.messages];
      this.loadingMoreChatMsgs = false;
    }

    this.triggerChangeListeners();
  }

  /**
   * Posts a message to the selected chat
   */
  async postMessage() {
    await chatApi.createChatMessage({
      targetIdentifier: this.targetIdentifier,
      createChatMessageRequest: {
        message: this.newMessage,
      },
    });

    this.newMessage = "";

    this.triggerChangeListeners();
  }

  /**
   * Add a change listener, which will be called when the instance has updated
   * @param callback callback
   */
  addChangeListener(callback: (...args: any[]) => any) {
    const callbacks = this.listener["instanceHasUpdated"];
    const index = callbacks.findIndex(callback);
    index === -1 && callbacks.push(callback);
    this.listener["instanceHasUpdated"] = callbacks;
  }

  /**
   * Remove a change listener
   */
  removeChangeListener() {
    this.listener["instanceHasUpdated"] = [];
  }

  /**
   * Gets the current state of the instance
   * @returns current state
   */
  getCurrentState(): ChatDiscussionInstanceState {
    return {
      targetIdentifier: this.targetIdentifier,
      currentUserIdentifier: this.currentUserIdentifier,
      messages: this.messages,
      newMessage: this.newMessage,
      canLoadMore: this.canLoadMore,
      loadingMoreChatMsgs: this.loadingMoreChatMsgs,
      postMessage: this.postMessage,
      loadMoreMessages: this.loadMoreMessages,
    };
  }

  /**
   * Method to call to remove all event listener
   */
  destroy() {
    this.removeChangeListener();
    this.websocket.removeEventCallback(
      "chat:message-sent",
      this.onChatMsgSentMsg
    );
    this.websocket.removeEventCallback(
      "chat:message-edited",
      this.onChatMsgEditedMsg
    );
    this.websocket.removeEventCallback(
      "chat:message-deleted",
      this.onChatMsgDeletedMsg
    );
  }
}
