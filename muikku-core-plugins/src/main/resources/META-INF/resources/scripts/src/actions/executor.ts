export class SimpleActionExecutor {
  private oneFails: () => void;
  private allSucceeds: () => void;
  private totals: number = 0;
  private executed: number = 0;
  private success: number = 0;
  private fails: number = 0;

  constructor() {

  }

  private done() {
    if (this.totals === this.executed) {
      if (this.fails === 0) {
        this.allSucceeds && this.allSucceeds();
      } else {
        this.oneFails && this.oneFails();
      }
    }
  }

  public addAction(condition: boolean, fn: () => void) {
    if (condition) {
      this.totals++;
      fn();
    }

    return this;
  }

  public succeeded() {
    this.executed++;
    this.success++;

    this.done();
  }

  public failed() {
    this.executed++;
    this.fails++;

    this.done();
  }

  public onAllSucceed(fn: () => void) {
    this.allSucceeds = fn;

    return this;
  }

  public onOneFails(fn: () => void) {
    this.oneFails = fn;

    return this;
  }
}