/**
 * Interface for the class
 */
export interface IBrowserTabNotification {
  on: (newTitle: string) => void;
  off: () => void;
}

/**
 * Blinking notification for browser tab
 */
export class BrowserTabNotification {
  private currentTitle = document.title;
  // private currentTimeOut = window.
  private interval: NodeJS.Timeout = null;

  /**
   * On-switch for the tab notification
   * @param newTitle
   */
  public on = (newTitle: string) => {
    if (document.hidden) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        document.title =
          this.currentTitle === document.title ? newTitle : this.currentTitle;
      }, 4000);

      let test = this.interval;

      // for(let i = 0; i < this.interval.ref; i++;) {}
    }
  };

  /**
   * Off-switch for the tab notification
   */
  public off = () => {
    clearInterval(this.interval);
    document.title = this.currentTitle;
  };
}
