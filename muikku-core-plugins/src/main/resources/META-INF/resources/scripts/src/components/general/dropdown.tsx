/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-string-refs */

/* eslint-disable @typescript-eslint/ban-types */

/**
 * Component needs refactoring related to how it handles refs because
 * current ref system it is using has been deprecated and should be change
 * to use new way how React handles those.
 *
 * Also using findDOMNode has been deprecated and doesn't work with functional
 * component. Should be refactored also
 */

import Portal from "./portal";
import * as React from "react";
import { findDOMNode } from "react-dom";
import $ from "~/lib/jquery";
import "~/sass/elements/dropdown.scss";
import * as uuid from "uuid";

type itemType2 = (closeDropdown: () => any) => any;

interface DropdownProps {
  modifier?: string;
  children?: React.ReactNode;
  items?: Array<React.ReactNode | itemType2>;
  content?: any;
  openByHover?: boolean;
  openByHoverIsClickToo?: boolean;
  persistent?: boolean;
  onOpen?: () => any;
  onClose?: () => any;
  onClick?: () => any;
  alignSelf?: "left" | "center" | "right";
}

interface DropdownState {
  top: number | null;
  left: number | null;
  arrowLeft: number | null;
  arrowRight: number | null;
  arrowTop: number | null;
  reverseArrow: boolean;
  forcedWidth: number;
  visible: boolean;
}

export default class Dropdown extends React.Component<
  DropdownProps,
  DropdownState
> {
  private id: string;
  private isUnmounted = false;
  constructor(props: DropdownProps) {
    super(props);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    this.close = this.close.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onItemKeyDown = this.onItemKeyDown.bind(this);
    this.id = "dropdown-" + uuid.v4();

    this.state = {
      top: null,
      left: null,
      arrowLeft: null,
      arrowRight: null,
      arrowTop: null,
      reverseArrow: false,
      forcedWidth: null,
      visible: false,
    };
  }
  onOpen() {
    if (this.isUnmounted) {
      return;
    }

    let activator: any = this.refs["activator"];
    if (!(activator instanceof HTMLElement)) {
      activator = findDOMNode(activator);
    }

    const $target = $(activator);
    const $arrow = $(this.refs["arrow"]);
    const $dropdown = $(this.refs["dropdown"]);

    const position = activator.getBoundingClientRect();
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    const moreSpaceInTheLeftSide = windowWidth - position.left < position.left;
    const targetIsWiderThanDropdown =
      $target.outerWidth() > $dropdown.outerWidth();
    const spaceLeftInBottom = windowHeight - position.top - position.height;
    const notEnoughSpaceInBottom =
      spaceLeftInBottom < $dropdown.outerHeight() + 5;

    let left = null;
    if (this.props.alignSelf === "left") {
      left = position.left;
    } else if (this.props.alignSelf === "center") {
      left =
        position.left - $dropdown.outerWidth() / 2 + $target.outerWidth() / 2;
    } else if (this.props.alignSelf === "right") {
      left = position.left - $dropdown.outerWidth() + $target.outerWidth();
    } else {
      if (targetIsWiderThanDropdown) {
        left =
          position.left + $target.outerWidth() / 2 - $dropdown.outerWidth() / 2;
      } else if (moreSpaceInTheLeftSide) {
        left = position.left - $dropdown.outerWidth() + $target.outerWidth();
      } else {
        left = position.left;
      }
    }

    let top = null;
    if (notEnoughSpaceInBottom) {
      top = position.top - 5 - $dropdown.outerHeight();
    } else {
      top = position.top + $target.outerHeight() + 5;
    }

    let arrowLeft = null;
    let arrowRight = null;
    let arrowTop = null;
    let reverseArrow = false;

    if (this.props.alignSelf === "left") {
      arrowLeft = $target.outerWidth() / 2 - $arrow.outerWidth() / 2;
    } else if (this.props.alignSelf === "center") {
      arrowLeft = $dropdown.outerWidth() / 2 - $arrow.outerWidth() / 2;
    } else if (this.props.alignSelf === "right") {
      arrowRight = $target.outerWidth() / 2 - $arrow.outerWidth() / 2;
    } else {
      if (targetIsWiderThanDropdown) {
        arrowLeft = $dropdown.outerWidth() / 2 - $arrow.outerWidth() / 2;
      } else if (moreSpaceInTheLeftSide) {
        arrowRight = $target.outerWidth() / 2 - $arrow.outerWidth() / 2;
      } else {
        arrowLeft = $target.outerWidth() / 2 - $arrow.outerWidth() / 2;
      }
    }

    if (notEnoughSpaceInBottom) {
      arrowTop = $dropdown.outerHeight();
      reverseArrow = true;
    }

    let forcedWidth: number = null;
    if (typeof left === "number" && left < 0) {
      forcedWidth = $dropdown.outerWidth() + left;
      left = 0;
    }

    this.setState(
      {
        top,
        left,
        arrowLeft,
        arrowRight,
        arrowTop,
        reverseArrow,
        forcedWidth,
        visible: true,
      },
      this.props.onOpen
    );
  }
  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
  beforeClose(DOMNode: HTMLElement, removeFromDOM: Function) {
    if (this.isUnmounted) {
      return;
    }

    this.setState({
      visible: false,
    });
    setTimeout(() => {
      removeFromDOM();
      setTimeout(() => {
        if (this.isUnmounted) {
          return;
        }
        this.setState({
          forcedWidth: null,
        });
      }, 10);
    }, 300);
  }
  close() {
    (this.refs["portal"] as Portal).closePortal();
  }
  componentWillUnmount() {
    this.isUnmounted = true;
  }
  onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Tab" || !this.props.items) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    if (e.key === "ArrowDown") {
      this.focusIndex(0);
    }
  }
  onItemKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Tab") {
      e.stopPropagation();
      e.preventDefault();
    }

    if (e.key === "Tab") {
      let element = this.refs["activator"] as any;
      if (!(element instanceof HTMLElement)) {
        element = findDOMNode(element) as any;
      }

      element.focus();
      const keyboardEvent = new KeyboardEvent("keydown", {
        altKey: false,
        bubbles: true,
        cancelable: true,
        code: "9",
        ctrlKey: false,
        shiftKey: false,
        metaKey: false,
        key: "Tab",
      });
      document.dispatchEvent(keyboardEvent);
      return;
    } else if (e.key === " ") {
      (e.currentTarget as HTMLElement).click();
      return;
    } else if (e.key === "Enter") {
      (e.currentTarget as HTMLElement).click();
      return;
    }

    const index = parseInt(e.currentTarget.id.split("-item-")[1], 10) || 0;

    if (e.key === "ArrowUp") {
      this.focusIndex(index - 1);
    } else if (e.key === "ArrowDown") {
      this.focusIndex(index + 1);
    }
  }
  focusIndex(n: number) {
    const id = this.id + "-item-" + n;
    let element = document.querySelector("#" + id) as HTMLElement;
    if (n === -1 && !element) {
      element = this.refs["activator"] as any;
      if (!(element instanceof HTMLElement)) {
        element = findDOMNode(element) as any;
      }
    }

    const inputInElement = element && element.querySelector("input");
    if (inputInElement) {
      element = inputInElement;
    }

    if (element) {
      element.focus();
    }
  }
  render() {
    let elementCloned: React.ReactElement<any> = React.cloneElement(
      this.props.children as any,
      { ref: "activator" }
    );
    const portalProps: any = {};
    if (!this.props.openByHover) {
      portalProps.openByClickOn = elementCloned;
    } else {
      if (this.props.onClick) {
        elementCloned = React.cloneElement(this.props.children as any, {
          ref: "activator",
          onClick: this.props.onClick,
          id: this.id + "-button",
          role: "combobox",
          "aria-autocomplete": "list",
          "aria-owns": this.id + "-menu",
          "aria-haspopup": true,
          "aria-expanded": this.state.visible,
        });
      }
      portalProps.openByHoverOn = elementCloned;
      portalProps.openByHoverIsClickToo = this.props.openByHoverIsClickToo;
    }

    portalProps.closeOnEsc = true;
    portalProps.closeOnOutsideClick = true;
    portalProps.closeOnScroll = !this.props.persistent;

    return (
      <Portal
        ref="portal"
        {...portalProps}
        onOpen={this.onOpen}
        onClose={this.onClose}
        onWrapperKeyDown={this.onKeyDown}
        beforeClose={this.beforeClose}
      >
        <div
          ref="dropdown"
          id={this.id + "-menu"}
          style={{
            position: "fixed",
            top: this.state.top,
            left: this.state.left,
            width: this.state.forcedWidth,
          }}
          className={`dropdown ${
            this.props.modifier ? "dropdown--" + this.props.modifier : ""
          } ${this.state.visible ? "visible" : ""}`}
        >
          <span
            className="dropdown__arrow"
            ref="arrow"
            style={{
              left: this.state.arrowLeft,
              right: this.state.arrowRight,
              top: this.state.arrowTop,
              transform: this.state.reverseArrow ? "scaleY(-1)" : null,
            }}
          ></span>
          <div className="dropdown__container">
            {this.props.content}
            {this.props.items &&
              this.props.items.map((item, index) => {
                const element = React.cloneElement(
                  typeof item === "function" ? item(this.close) : item,
                  {
                    id: this.id + "-item-" + index,
                    onKeyDown: this.onItemKeyDown,
                  }
                );

                return (
                  <div className="dropdown__container-item" key={index}>
                    {element}
                  </div>
                );
              })}
          </div>
        </div>
      </Portal>
    );
  }
}
