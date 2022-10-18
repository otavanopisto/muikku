/**
 * As of this moment, this is only used in the chat.
 * If there's ever any other use for this, this needs to be further developed
 * so that there's a namespace for all the intervals this creates.
 * Otherwise there will be many timeouts switching the document title and it'll be messy
 */

/**
 * Blinking notification for browser tab
 */
export class BrowserTabNotification {
  private currentTitle = document.title;
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
