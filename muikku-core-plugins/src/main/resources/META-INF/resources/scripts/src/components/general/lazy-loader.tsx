/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * LazyLoaderProps
 */
interface LazyLoaderProps {
  className: string;
  width?: string | number;
  height?: string | number;
  useChildrenAsLazy?: boolean;
  children?: any;
}

/**
 * LazyLoaderState
 */
interface LazyLoaderState {
  loaded: boolean;
}

let hasBeenToggledBefore = false;

// eslint-disable-next-line
(window as any).TOGGLE_LAZY = () => {
  window.dispatchEvent(new Event("TOGGLE_LAZY"));
  setTimeout(() => {
    hasBeenToggledBefore = true;
  }, 100);
};

/**
 * LazyLoader
 */
export default class LazyLoader extends React.Component<
  LazyLoaderProps,
  LazyLoaderState
> {
  private hasBeenForcefullyToggled = false;
  private id: string = "L" + uuidv4().replace(/-/g, "");
  private calculatedHeight: number;

  /**
   * constructor
   * @param props props
   */
  constructor(props: LazyLoaderProps) {
    super(props);

    this.state = {
      loaded: false,
    };

    this.checkWhetherInView = this.checkWhetherInView.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.toggleLazy = this.toggleLazy.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.checkWhetherInView();
    window.addEventListener("scroll", this.onScroll);
    window.addEventListener("CHECK_LAZY", this.checkWhetherInView);
    window.addEventListener("TOGGLE_LAZY", this.toggleLazy);
  }

  /**
   * toggleLazy
   */
  toggleLazy() {
    this.hasBeenForcefullyToggled = true;

    const lazyComponent = this.refs["lazycomponent"] as HTMLDivElement;
    this.calculatedHeight = lazyComponent ? lazyComponent.offsetHeight : null;

    this.setState({
      loaded: !hasBeenToggledBefore ? true : !this.state.loaded,
    });
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   * @param prevState prevState
   */
  componentDidUpdate(prevProps: LazyLoaderProps, prevState: LazyLoaderState) {
    if (!this.hasBeenForcefullyToggled) {
      this.checkWhetherInView();
    }

    if (
      this.state.loaded !== prevState.loaded &&
      this.hasBeenForcefullyToggled
    ) {
      const lazyComponent = this.refs["lazycomponent"] as HTMLDivElement;
      const newCalculatedHeight = lazyComponent
        ? lazyComponent.offsetHeight
        : null;
      if (
        newCalculatedHeight &&
        this.calculatedHeight &&
        newCalculatedHeight !== this.calculatedHeight
      ) {
        this.calculatedHeight = newCalculatedHeight;
      }
    }
  }

  /**
   * UNSAFE_componentWillReceiveProps
   */
  UNSAFE_componentWillReceiveProps() {
    this.checkWhetherInView();
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("CHECK_LAZY", this.checkWhetherInView);
    window.removeEventListener("TOGGLE_LAZY", this.toggleLazy);
  }

  /**
   * checkWhetherInView
   */
  checkWhetherInView() {
    if (this.state.loaded) {
      return;
    }

    const el: HTMLDivElement = this.refs["lazycomponent"] as HTMLDivElement;

    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    const isVisible = elemTop < window.innerHeight && elemBottom >= 0;

    if (isVisible) {
      this.setState({
        loaded: true,
      });
    }
  }

  /**
   * onScroll
   */
  onScroll() {
    if ((window as any).IGNORE_SCROLL_EVENTS) {
      return;
    }
    if (this.hasBeenForcefullyToggled) {
      return;
    }
    this.checkWhetherInView();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (this.state.loaded) {
      let toRender: React.ReactNode;
      if (this.props.useChildrenAsLazy) {
        toRender = this.props.children(true);
      } else {
        toRender = this.props.children;
      }

      if (this.hasBeenForcefullyToggled) {
        return (
          <div ref="lazycomponent" data-lazycomponent="true" id={this.id}>
            {toRender}
          </div>
        );
      } else {
        return toRender;
      }
    }
    return (
      <div
        ref="lazycomponent"
        data-lazycomponent="true"
        className={this.props.className}
        style={{ width: this.props.width, height: this.props.height }}
        id={this.id}
      >
        {this.props.useChildrenAsLazy ? this.props.children(false) : null}
      </div>
    );
  }
}
