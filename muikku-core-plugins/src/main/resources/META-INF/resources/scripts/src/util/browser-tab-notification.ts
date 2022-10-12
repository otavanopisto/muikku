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
