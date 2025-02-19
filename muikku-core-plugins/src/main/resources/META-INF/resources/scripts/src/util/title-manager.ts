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
 * Manages the page title and favicon in the browser tab.
 * Supports multiple notifications and favicons with priority system.
 */
class TitleManager {
  private baseTitle: string;
  private notifications: Map<string, Notification>;
  private subscribers: Set<(state: { title: string }) => void>;
  private animationTimer: NodeJS.Timeout | null = null;
  private animationIndex: number = 0;
  private readonly ANIMATION_INTERVAL = 1000; // 1 second

  /**
   * Creates a new TitleManager instance
   * @param baseTitle - The default title to show when no notifications are present
   */
  constructor(baseTitle = "Muikku") {
    this.baseTitle = baseTitle;
    this.notifications = new Map();
    this.subscribers = new Set();
  }

  /**
   * Subscribe to title and favicon changes
   * @param callback - Function to be called when title or favicon changes
   * @returns Cleanup function to unsubscribe
   */
  subscribe(callback: (state: { title: string }) => void): () => void {
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
   * Removes all current notifications while keeping subscriptions intact
   */
  clearNotifications() {
    this.notifications.clear();
    this.notifySubscribers();
  }

  /**
   * Cleans up all subscriptions and resets manager to initial state
   */
  destroy() {
    this.stopTitleAnimation();
    this.subscribers.clear();
    this.notifications.clear();
    this.baseTitle = "Muikku";
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
    };
    this.subscribers.forEach((callback) => callback(state));
  }
}

/**
 * Singleton instance of TitleManager for global use
 */
export const titleManager = new TitleManager();
