import * as React from "react";

/**
 * BodyScrollLoader
 */
export default class BodyScrollLoader<T, S> extends React.Component<T, S> {
  public statePropertyLocation: string;
  public applicationIsReady: () => boolean;
  public hasMorePropertyLocation: string;
  public hasMore: () => boolean;
  public loadMoreTriggerFunctionLocation: string;
  public loadMoreTriggerFunctionParameters: any;
  public loadMoreTriggerFunction: any;
  public cancellingLoadingPropertyLocation: string;
  private lastTimeCalledLoadMore: number;

  /**
   * constructor
   * @param props props
   */
  constructor(props: T) {
    super(props);
    this.lastTimeCalledLoadMore = 0;
    this.checkCanLoadMore = this.checkCanLoadMore.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    window.addEventListener("scroll", this.onScroll);
  }

  /**
   * componentDidUpdate
   * @returns
   */
  componentDidUpdate() {
    if (
      this.cancellingLoadingPropertyLocation &&
      (this.props as any)[this.cancellingLoadingPropertyLocation]
    ) {
      return;
    }
    const isReadyByState =
      ((this.props as any)[this.statePropertyLocation] as string) === "READY" &&
      (this.props as any)[this.hasMorePropertyLocation];
    const isReadyByFunction =
      this.applicationIsReady && this.applicationIsReady();
    const hasMoreByFunction = this.hasMore && this.hasMore();
    const hasMoreByState = (this.props as any)[this.hasMorePropertyLocation];
    const isReady = isReadyByState || isReadyByFunction;
    const hasMore = hasMoreByFunction || hasMoreByState;
    if (isReady && hasMore) {
      const doesNotHaveScrollBar =
        document.documentElement.scrollHeight ===
        document.documentElement.offsetHeight;
      if (doesNotHaveScrollBar) {
        if (this.loadMoreTriggerFunctionLocation) {
          (this.props as any)[this.loadMoreTriggerFunctionLocation]();
        } else {
          this.loadMoreTriggerFunction();
        }
      }
    }
    this.checkCanLoadMore();
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  /**
   * checkCanLoadMore
   */
  checkCanLoadMore() {
    if (
      this.cancellingLoadingPropertyLocation &&
      (this.props as any)[this.cancellingLoadingPropertyLocation]
    ) {
      return;
    }
    const isReadyByState =
      ((this.props as any)[this.statePropertyLocation] as string) === "READY" &&
      (this.props as any)[this.hasMorePropertyLocation];
    const isReadyByFunction =
      this.applicationIsReady && this.applicationIsReady();
    const hasMoreByFunction = this.hasMore && this.hasMore();
    const hasMoreByState = (this.props as any)[this.hasMorePropertyLocation];
    const isReady = isReadyByState || isReadyByFunction;
    const hasMore = hasMoreByFunction || hasMoreByState;
    if (isReady && hasMore) {
      const scrollBottomRemaining =
        document.documentElement.scrollHeight -
        ((document.body.scrollTop || document.documentElement.scrollTop) +
          document.documentElement.offsetHeight);
      if (scrollBottomRemaining <= 100) {
        const currentlyCalled = new Date().getTime();
        if (currentlyCalled - this.lastTimeCalledLoadMore < 300) {
          return;
        }
        this.lastTimeCalledLoadMore = currentlyCalled;

        if (this.loadMoreTriggerFunctionLocation) {
          (this.props as any)[this.loadMoreTriggerFunctionLocation]();
        } else {
          this.loadMoreTriggerFunction();
        }
      }
    }
  }

  /**
   * onScroll
   */
  onScroll() {
    this.checkCanLoadMore();
  }
}
