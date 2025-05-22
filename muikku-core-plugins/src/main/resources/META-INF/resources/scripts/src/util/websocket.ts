/* eslint-disable @typescript-eslint/ban-types */

/**
 *Function type should be change to more specific type
 */

import actions from "../actions/base/notifications";
import $ from "~/lib/jquery";
import { Action } from "redux";
import { WebsocketStateType } from "~/reducers/util/websocket";
import i18n from "~/locales/i18n";
import { AppStore } from "~/reducers/configureStore";

type ListenerType = {
  [name: string]: {
    actions?: Array<Function>;
    callbacks?: Array<Function>;
  };
};

/**
 * MuikkuWebsocket
 */
export default class MuikkuWebsocket {
  private options: any;
  private ticket: any;
  private webSocket: WebSocket;
  private socketOpen: boolean;
  private reconnecting: boolean;
  private reconnectRetries: number;
  private messagesPending: {
    eventType: string;
    data: any;
    onSent?: () => any;
    stackId?: string;
  }[];
  private pingHandler: any;
  private waitingPong: boolean;
  private gotPong: boolean;
  private discarded: boolean;
  private listeners: ListenerType;
  private baseListeners: ListenerType;
  private store: AppStore;
  private reconnectHandler: NodeJS.Timer;

  /**
   * constructor
   * @param store store
   * @param listeners listeners
   * @param options options
   */
  constructor(
    store: AppStore,
    listeners: ListenerType,
    options = {
      reconnectInterval: 10000,
      pingInterval: 10000,
    }
  ) {
    this.options = options;

    this.ticket = null;
    this.webSocket = null;
    this.socketOpen = false;
    this.discarded = false;
    this.reconnecting = false;
    this.reconnectRetries = 0;
    this.messagesPending = [];
    this.pingHandler = null;
    this.waitingPong = false;
    this.gotPong = false;
    this.listeners = listeners;
    this.baseListeners = listeners;
    this.store = store;

    this.getTicket(() => {
      if (this.ticket) {
        this.openWebSocket();
      }
    });

    this.store.dispatch({
      type: "INITIALIZE_WEBSOCKET",
      payload: this,
    });

    $(window).on("beforeunload", this.onBeforeWindowUnload.bind(this));
  }

  /**
   * sendMessage
   * @param eventType eventType
   * @param data data
   * @param onSent onSent
   * @param stackId stackId
   */
  sendMessage(
    eventType: string,
    data: any,
    onSent?: () => any,
    stackId?: string
  ) {
    if (this.socketOpen && !this.reconnecting) {
      // Check if message queue already has this message. This can happen if it was previously
      // sent to the server but the server failed to respond within two seconds, causing that
      // message to be added to queue. Since the message we are sending now is the latest,
      // clear the previous one from the queue so that it doesn't accidentally overwrite this
      // message later (if we lose connection and restore it)

      const index =
        stackId && this.messagesPending.findIndex((m) => m.stackId === stackId);
      if (typeof index === "number" && index !== -1) {
        this.messagesPending.splice(index, 1);
      }

      // Send message

      try {
        this.webSocket.send(
          JSON.stringify({
            eventType: eventType,
            data: data,
          })
        );
        const websocketState: WebsocketStateType =
          this.store.getState().websocket;
        this.messagesPending.length === 0 &&
          !websocketState.synchronized &&
          this.trigger("webSocketSync");
        onSent && onSent();
      } catch (e) {
        if (eventType != "ping:ping") {
          this.queueMessage(eventType, data, onSent, stackId);
        }
        this.trigger("webSocketDesync");
      }
    } else {
      if (eventType != "ping:ping") {
        this.queueMessage(eventType, data, onSent, stackId);
      }
      this.trigger("webSocketDesync");
    }
  }

  /**
   * queueMessage
   * @param eventType eventType
   * @param data data
   * @param onSent onSent
   * @param stackId stackId
   */
  queueMessage(
    eventType: string,
    data: any,
    onSent?: () => any,
    stackId?: string
  ) {
    const index =
      stackId && this.messagesPending.findIndex((m) => m.stackId === stackId);
    const message = {
      eventType,
      data,
      onSent,
      stackId,
    };
    if (typeof index === "number" && index !== -1) {
      this.messagesPending[index] = message;
    } else {
      this.messagesPending.push(message);
    }
  }

  /**
   * addEventListener
   * @param event event
   * @param actionCreator actionCreator
   */
  addEventListener(event: string, actionCreator: Function) {
    const evtListeners = this.listeners[event] || {
      actions: [],
      callbacks: [],
    };
    evtListeners.actions.push(actionCreator);
    this.listeners[event] = evtListeners;
    return this;
  }

  /**
   * removeEventCallback
   * @param event event
   * @param actionCreator actionCreator
   */
  removeEventCallback(event: string, actionCreator: Function) {
    const index = this.listeners[event].callbacks.indexOf(actionCreator);
    if (index !== -1) {
      this.listeners[event].callbacks.splice(index, 1);
    }
  }

  /**
   * addEventCallback
   * @param event event
   * @param action action
   */
  addEventCallback(event: string, action: Function) {
    const evtListeners = this.listeners[event] || {
      actions: [],
      callbacks: [],
    };
    evtListeners.callbacks.push(action);
    this.listeners[event] = evtListeners;
    return this;
  }

  /**
   * restoreEventListeners
   */
  restoreEventListeners() {
    this.listeners = this.baseListeners;
    return this;
  }

  /**
   * trigger
   * @param event event
   * @param data data
   */
  trigger(event: any, data: any = null) {
    this.store.dispatch({
      type: "WEBSOCKET_EVENT",
      payload: {
        event,
        data,
      },
    });

    if (this.listeners[event]) {
      const listeners = this.listeners[event].actions;
      if (listeners) {
        for (const action of listeners) {
          if (typeof action === "function") {
            this.store.dispatch(action());
          } else {
            this.store.dispatch(action);
          }
        }
      }

      const otherListeners = this.listeners[event].callbacks;
      if (otherListeners) {
        for (const callback of otherListeners) {
          callback(data);
        }
      }
    }
  }

  /**
   * getTicket
   * @param callback callback
   */
  getTicket(callback: Function) {
    // Check if we have given up for good
    if (this.discarded) {
      this.ticket = null;
      callback();
    } else if (this.ticket) {
      // We have a ticket, so we need to validate it before using it
      $.ajax({
        url: "/rest/websocket/ticket/" + this.ticket + "/check",
        type: "GET",
        cache: false,
        /**
         * success
         */
        success: function (data: any) {
          if (data) {
            callback(this.ticket);
          } else {
            // Ticket no longer passes validation but we are still logged in, so try to renew the ticket
            this.createTicket((ticket: any) => {
              this.ticket = ticket;
              callback(ticket);
            });
          }
        },
        error: $.proxy(function (jqXHR: any) {
          if (jqXHR.status == 403) {
            // According to server, we are no longer logged in. Stop everything, user needs to login again
            this.discardCurrentWebSocket(true);
            this.store.dispatch(
              actions.openNotificationDialog(i18n.t("notifications.403"))
            );
            callback();
          } else if (jqXHR.status == 502) {
            // Server is down. Stop everything, user needs to reload page
            this.discardCurrentWebSocket(true);
            this.store.dispatch(
              actions.openNotificationDialog(i18n.t("notifications.502"))
            );
            callback();
          } else {
            // Something else happened. Carry on since we're most likely reconnecting anyway
            this.ticket = null;
            callback();
          }
        }, this),
      });
    } else {
      // Create new ticket
      this.createTicket((ticket: any) => {
        this.ticket = ticket;
        callback(ticket);
      });
    }
  }

  /**
   * createTicket
   * @param callback callback
   */
  createTicket(callback: Function) {
    // Check if we have given up for good
    if (this.discarded) {
      callback();
    } else {
      $.ajax({
        url: "/rest/websocket/ticket",
        type: "GET",
        dataType: "text",
        /**
         * success
         * @param data data
         */
        success: function (data: any) {
          callback(data);
        },
        /**
         * error
         */
        error: function () {
          callback();
        },
      });
    }
  }

  /**
   * onWebSocketConnected
   */
  onWebSocketConnected() {
    // Clear possible reconnection handler
    if (this.reconnectHandler) {
      clearTimeout(this.reconnectHandler);
      this.reconnectHandler = null;
    }
    this.reconnecting = false;
    this.reconnectRetries = 0;

    // Tell the world we're in business
    this.socketOpen = true;
    this.trigger("webSocketConnected");

    // If we have queued messages, send them now
    while (this.socketOpen && this.messagesPending.length) {
      const message = this.messagesPending.shift();
      this.sendMessage(message.eventType, message.data, message.onSent);
    }

    // Start pinging to ensure connection stays alive
    this.startPinging();
  }

  /**
   * onWebSocketError
   */
  onWebSocketError() {
    if (!this.reconnecting && !this.discarded) {
      this.startReconnecting();
    }
  }

  /**
   * openWebSocket
   */
  openWebSocket() {
    const host = window.location.host;
    const secure = location.protocol == "https:";
    this.webSocket = this.createWebSocket(
      (secure ? "wss://" : "ws://") + host + "/ws/socket/" + this.ticket
    );
    if (this.webSocket) {
      this.webSocket.onmessage = this.onWebSocketMessage.bind(this);
      this.webSocket.onerror = this.onWebSocketError.bind(this);
      this.webSocket.onopen = this.onWebSocketConnected.bind(this);
    }
  }

  /**
   * createWebSocket
   * @param url url
   */
  createWebSocket(url: string) {
    if (typeof (<any>window).WebSocket !== "undefined") {
      return new WebSocket(url);
    } else if (typeof (<any>window).MozWebSocket !== "undefined") {
      return new (<any>window).MozWebSocket(url);
    }
    return null;
  }

  /**
   * startPinging
   */
  startPinging() {
    this.pingHandler = setInterval(() => {
      // Skip just in case we would be closed or reconnecting
      if (!this.socketOpen || this.reconnecting || this.discarded) {
        return;
      }
      if (!this.waitingPong) {
        // Ping pong match start
        this.waitingPong = true;
        this.gotPong = false;
        this.sendMessage("ping:ping", {});
      } else if (this.gotPong) {
        // Sent ping, got pong, just keep it up
        this.waitingPong = true;
        this.gotPong = false;
        this.sendMessage("ping:ping", {});
      } else {
        // Didn't get a pong to our latest ping in ten seconds, reconnect
        if (!this.reconnecting && !this.discarded) {
          this.startReconnecting();
        }
      }
    }, this.options.pingInterval);
  }

  /**
   * startReconnecting
   */
  startReconnecting() {
    // Ignore if we are already busy reconnecting
    if (this.reconnecting || this.discarded) {
      return;
    }
    this.reconnecting = true;
    this.reconnectRetries = 0;

    // Ditch the old websocket and anything related to it (except that we are reconnecting)
    this.discardCurrentWebSocket(false);

    // Start the initial reconnect attempt
    this.reconnect();
  }

  /**
   * reconnect
   */
  reconnect() {
    // Skip if we are discarded already
    if (this.discarded) {
      return;
    }
    this.getTicket(() => {
      if (this.ticket) {
        // Re-acquired ticket, ditch reconnect handler and open socket
        if (this.reconnectHandler) {
          clearTimeout(this.reconnectHandler);
          this.reconnectHandler = null;
        }
        this.openWebSocket();
      } else {
        this.reconnectRetries++;
        if (this.reconnectRetries == 6) {
          // one minute has passed, let's give up
          this.discardCurrentWebSocket(true);
          this.store.dispatch(
            actions.openNotificationDialog(
              i18n.t("notifications.502")
            ) as Action
          );
        } else {
          // Reconnect retry failed, retry after reconnectInterval
          this.reconnectHandler = setTimeout(() => {
            this.reconnect();
          }, this.options.reconnectInterval) as any;
        }
      }
    });
  }

  /**
   * discardCurrentWebSocket
   * @param resetReconnectionParams resetReconnectionParams
   */
  discardCurrentWebSocket(resetReconnectionParams: boolean) {
    // Inform everyone we're no longer open for business...
    const wasOpen = this.socketOpen;
    this.socketOpen = false;
    this.discarded = resetReconnectionParams;
    this.ticket = null;

    // ...and stop pinging...
    if (this.pingHandler) {
      clearInterval(this.pingHandler);
    }
    this.waitingPong = false;
    this.gotPong = false;

    // ...and detach possible reconnect handler...
    if (this.reconnectHandler) {
      clearTimeout(this.reconnectHandler);
      this.reconnectHandler = null;
    }
    if (resetReconnectionParams) {
      this.reconnecting = false;
      this.reconnectRetries = 0;
    }

    // ...and get rid of the current websocket
    if (this.webSocket) {
      this.webSocket.onmessage = null;
      this.webSocket.onerror = null;
      this.webSocket.onopen = null;
      if (wasOpen) {
        try {
          this.webSocket.close();
        } catch (e) {
          // Ignore exceptions related to closing a WebSocket
        }
      }
      this.webSocket = null;
    }
  }

  /**
   * onWebSocketMessage
   * @param event event
   */
  onWebSocketMessage(event: any) {
    const message = JSON.parse(event.data);
    const eventType = message.eventType;
    if (eventType == "ping:pong") {
      this.gotPong = true;
    } else {
      this.trigger(eventType, message.data);
    }
  }

  /**
   * onBeforeWindowUnload
   */
  onBeforeWindowUnload() {
    this.discardCurrentWebSocket(true);
  }
}
