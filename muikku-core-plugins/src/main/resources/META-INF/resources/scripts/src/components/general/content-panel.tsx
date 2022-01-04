import * as React from "react";
import $ from "~/lib/jquery";

import "~/sass/elements/content-panel.scss";
import "~/sass/elements/loaders.scss";

interface ContentPanelProps {
  modifier: string;
  title?: React.ReactElement<any> | string;
  navigation?: React.ReactElement<any>;
  aside?: React.ReactElement<any>;
  onOpenNavigation?: () => any;
}

interface ContentPanelState {
  displayed: boolean;
  visible: boolean;
  dragging: boolean;
  drag: number;
  open: boolean;
}

function checkLinkClicked(target: HTMLElement): boolean {
  return (
    target.nodeName.toLowerCase() === "a" ||
    (target.parentElement ? checkLinkClicked(target.parentElement) : false)
  );
}

export default class ContentPanel extends React.Component<
  ContentPanelProps,
  ContentPanelState
> {
  private touchCordX: number;
  private touchCordY: number;
  private touchMovementX: number;
  private preventXMovement: boolean;
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
      open: false
    };
  }

  onTouchStart(e: React.TouchEvent<any>) {
    this.setState({ dragging: true });
    this.touchCordX = e.changedTouches[0].pageX;
    this.touchCordY = e.changedTouches[0].pageY;
    this.touchMovementX = 0;
    this.preventXMovement = false;
    e.preventDefault();
  }
  onTouchMove(e: React.TouchEvent<any>) {
    let diffX = e.changedTouches[0].pageX - this.touchCordX;
    let diffY = e.changedTouches[0].pageY - this.touchCordY;
    let absoluteDifferenceX = Math.abs(diffX - this.state.drag);
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
    e.preventDefault();
  }
  onTouchEnd(e: React.TouchEvent<any>) {
    let width = (
      document.querySelector(
        ".content-panel__navigation-content"
      ) as HTMLElement
    ).offsetWidth;
    let diff = this.state.drag;
    let movement = this.touchMovementX;

    let menuHasSlidedEnoughForClosing = Math.abs(diff) >= width * 0.33;
    let youJustClickedTheOverlay =
      e.target === this.refs["menu-overlay"] && movement <= 5;
    let youJustClickedALink =
      checkLinkClicked(e.target as HTMLElement) && movement <= 5;

    this.setState({ dragging: false });
    setTimeout(() => {
      this.setState({ drag: null });
      if (
        menuHasSlidedEnoughForClosing ||
        youJustClickedTheOverlay ||
        youJustClickedALink
      ) {
        this.closeNavigation();
      }
    }, 10);
    e.preventDefault();
  }
  openNavigation() {
    this.setState({ displayed: true, open: true });
    setTimeout(() => {
      this.setState({ visible: true });
      this.props.onOpenNavigation && this.props.onOpenNavigation();
    }, 10);
    $(document.body).css({ overflow: "hidden" });
  }
  closeNavigationByOverlay(e: React.MouseEvent<any>) {
    let isOverlay = e.target === e.currentTarget;
    let isLink = checkLinkClicked(e.target as HTMLElement);
    if (!this.state.dragging && (isOverlay || isLink)) {
      this.closeNavigation();
    }
  }
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
                >
                  <span className="icon-arrow-left"></span>
                </div>
              )}

              {/* Rendering the ToC */}
              {this.props.navigation && (
                <nav
                  ref="menu-overlay"
                  className={`content-panel__navigation ${
                    this.state.displayed ? "displayed" : ""
                  } ${this.state.visible ? "visible" : ""} ${
                    this.state.dragging ? "dragging" : ""
                  }`}
                  onClick={this.closeNavigationByOverlay}
                  onTouchStart={this.onTouchStart}
                  onTouchMove={this.onTouchMove}
                  onTouchEnd={this.onTouchEnd}
                >
                  <div
                    className="content-panel__navigation-content"
                    style={{
                      right: this.state.drag !== null ? -this.state.drag : null
                    }}
                  >
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
        </div>
      </main>
    );
  }
}

export class ContentPanelItem extends React.Component<{}, {}> {
  render() {
    return (
      <div ref="component" className="content-panel__item">
        {this.props.children}
      </div>
    );
  }
  getComponent(): HTMLElement {
    return this.refs["component"] as HTMLElement;
  }
}
