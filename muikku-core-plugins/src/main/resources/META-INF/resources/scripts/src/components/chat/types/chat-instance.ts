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
export interface ChatInstanceInfo {
  targetIdentifier: string;
  targetIdentifiersToListen: string[];
  messages: ChatMessage[];
  newMessage: string;
  canLoadMore: boolean;
  loadingMoreChatMsgs: boolean;
  postMessage: () => Promise<void>;
  loadMoreMessages: () => Promise<void>;
}

/**
 * Utility class to hold one chat messages instance between two users or room
 */
export class ChatMessages {
  /**
   * targetIdentifier
   */
  private _targetIdentifier: string;
  /**
   * targetIdentifiersToListen
   */
  private _targetIdentifiersToListen: string[] = [];
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
   * listeners
   */
  private listeners: Listener = {
    instanceHasUpdated: [],
  };
  /**
   * messages
   */
  messages: ChatMessage[] = [];

  /**
   * canLoadMore
   */
  canLoadMore = true;
  /**
   * loadingMoreChatMsgs
   */
  loadingMoreChatMsgs = false;

  /**
   * Constructor for ChatInstance
   * @param targetIdentifier targetIdentifier
   * @param targetIdentifiersToListen targetIdentifiersToListen
   * @param websocket websocket
   */
  constructor(
    targetIdentifier: string,
    targetIdentifiersToListen: string[],
    websocket: Websocket
  ) {
    this._targetIdentifier = targetIdentifier;
    this._targetIdentifiersToListen = targetIdentifiersToListen;
    this.websocket = websocket;

    this.getInitialMessages = this.getInitialMessages.bind(this);
    this.loadMoreMessages = this.loadMoreMessages.bind(this);
    this.onChatMsgSentMsg = this.onChatMsgSentMsg.bind(this);
    this.onChatMsgEditedMsg = this.onChatMsgEditedMsg.bind(this);
    this.onChatMsgDeletedMsg = this.onChatMsgDeletedMsg.bind(this);
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
   * @returns targetIdentifiersToListen
   */
  get targetIdentifiersToListen(): string[] {
    return this._targetIdentifiersToListen;
  }

  /**
   * setTargetIdentifiersToListen
   * @param targetIdentifiersToListen targetIdentifiersToListen
   */
  set targetIdentifiersToListen(targetIdentifiersToListen: string[]) {
    this._targetIdentifiersToListen = targetIdentifiersToListen;
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
    this.triggerChangeListeners();
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

      if (this.targetIdentifiersToListen.includes(dataTyped.targetIdentifier)) {
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

      if (this.targetIdentifiersToListen.includes(dataTyped.targetIdentifier)) {
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

      if (this.targetIdentifiersToListen.includes(dataTyped.targetIdentifier)) {
        const index = this.messages.findIndex((msg) => msg.id === dataTyped.id);

        if (index !== -1) {
          this.messages[index] = dataTyped;

          this.triggerChangeListeners();
        }
      }
    }
  };

  /**
   * Method to call to notify listeners that the instance has updated
   */
  private triggerChangeListeners() {
    if (this.listeners["instanceHasUpdated"]) {
      this.listeners["instanceHasUpdated"].forEach((callback) => callback());
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
    const callbacks = this.listeners["instanceHasUpdated"];
    const index = callbacks.findIndex(callback);
    index === -1 && callbacks.push(callback);
    this.listeners["instanceHasUpdated"] = callbacks;
  }

  /**
   * Remove a change listener
   * @param callback callback
   */
  removeChangeListener(callback: (...args: any[]) => any) {
    const index = this.listeners["instanceHasUpdated"].findIndex(callback);

    if (index !== -1) {
      this.listeners["instanceHasUpdated"].splice(index, 1);
    }
  }

  /**
   * Gets the current state of the instance
   * @returns current state
   */
  getCurrentState(): ChatInstanceInfo {
    return {
      targetIdentifier: this.targetIdentifier,
      targetIdentifiersToListen: this.targetIdentifiersToListen,
      messages: this.messages,
      newMessage: this.newMessage,
      canLoadMore: this.canLoadMore,
      loadingMoreChatMsgs: this.loadingMoreChatMsgs,
      postMessage: this.postMessage,
      loadMoreMessages: this.loadMoreMessages,
    };
  }

  /**
   * Method to call to remove all event listeners
   */
  destroy() {
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
