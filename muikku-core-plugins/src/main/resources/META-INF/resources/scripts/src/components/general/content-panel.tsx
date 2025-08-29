/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import { WithTranslation } from "react-i18next";
import $ from "~/lib/jquery";
import "~/sass/elements/content-panel.scss";
import "~/sass/elements/loaders.scss";
import { IconButton } from "~/components/general/button";

/**
 * ContentPanelProps
 */
interface ContentPanelProps extends WithTranslation {
  modifier: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title?: React.ReactElement<any> | string;
  readspeakerComponent?: JSX.Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: React.ReactElement<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aside?: React.ReactElement<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  footer?: React.ReactElement<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpenNavigation?: () => any;
}

/**
 * ContentPanelState
 */
interface ContentPanelState {
  displayed: boolean;
  visible: boolean;
  dragging: boolean;
  drag: number;
  open: boolean;
}

/**
 * checkLinkClicked
 * @param target t
 * @returns boolean
 */
/* function checkLinkClicked(target: HTMLElement): boolean {
  return (
    target.nodeName.toLowerCase() === "a" ||
    (target.parentElement ? checkLinkClicked(target.parentElement) : false)
  );
} */

/**
 * ContentPanel
 */
export default class ContentPanel extends React.Component<
  ContentPanelProps,
  ContentPanelState
> {
  myRef = React.createRef<HTMLDivElement>();

  private touchCordX: number;
  private touchCordY: number;
  private touchMovementX: number;
  private preventXMovement: boolean;

  /**
   * constructor
   * @param props p
   */
  constructor(props: ContentPanelProps) {
    super(props);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.openNavigation = this.openNavigation.bind(this);
    this.closeNavigation = this.closeNavigation.bind(this);
    this.closeNavigationByOverlay = this.closeNavigationByOverlay.bind(this);

    this.state = {
      displayed: false,
      visible: false,
      dragging: false,
      drag: null,
      open: false,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount(): void {
    this.myRef.current.addEventListener("touchstart", this.onTouchStart, {
      passive: false,
    });
    this.myRef.current.addEventListener("touchmove", this.onTouchMove, {
      passive: false,
    });

    this.myRef.current.addEventListener("touchend", this.onTouchEnd, {
      passive: false,
    });
  }

  /**
   * openNavigation
   */
  componentWillUnmount(): void {
    this.myRef.current.removeEventListener("touchstart", this.onTouchStart);
    this.myRef.current.removeEventListener("touchmove", this.onTouchMove);
    this.myRef.current.removeEventListener("touchend", this.onTouchEnd);
  }

  /**
   * onTouchStart
   * @param e e
   */
  onTouchStart(e: TouchEvent) {
    this.setState({ dragging: true });
    this.touchCordX = e.changedTouches[0].pageX;
    this.touchCordY = e.changedTouches[0].pageY;
    this.touchMovementX = 0;
    this.preventXMovement = false;
  }

  /**
   * onTouchMove
   * @param e e
   */
  onTouchMove(e: TouchEvent) {
    let diffX = e.changedTouches[0].pageX - this.touchCordX;
    const diffY = e.changedTouches[0].pageY - this.touchCordY;
    const absoluteDifferenceX = Math.abs(diffX - this.state.drag);
    this.touchMovementX += absoluteDifferenceX;

    if (diffX < 0) {
      diffX = 0;
    }

    if (diffX <= 3) {
      if (diffY >= 5 || diffY <= -5) {
        diffX = 0;
        this.preventXMovement = true;
      } else {
        this.preventXMovement = false;
      }
    }

    if (!this.preventXMovement) {
      this.setState({ drag: diffX });
    }
  }

  /**
   * onTouchEnd
   * @param e e
   */
  onTouchEnd(e: TouchEvent) {
    const width = (
      document.querySelector(
        ".content-panel__navigation-content"
      ) as HTMLElement
    ).offsetWidth;
    const diff = this.state.drag;
    const movement = this.touchMovementX;

    const menuHasSlidedEnoughForClosing = Math.abs(diff) >= width * 0.33;
    const youJustClickedTheOverlay =
      e.target === this.refs["menu-overlay"] && movement <= 5;

    this.setState({ dragging: false });
    setTimeout(() => {
      this.setState({ drag: null });
      if (menuHasSlidedEnoughForClosing || youJustClickedTheOverlay) {
        this.closeNavigation();
      }
    }, 10);
  }

  /**
   * openNavigation
   */
  openNavigation() {
    this.setState({ displayed: true, open: true });
    setTimeout(() => {
      this.setState({ visible: true });
      this.props.onOpenNavigation && this.props.onOpenNavigation();
    }, 10);
    $(document.body).css({ overflow: "hidden" });
  }

  /**
   * closeNavigationByOverlay
   * @param e e
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closeNavigationByOverlay(e: React.MouseEvent<any>) {
    const isOverlay = e.target === e.currentTarget;

    if (!this.state.dragging && isOverlay) {
      this.closeNavigation();
    }
  }

  /**
   * closeNavigation
   */
  closeNavigation() {
    if (!this.state.visible) {
      return;
    }
    $(document.body).css({ overflow: "" });
    this.setState({ visible: false });
    setTimeout(() => {
      this.setState({ displayed: false, open: false });
    }, 300);
  }

  /**
   * handleNavigationButtonKeyDown
   * @param e e
   */
  handleNavigationOpenKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      this.openNavigation();
    }
  };

  /**
   * handleNavigationButtonKeyDown
   * @param e e
   */
  handleNavigationCloseKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      this.closeNavigation();
    }
  };

  /**
   * handleNavigationButtonKeyDown
   * @param e e
   */
  handleNavigationKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    e.stopPropagation();
    const isOverlay = e.target === e.currentTarget;

    if (!isOverlay) {
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      this.closeNavigation();
    }
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <main
        className={`content-panel content-panel--${this.props.modifier}`}
        ref="panel"
      >
        <div className="content-panel__container">
          <div className="content-panel__header">
            <h1 className="content-panel__header-title">{this.props.title}</h1>
          </div>
          {this.props.aside ? (
            <div className="content-panel__aside">{this.props.aside}</div>
          ) : null}

          <div className="content-panel__body" ref="body">
            <div className="content-panel__content">
              {/* Rendering the handle arrow for opening the ToC */}
              {this.props.navigation && (
                <div
                  className="content-panel__navigation-open"
                  onClick={this.openNavigation}
                  onKeyDown={this.handleNavigationOpenKeyDown}
                  tabIndex={0}
                  role="button"
                  aria-label={this.props.t("labels.tableOfContents", {
                    ns: "materials",
                  })}
                  aria-hidden={!this.state.open}
                >
                  <span className="icon-arrow-left"></span>
                </div>
              )}

              {/* Rendering the ToC */}
              {this.props.navigation && (
                <nav
                  ref={this.myRef}
                  className={`content-panel__navigation ${
                    this.state.displayed ? "displayed" : ""
                  } ${this.state.visible ? "visible" : ""} ${
                    this.state.dragging ? "dragging" : ""
                  }`}
                  onClick={this.closeNavigationByOverlay}
                  onKeyDown={this.handleNavigationKeyDown}
                >
                  <div
                    className="content-panel__navigation-content"
                    style={{
                      right: this.state.drag !== null ? -this.state.drag : null,
                    }}
                  >
                    <div className="content-panel__navigation-close">
                      <IconButton
                        icon="cross"
                        onClick={this.closeNavigation}
                        onKeyDown={this.handleNavigationCloseKeyDown}
                        aria-label={this.props.t("wcag.closeContentPanel", {
                          ns: "workspace",
                        })}
                      />
                    </div>
                    {this.props.navigation}
                  </div>
                </nav>
              )}

              {/* Rendering the content */}
              <div className={`content-panel__main-container loader-empty`}>
                {this.props.children}
              </div>
            </div>
          </div>

          {this.props.footer ? (
            <div className="content-panel__footer">{this.props.footer}</div>
          ) : null}
        </div>
      </main>
    );
  }
}

/**
 * ContentPanelProps
 */
interface ContentPanelItemProps {
  id?: string;
  dataMaterialId?: number;
  scrollMarginTopOffset?: number;
}

/**
 * ContentPanelItem
 */
export class ContentPanelItem extends React.Component<
  ContentPanelItemProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ContentPanelItemProps) {
    super(props);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div
        id={this.props.id}
        ref="component"
        className="content-panel__item"
        style={
          this.props.scrollMarginTopOffset && {
            scrollMarginTop: `${this.props.scrollMarginTopOffset}px`,
          }
        }
        data-material-id={this.props.dataMaterialId}
      >
        {this.props.children}
      </div>
    );
  }
  /**
   * getComponent
   * @returns HTMLElement
   */
  getComponent(): HTMLElement {
    return this.refs["component"] as HTMLElement;
  }
}
