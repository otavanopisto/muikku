import { EventEmitter } from "./EventEmitter";

/**
 * Represents a WebSocket message structure
 * @interface WebSocketMessage
 */
interface WebSocketMessage {
  /** The type of event being sent/received */
  eventType: string;
  /** The data payload of the message */
  data: unknown;
}

/**
 * Represents a WebSocket message that is queued for sending
 * @interface QueuedMessage
 * @augments WebSocketMessage
 */
interface QueuedMessage extends WebSocketMessage {
  stackId?: string;
}

/**
 * Callbacks for handling WebSocket events
 */
export interface WebSocketCallbacks {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onSync?: () => void;
  onDesync?: () => void;
  openNotificationDialog?: (code: number) => void;
}

/**
 * Configuration options for the WebSocket connection
 * @interface WebSocketOptions
 */
interface WebSocketOptions {
  /** Interval in milliseconds between reconnection attempts */
  reconnectInterval: number;
  /** Interval in milliseconds between ping messages */
  pingInterval: number;
  /** Maximum number of reconnection attempts before giving up */
  maxReconnectAttempts: number;
}

/**
 * WebsocketInitOptions - Extend the options type
 */
export interface WebSocketInitOptions extends WebSocketOptions {
  // Event listeners for the WebSocket
  eventListeners?: WebSocketListener;
}

/**
 * WebSocket listener type
 */
export type WebSocketListener = Record<string, ((data?: unknown) => void)[]>;

/**
 * Internal state of the WebSocket connection
 * @interface WebSocketState
 */
interface WebSocketState {
  /** Whether the WebSocket is currently connected */
  isConnected: boolean;
  /** Whether the WebSocket is currently attempting to reconnect */
  isReconnecting: boolean;
  /** Number of reconnection attempts made */
  reconnectAttempts: number;
  /** Last error that occurred, if any */
  lastError: Error | null;
  /** Whether the WebSocket has been discarded and should not attempt reconnection */
  discarded: boolean;
}

/**
 * Custom error class for WebSocket-related errors
 * @class WebSocketError
 * @augments Error
 */
export class WebSocketError extends Error {
  public readonly code: string;
  public readonly originalError?: Error;

  /**
   * Creates a new WebSocketError
   * @param message - Error message
   * @param code - Error code for identifying the type of error
   * @param originalError - Original error that caused this error, if any
   */
  constructor(message: string, code: string, originalError?: Error) {
    super(message);
    this.name = "WebSocketError";
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * WebSocket utility class for handling real-time communication
 * @class MuikkuWebsocket
 * @augments EventEmitter
 */
export class MuikkuWebsocket extends EventEmitter {
  // Static property to hold the single instance
  private static instance: MuikkuWebsocket | null = null;

  private readonly options: WebSocketOptions;
  private readonly callbacks: WebSocketCallbacks;
  private socket: WebSocket | null = null;
  private state: WebSocketState = {
    isConnected: false,
    isReconnecting: false,
    reconnectAttempts: 0,
    lastError: null,
    discarded: false,
  };
  private messageQueue: QueuedMessage[] = [];
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private ticket: string | null = null;
  private waitingPong = false;
  private gotPong = false;

  /**
   * Creates a new MuikkuWebsocket instance
   * @param options - Configuration options for the WebSocket
   * @param callbacks - Callbacks for handling WebSocket events
   */
  private constructor(
    options: WebSocketInitOptions,
    callbacks: WebSocketCallbacks
  ) {
    super();
    this.options = options;
    this.callbacks = callbacks;

    // Register event listeners if provided
    if (options.eventListeners) {
      for (const [event, listeners] of Object.entries(options.eventListeners)) {
        listeners.forEach((listener) => this.on(event, listener));
      }
    }

    // Add window unload handler
    window.addEventListener(
      "beforeunload",
      this.onBeforeWindowUnload.bind(this)
    );
  }

  /**
   * Establishes a WebSocket connection
   * @throws {WebSocketError} If ticket retrieval or connection fails
   */
  public async connect(): Promise<void> {
    if (this.state.discarded) {
      throw new WebSocketError("WebSocket has been discarded", "DISCARDED");
    }

    try {
      await this.getTicket();
      if (!this.ticket) {
        throw new WebSocketError("Failed to get ticket", "TICKET_FAILED");
      }
      await this.establishConnection();
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Sends a message through the WebSocket
   * @param eventType - Type of event to send
   * @param data - Data to send with the event
   */
  public async send(eventType: string, data: unknown): Promise<void> {
    const message: WebSocketMessage = { eventType, data };
    await this.sendMessage(message);
  }

  /**
   * Sends a message through the WebSocket with a stackId
   * @param eventType - Type of event to send
   * @param data - Data to send with the event
   * @param stackId - Stack ID for the message
   */
  public async sendWithStackId(
    eventType: string,
    data: unknown,
    stackId: string
  ): Promise<void> {
    const message: WebSocketMessage = { eventType, data };
    await this.sendMessage(message, stackId);
  }

  /**
   * Queues a message for sending when the WebSocket is connected
   * @param eventType - Type of event to send
   * @param data - Data to send with the event
   * @param onSent - Optional callback when message is sent
   * @param stackId - Optional stack ID for message deduplication
   */
  public queueMessage(
    eventType: string,
    data: unknown,
    stackId?: string
  ): void {
    const message: WebSocketMessage = { eventType, data };

    // Check for existing message with same stackId and replace it

    const index = this.messageQueue.findIndex((m) => m.stackId === stackId);

    if (index !== -1) {
      this.messageQueue[index] = message;
    } else {
      this.messageQueue.push(message);
    }
  }

  /**
   * Disconnects the WebSocket and cleans up resources
   */
  public disconnect(): void {
    this.cleanup();
    this.emit("disconnected");
  }

  /**
   * Retrieves a WebSocket ticket from the server
   * @throws {WebSocketError} If ticket retrieval fails
   * @private
   */
  private async getTicket(): Promise<void> {
    if (this.state.discarded) {
      return;
    }

    try {
      // If we have a ticket, validate it first
      if (this.ticket) {
        const checkResponse = await fetch(
          `/rest/websocket/ticket/${this.ticket}/check`
        );

        if (checkResponse.ok) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const isValid = await checkResponse.json();
          if (isValid) {
            return; // Ticket is valid, we can use it
          }
          // Ticket is invalid, we'll get a new one
        } else {
          // Handle 403 errors specially - stop all reconnection attempts immediately
          if (checkResponse.status === 403) {
            this.stopReconnectionAndShowError(403);
            return;
          }
          // For other errors, only show notification dialogs if we're not in reconnection mode
          // or if we've exhausted all reconnection attempts
          if (
            !this.state.isReconnecting ||
            this.state.reconnectAttempts >= this.options.maxReconnectAttempts
          ) {
            // Server is down. Stop everything, user needs to reload page
            if (checkResponse.status === 502) {
              this.callbacks.openNotificationDialog?.(502);
            }
          }
        }
      }

      // Get a new ticket
      const newTicket = await this.createTicket();
      if (newTicket) {
        this.ticket = newTicket;
      } else {
        throw new WebSocketError(
          "Failed to create new ticket",
          "TICKET_FAILED"
        );
      }
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Creates a new WebSocket ticket
   * @returns {Promise<string | null>} The new ticket or null if creation fails
   * @private
   */
  private async createTicket(): Promise<string | null> {
    if (this.state.discarded) {
      return null;
    }

    try {
      const response = await fetch("/rest/websocket/ticket");
      if (!response.ok) {
        if (response.status === 403) {
          this.stopReconnectionAndShowError(403);
          this.callbacks.onError?.(new WebSocketError("403", "AUTH_FAILED"));
          throw new WebSocketError("Authentication failed", "AUTH_FAILED");
        }
        if (response.status === 502) {
          // Only show notification dialogs if we're not in reconnection mode
          // or if we've exhausted all reconnection attempts
          if (
            !this.state.isReconnecting ||
            this.state.reconnectAttempts >= this.options.maxReconnectAttempts
          ) {
            this.callbacks.openNotificationDialog?.(502);
          }
        }
        throw new WebSocketError("Failed to get ticket", "TICKET_FAILED");
      }
      return await response.text();
    } catch (error) {
      this.handleError(error as Error);
      return null;
    }
  }

  /**
   * Establishes the WebSocket connection
   * @throws {WebSocketError} If connection fails
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  private async establishConnection(): Promise<void> {
    if (this.state.discarded) {
      return;
    }

    if (this.socket) {
      this.cleanup();
    }

    const host = window.location.host;
    const secure = location.protocol === "https:";
    const wsUrl = `${secure ? "wss://" : "ws://"}${host}/ws/socket/${
      this.ticket
    }`;

    try {
      this.socket = new WebSocket(wsUrl);
      this.setupSocketListeners();
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Sets up WebSocket event listeners
   * @private
   */
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.state.isConnected = true;
      this.state.isReconnecting = false;
      this.state.reconnectAttempts = 0;
      this.state.discarded = false; // Reset discarded state on successful connection
      this.startPingInterval();
      this.processMessageQueue();
      this.emit("connected");
      this.callbacks.onConnected?.();
    };

    this.socket.onclose = () => {
      this.handleConnectionLoss();
      this.callbacks.onDisconnected?.();
    };

    this.socket.onerror = (event: Event) => {
      const error = new WebSocketError(
        "WebSocket error occurred",
        "WEBSOCKET_ERROR",
        event instanceof Error ? event : undefined
      );
      this.handleError(error);
      this.callbacks.onError?.(error);
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string) as WebSocketMessage;
        if (message.eventType === "ping:pong") {
          this.gotPong = true;
          this.emit("pong");
        } else {
          this.handleMessage(message);
          this.callbacks.onMessage?.(message);
        }
      } catch (error) {
        this.handleError(error as Error);
      }
    };
  }

  /**
   * Sends a message through the WebSocket
   * @param message - Message to send
   * @param stackId - Optional stack ID for message
   * @private
   */
  private async sendMessage(
    message: WebSocketMessage,
    stackId?: string
  ): Promise<void> {
    if (!this.state.isConnected) {
      // Check for existing message with same stackId
      if (stackId) {
        const index = this.messageQueue.findIndex((m) => m.stackId === stackId);
        if (index !== -1) {
          this.messageQueue.splice(index, 1);
        }
      }
      this.messageQueue.push({ ...message, stackId });
      return;
    }

    try {
      if (!this.socket) {
        throw new WebSocketError(
          "WebSocket not initialized",
          "NOT_INITIALIZED"
        );
      }
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await this.socket.send(JSON.stringify(message));
      this.emit("messageSent", message);
    } catch (error) {
      this.messageQueue.push({ ...message, stackId });
      this.emit("messageQueued", message);
      this.handleError(error as Error);
    }
  }

  /**
   * Handles incoming WebSocket messages
   * @param message - Received message
   * @private
   */
  private handleMessage(message: WebSocketMessage): void {
    if (message.eventType === "ping:pong") {
      this.gotPong = true;
      this.emit("pong");
    } else {
      this.emit(message.eventType, message.data);
      this.callbacks.onMessage?.(message);
    }
  }

  /**
   * Handles WebSocket connection loss
   * @private
   */
  private handleConnectionLoss(): void {
    this.state.isConnected = false;
    this.cleanup();

    if (!this.state.isReconnecting && !this.state.discarded) {
      this.startReconnection();
    }
  }

  /**
   * Starts the reconnection process
   * @private
   */
  private startReconnection(): void {
    if (this.state.discarded) {
      return;
    }

    if (this.state.reconnectAttempts >= this.options.maxReconnectAttempts) {
      // eslint-disable-next-line no-console
      console.error("Max reconnection attempts reached");
      this.stopReconnectionAndShowError(502);
      return;
    }

    this.state.isReconnecting = true;
    this.state.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      try {
        void this.connect();
      } catch (error) {
        this.handleError(error as Error);
        // If reconnection failed, try again if we haven't exceeded max attempts
        if (this.state.reconnectAttempts < this.options.maxReconnectAttempts) {
          this.startReconnection();
        } else {
          // eslint-disable-next-line no-console
          console.error("Max reconnection attempts reached, giving up");
          this.stopReconnectionAndShowError(502);
        }
      }
    }, this.options.reconnectInterval);
  }

  /**
   * Stops reconnection attempts and shows appropriate error dialog
   * @param errorCode - Error code to show in dialog
   * @private
   */
  private stopReconnectionAndShowError(errorCode: number): void {
    this.state.isReconnecting = false;
    this.state.reconnectAttempts = 0;
    this.state.discarded = true; // Prevent any further connection attempts
    this.cleanup();
    this.callbacks.openNotificationDialog?.(errorCode);
    this.callbacks.onError?.(
      new WebSocketError("WebSocket connection failed", "CONNECTION_FAILED")
    );
  }

  /**
   * Starts the ping interval to keep the connection alive
   * @private
   */
  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      if (this.state.isConnected && !this.state.discarded) {
        if (!this.waitingPong) {
          this.waitingPong = true;
          this.gotPong = false;
          void this.send("ping:ping", {});
        } else if (this.gotPong) {
          this.waitingPong = true;
          this.gotPong = false;
          void this.send("ping:ping", {});
        } else {
          // No pong received, reconnect
          this.handleConnectionLoss();
        }
      }
    }, this.options.pingInterval);
  }

  /**
   * Processes the message queue
   * @private
   */
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        void this.sendMessage(message);
      }
    }
  }

  /**
   * Handles WebSocket errors
   * @param error - Error that occurred
   * @private
   */
  private handleError(error: Error): void {
    this.state.lastError = error;
    this.emit("error", error);
    this.callbacks.onError?.(error);
  }

  /**
   * Cleans up WebSocket resources
   * @private
   */
  private cleanup(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onmessage = null;
      this.socket.close();
      this.socket = null;
    }

    this.state.isConnected = false;
    this.state.isReconnecting = false;
    // Note: We don't reset discarded state here as it should persist until a successful connection
  }

  /**
   * Adds a callback to be executed when an event occurs
   * @param event - Event type to listen for
   * @param callback - Function to be called with event data
   * @returns this for chaining
   */
  public addCallback(event: string, callback: (data?: unknown) => void): this {
    this.on(event, callback);
    return this;
  }

  /**
   * Removes a callback from an event
   * @param event - Event type
   * @param callback - Callback function to remove
   */
  public removeCallback(
    event: string,
    callback: (data: unknown) => void
  ): void {
    this.removeListener(event, callback);
  }

  /**
   * Gets the current WebSocket instance
   * @returns The current WebSocket instance or null if not initialized
   */
  public static getInstance(): MuikkuWebsocket | null {
    return MuikkuWebsocket.instance;
  }

  /**
   * Creates a new WebSocket instance or returns existing one
   * @param options - WebSocket options
   * @param callbacks - Callbacks for handling WebSocket events
   */
  public static createInstance(
    options: WebSocketInitOptions,
    callbacks: WebSocketCallbacks
  ): MuikkuWebsocket {
    MuikkuWebsocket.instance ??= new MuikkuWebsocket(options, callbacks);
    return MuikkuWebsocket.instance;
  }

  /**
   * Handles window unload
   * @private
   */
  private onBeforeWindowUnload(): void {
    this.cleanup();
  }
}
