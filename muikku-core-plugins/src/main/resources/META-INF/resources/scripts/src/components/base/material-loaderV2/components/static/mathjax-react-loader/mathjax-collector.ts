/**
 * MathJaxCollector
 */
export class MathJaxCollector {
  static globalMap: Map<HTMLElement, MathJaxCollector> = new Map();

  /**
   * getCollectorForNode
   * @param element
   */
  static getCollectorForNode(element: HTMLElement) {
    return (
      MathJaxCollector.globalMap.get(element) || new MathJaxCollector(element)
    );
  }

  private executionTimer: NodeJS.Timer;
  private element: HTMLElement;

  /**
   * constructor
   * @param element element
   */
  constructor(element: HTMLElement) {
    this.element = element;
    MathJaxCollector.globalMap.set(element, this);

    this.execute = this.execute.bind(this);
    this.resetTimer = this.resetTimer.bind(this);

    // typescript being buggy again
    this.executionTimer = setTimeout(this.execute, 100) as any;
  }

  /**
   * execute
   */
  private execute() {
    MathJaxCollector.globalMap.delete(this.element);
    if (document.contains(this.element)) {
      (window as any).MathJax.Hub.Queue([
        "Typeset",
        (window as any).MathJax.Hub,
        this.element,
      ]);
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        "Attempted to execute the mathjax collector in a non existant component"
      );
    }
  }

  /**
   * resetTimer
   */
  resetTimer() {
    clearTimeout(this.executionTimer);
    this.executionTimer = setTimeout(this.execute, 100) as any;
  }
}
