/**
 * EventEmitter - Browser-compatible EventEmitter implementation
 */
export class EventEmitter {
  private events: Record<string, ((...args: unknown[]) => void)[]> = {};

  /**
   * Adds a listener to an event
   * @param event - Event type
   * @param listener - Listener function to add
   * @returns this for chaining
   */
  on(event: string, listener: (...args: unknown[]) => void): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  /**
   * Emits an event
   * @param event - Event type
   * @param args - Arguments to pass to the listeners
   * @returns true if the event was emitted, false otherwise
   */
  emit(event: string, ...args: unknown[]): boolean {
    if (!this.events[event]) {
      return false;
    }
    this.events[event].forEach((listener) => listener(...args));
    return true;
  }

  /**
   * Removes a listener from an event
   * @param event - Event type
   * @param listener - Listener function to remove
   * @returns this for chaining
   */
  removeListener(event: string, listener: (...args: unknown[]) => void): this {
    if (!this.events[event]) {
      return this;
    }
    const index = this.events[event].indexOf(listener);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
    return this;
  }

  /**
   * Removes all listeners from an event
   * @param event - Event type
   * @returns this for chaining
   */
  removeAllListeners(event?: string): this {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }
}
