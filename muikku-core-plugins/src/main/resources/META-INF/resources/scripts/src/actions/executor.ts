export class SimpleActionExecutor {
  private oneFails: () => void;
  private allSucceeds: () => void;
  private totals = 0;
  private executed = 0;
  private success = 0;
  private fails = 0;

  constructor() {
    this.succeeded = this.succeeded.bind(this);
    this.done = this.done.bind(this);
    this.failed = this.failed.bind(this);
    this.onAllSucceed = this.onAllSucceed.bind(this);
    this.onOneFails = this.onOneFails.bind(this);
    this.addAction = this.addAction.bind(this);
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

  public failed() {
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
