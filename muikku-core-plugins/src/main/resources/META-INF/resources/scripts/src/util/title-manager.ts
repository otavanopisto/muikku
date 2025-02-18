/**
 * Represents a notification that can be shown in the page title
 */
type Notification = {
  /** Unique identifier for the notification */
  id: string;
  /** Text to be shown in the title */
  text: string;
  /** Optional priority value. Higher priority notifications are shown first */
  priority?: number;
};

/**
 * Represents a favicon that can be shown in the browser tab
 */
type Favicon = {
  /** Unique identifier for the favicon */
  id: string;
  /** URL path to the favicon file */
  href: string;
  /** Optional priority value. Higher priority favicon overrides others */
  priority?: number;
};

/**
 * Type for the callback function used in subscribe method
 */
export type SubscribeCallback = (state: {
  title: string;
  favicon: string;
}) => void;

/**
 * Manages the page title and favicon in the browser tab.
 * Supports multiple notifications and favicons with priority system.
 */
class TitleManager {
  private baseTitle: string;
  private baseFavicon: string;
  private notifications: Map<string, Notification>;
  private favicons: Map<string, Favicon>;
  private subscribers: Set<SubscribeCallback>;
  private animationTimer: NodeJS.Timeout | null = null;
  private animationIndex: number = 0;
  private readonly ANIMATION_INTERVAL = 1000; // 1 second

  /**
   * Creates a new TitleManager instance
   * @param baseTitle - The default title to show when no notifications are present
   * @param baseFavicon - The default favicon path to use when no custom favicons are set
   */
  constructor(baseTitle = "Muikku", baseFavicon = "/favicon.ico") {
    this.baseTitle = baseTitle;
    this.baseFavicon = baseFavicon;
    this.notifications = new Map();
    this.favicons = new Map();
    this.subscribers = new Set();
  }

  /**
   * Subscribe to title and favicon changes
   * @param callback - Function to be called when title or favicon changes
   * @returns Cleanup function to unsubscribe
   */
  subscribe(callback: SubscribeCallback): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Adds a notification to be shown in the page title
   * @param notification - The notification to add
   */
  addNotification(notification: Notification) {
    this.notifications.set(notification.id, notification);

    // Start animation if 2 or more notifications
    if (this.notifications.size >= 2) {
      this.startTitleAnimation();
    }

    this.notifySubscribers();
  }

  /**
   * Removes a notification from the page title
   * @param id - The ID of the notification to remove
   */
  removeNotification(id: string) {
    this.notifications.delete(id);

    // Stop animation if less than 2 notifications
    if (this.notifications.size < 2) {
      this.stopTitleAnimation();
    }

    this.notifySubscribers();
  }

  /**
   * Sets the base title shown when no notifications are present
   * @param title - The new base title
   */
  setBaseTitle(title: string) {
    this.baseTitle = title;
    this.notifySubscribers();
  }

  /**
   * Sets a custom favicon
   * @param favicon - The favicon configuration to set
   */
  setFavicon(favicon: Favicon) {
    this.favicons.set(favicon.id, favicon);
    this.notifySubscribers();
  }

  /**
   * Removes a custom favicon
   * @param id - The ID of the favicon to remove
   */
  removeFavicon(id: string) {
    this.favicons.delete(id);
    this.notifySubscribers();
  }

  /**
   * Gets the current complete title, including any active notifications
   * @returns The current page title
   */
  getCurrentTitle(): string {
    const count = this.notifications.size;

    // Get base notifications text
    const notifications = Array.from(this.notifications.values())
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .map((n) => n.text)
      .join(" ");

    const baseTitle = notifications
      ? `${notifications} ${this.baseTitle}`
      : this.baseTitle;

    // If less than 2 notifications, return normal title
    if (count < 2) {
      return baseTitle;
    }

    // Handle animation
    const pattern = this.getAnimationPattern();
    const currentPattern = pattern[this.animationIndex % pattern.length];

    return currentPattern
      .replace("%title%", baseTitle)
      .replace("%count%", count.toString());
  }

  /**
   * Gets the current favicon path, considering priority
   * @returns The current favicon path
   */
  getCurrentFavicon(): string {
    const activeFavicons = Array.from(this.favicons.values());
    if (activeFavicons.length > 0) {
      return activeFavicons.sort(
        (a, b) => (b.priority || 0) - (a.priority || 0)
      )[0].href;
    }
    return this.baseFavicon;
  }

  /**
   * Removes all current notifications while keeping subscriptions intact
   */
  clearNotifications() {
    this.notifications.clear();
    this.notifySubscribers();
  }

  /**
   * Removes all current favicons while keeping subscriptions intact
   */
  clearFavicons() {
    this.favicons.clear();
    this.notifySubscribers();
  }

  /**
   * Cleans up all subscriptions and resets manager to initial state
   */
  destroy() {
    this.stopTitleAnimation();
    this.subscribers.clear();
    this.notifications.clear();
    this.favicons.clear();
    this.baseTitle = "Muikku";
    this.baseFavicon = "/favicon.ico";
  }

  /**
   * Starts the title animation
   * @private
   */
  private startTitleAnimation() {
    if (this.animationTimer) {
      this.stopTitleAnimation();
    }

    this.animationTimer = setInterval(() => {
      this.animationIndex++;
      this.notifySubscribers();
    }, this.ANIMATION_INTERVAL);
  }

  /**
   * Stops the title animation
   * @private
   */
  private stopTitleAnimation() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
      this.animationIndex = 0;
      this.notifySubscribers();
    }
  }

  /**
   * Gets the animation pattern based on the number of notifications
   * @returns The animation pattern
   * @private
   */
  private getAnimationPattern(): string[] {
    const count = this.notifications.size;

    if (count > 5) {
      return ["🔥 (%count%) %title%", "%title%"];
    } else if (count > 1) {
      return ["📨 (%count%) %title%", "%title%"];
    }

    return ["%title%"]; // No animation for single notification
  }

  /**
   * Notifies all subscribers of the current title and favicon state
   * @private
   */
  private notifySubscribers() {
    const state = {
      title: this.getCurrentTitle(),
      favicon: this.getCurrentFavicon(),
    };
    this.subscribers.forEach((callback) => callback(state));
  }
}

/**
 * Singleton instance of TitleManager for global use
 */
export const titleManager = new TitleManager();
