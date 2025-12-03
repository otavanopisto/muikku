/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { v4 as uuidv4 } from "uuid";
import { Provider, ReactReduxContext } from "react-redux";
// Using RouterContext to fix the issue with the dropdown router items not working because they are rendered outside of the router context
import { __RouterContext as RouterContext } from "react-router";

/**
 * ItemType2
 */
export type ItemType2 = (closeDropdown: () => any) => any;

/**
 * DropdownItem
 */
interface DropdownItem {
  id: string;
  icon: string;
  text: string;
  onClick?: () => void;
}

/**
 * DropdownProps
 */
export interface DropdownProps {
  modifier?: string;
  children: React.ReactElement;
  /**
   * Using item list as content
   */
  items?: Array<React.ReactNode | ItemType2>;
  /**
   * Content to show
   */
  content?: any;
  /**
   * Open content when hovering. If set to false
   * opens popper when clicking element
   */
  openByHover?: boolean;
  /**
   * Click to show content. Extends hover opening with click also
   */
  openByHoverIsClickToo?: boolean;
  /**
   * Closes popper when clicking outside
   * @default true
   */
  closeOnOutsideClick?: boolean;
  /**
   * Closes popper onClick
   * @default false
   */
  closeOnClick?: boolean;
  /**
   * Scroll don't close popper. Popper keeps its position
   * if scrolled
   */
  persistent?: boolean;
  /**
   * Aligns popper by value horizontally
   */
  alignSelf?: "left" | "center" | "right";
  /**
   * Alings popper content by value vertically
   */
  alignSelfVertically?: "top" | "bottom";
  /**
   * Id for the tooltip so accessibility software can read it's content when used with aria-describedby attribute
   */
  tooltipId?: string;
  /**
   * onOpen
   */
  onOpen?: () => any;
  /**
   * onClose
   */
  onClose?: () => any;
  /**
   * onClick
   */
  onClick?: () => any;
}

const offsetValue = 5;

/**
 * DropdownState
 */
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

/**
 * Dropdown
 */
class Dropdown extends React.Component<DropdownProps, DropdownState> {
  private id: string;
  private isUnmounted = false;
  private originalPositionTop: number;

  // New ref declarations
  private activatorRef: React.RefObject<HTMLElement>;
  private portalRef: React.RefObject<Portal>;
  private dropdownRef: React.RefObject<HTMLDivElement>;
  private arrowRef: React.RefObject<HTMLSpanElement>;

  private hoverTimeout: NodeJS.Timeout | null = null;

  static defaultProps = {
    closeOnOutsideClick: true,
  };

  /**
   * constructor
   * @param props props
   */
  constructor(props: DropdownProps) {
    super(props);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    this.close = this.close.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onItemKeyDown = this.onItemKeyDown.bind(this);
    this.id = "dropdown-" + uuidv4();

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

    // Initialize refs
    this.activatorRef = React.createRef();
    this.portalRef = React.createRef();
    this.dropdownRef = React.createRef();
    this.arrowRef = React.createRef();
  }

  /**
   * handleOutsideClick
   * @param event event
   */
  handleOutsideClick = (event: MouseEvent) => {
    if (
      this.dropdownRef.current &&
      !this.dropdownRef.current.contains(event.target as Node)
    ) {
      this.close();
    }
  };

  /**
   * componentDidMount
   */
  componentDidMount(): void {
    this.props.persistent &&
      window.addEventListener("scroll", this.handleScroll);

    if (this.props.closeOnOutsideClick) {
      document.addEventListener("mousedown", this.handleOutsideClick);
    }

    let element = this.activatorRef.current;
    if (!(element instanceof HTMLElement)) {
      element = findDOMNode(element) as HTMLElement;
    }

    if (element) {
      element.addEventListener("keydown", this.handleActivatorKeyDown as any);
    }
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this.isUnmounted = true;
    this.props.persistent &&
      window.removeEventListener("scroll", this.handleScroll);

    if (this.props.closeOnOutsideClick) {
      document.removeEventListener("mousedown", this.handleOutsideClick);
    }

    let element = this.activatorRef.current;
    if (!(element instanceof HTMLElement)) {
      element = findDOMNode(element) as HTMLElement;
    }

    if (element) {
      element.removeEventListener(
        "keydown",
        this.handleActivatorKeyDown as any
      );
    }

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  }

  /**
   * handleScroll
   * @param event event
   */
  handleScroll = (event: WheelEvent) => {
    if (this.isUnmounted) {
      return;
    }

    let activator = this.activatorRef.current;
    if (!(activator instanceof HTMLElement)) {
      activator = findDOMNode(activator) as HTMLElement;
    }

    const $target = $(activator);
    const $dropdown = $(this.dropdownRef.current);
    const position = activator.getBoundingClientRect();
    const windowHeight = $(window).height();
    const spaceLeftInTop = position.top;
    const spaceLeftInBottom = windowHeight - position.top - position.height;
    const notEnoughSpaceInBottom =
      spaceLeftInBottom < $dropdown.outerHeight() + offsetValue;

    const notEnoughSpaceInTop =
      spaceLeftInTop < $dropdown.outerHeight() + offsetValue;

    let top = null;
    let arrowTop = null;
    let reverseArrow = false;

    if (notEnoughSpaceInBottom) {
      top = position.top - offsetValue - $dropdown.outerHeight();
    } else {
      top = position.top + $target.outerHeight() + offsetValue;
    }

    switch (this.props.alignSelfVertically) {
      case "top":
        top = position.top - offsetValue - $dropdown.outerHeight();
        arrowTop = $dropdown.outerHeight();
        reverseArrow = true;
        if (notEnoughSpaceInTop) {
          top = position.top + $target.outerHeight() + offsetValue;
          arrowTop = null;
          reverseArrow = false;
        }
        break;

      case "bottom":
        top = position.top + $target.outerHeight() + offsetValue;
        if (notEnoughSpaceInBottom) {
          top = position.top - offsetValue - $dropdown.outerHeight();
          arrowTop = $dropdown.outerHeight();
          reverseArrow = true;
        }
        break;
      default:
        top = position.top + $target.outerHeight() + offsetValue;
        if (notEnoughSpaceInBottom) {
          top = position.top - offsetValue - $dropdown.outerHeight();
          arrowTop = $dropdown.outerHeight();
          reverseArrow = true;
        }
        break;
    }

    this.originalPositionTop = window.scrollY;

    const calculation = top - (this.originalPositionTop - window.scrollY);

    this.setState(
      {
        top: calculation,
        arrowTop,
        reverseArrow,
      },
      this.props.onOpen
    );
  };

  /**
   * onOpen
   */
  onOpen() {
    if (this.isUnmounted) {
      return;
    }

    let activator = this.activatorRef.current;
    if (!(activator instanceof HTMLElement)) {
      activator = findDOMNode(activator) as HTMLElement;
    }

    const $target = $(activator);
    const $arrow = $(this.arrowRef.current);
    const $dropdown = $(this.dropdownRef.current);
    const position = activator.getBoundingClientRect();
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    const moreSpaceInTheLeftSide = windowWidth - position.left < position.left;
    const targetIsWiderThanDropdown =
      $target.outerWidth() > $dropdown.outerWidth();
    const spaceLeftInTop = position.top;
    const spaceLeftInBottom = windowHeight - position.top - position.height;
    const notEnoughSpaceInBottom =
      spaceLeftInBottom < $dropdown.outerHeight() + offsetValue;

    const notEnoughSpaceInTop =
      spaceLeftInTop < $dropdown.outerHeight() + offsetValue;

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
    let arrowLeft = null;
    let arrowRight = null;
    let arrowTop = null;
    let reverseArrow = false;

    switch (this.props.alignSelfVertically) {
      case "top":
        top = position.top - offsetValue - $dropdown.outerHeight();
        arrowTop = $dropdown.outerHeight();
        reverseArrow = true;

        if (notEnoughSpaceInTop) {
          top = position.top + $target.outerHeight() + offsetValue;
          arrowTop = null;
          reverseArrow = false;
        }
        break;

      case "bottom":
        top = position.top + $target.outerHeight() + offsetValue;
        if (notEnoughSpaceInBottom) {
          top = position.top - offsetValue - $dropdown.outerHeight();
          arrowTop = $dropdown.outerHeight();
          reverseArrow = true;
        }
        break;
      default:
        top = position.top + $target.outerHeight() + offsetValue;
        if (notEnoughSpaceInBottom) {
          top = position.top - offsetValue - $dropdown.outerHeight();
          arrowTop = $dropdown.outerHeight();
          reverseArrow = true;
        }
        break;
    }

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

  /**
   * onClose
   */
  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  /**
   * beforeClose
   * @param DOMNode d
   * @param removeFromDOM r
   */
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

  /**
   * close
   */
  close() {
    this.portalRef.current?.closePortal();
  }

  /**
   * onKeyDown
   * @param e e
   */
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

  /**
   * onItemKeyDown
   * @param e e
   */
  onItemKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Tab") {
      e.stopPropagation();
      e.preventDefault();
    }

    if (e.key === "Tab") {
      let element = this.activatorRef.current;
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

  /**
   * focusIndex
   * @param n n
   */
  focusIndex(n: number) {
    const id = this.id + "-item-" + n;
    let element = document.querySelector("#" + id) as HTMLElement;
    if (n === -1 && !element) {
      element = this.activatorRef.current;
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

  /**
   * handleActivatorClick
   * @param event event
   */
  handleActivatorClick = (event: React.MouseEvent) => {
    if (this.state.visible) {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    }
  };

  /**
   * handleActivatorKeyDown
   * @param event event
   */
  handleActivatorKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && this.state.visible) {
      event.preventDefault();
      this.close();
    }
  };

  /**
   * handleMouseEnter
   */
  handleMouseEnter = () => {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    if (!this.state.visible) {
      this.portalRef.current?.openPortal();
    }
  };

  /**
   * handleMouseLeave
   */
  handleMouseLeave = () => {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.hoverTimeout = setTimeout(() => {
      if (this.state.visible) {
        this.close();
      }
    }, 150); // Small delay to prevent flickering when moving between elements
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { children, openByHover } = this.props;

    let elementCloned = children;

    if (openByHover) {
      const childProps = {
        ref: this.activatorRef,
        // eslint-disable-next-line jsdoc/require-jsdoc
        onClick: (e: React.MouseEvent) => {
          this.handleActivatorClick(e);
          // Preserve the original onClick handler from the child
          if (children.props.onClick) {
            children.props.onClick(e);
          }
        },
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        id: this.id + "-button",
        role: "combobox",
        "aria-autocomplete": "list",
        "aria-owns": this.id + "-menu",
        "aria-haspopup": true,
        "aria-expanded": this.state.visible,
      };

      elementCloned = React.cloneElement(children, childProps);
    } else {
      elementCloned = React.cloneElement(children as React.ReactElement, {
        ref: this.activatorRef,
        id: this.id + "-button",
        role: "combobox",
        "aria-autocomplete": "list",
        "aria-owns": this.id + "-menu",
        "aria-haspopup": true,
        "aria-expanded": this.state.visible,
      });
    }

    const portalProps: any = {};
    if (!openByHover) {
      portalProps.openByClickOn = elementCloned;
    } else {
      if (this.props.onClick) {
        elementCloned = React.cloneElement(children as any, {
          ref: this.activatorRef,
          // eslint-disable-next-line jsdoc/require-jsdoc
          onClick: (e: React.MouseEvent) => {
            if (this.props.onClick) this.props.onClick();
          },
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
    portalProps.closeOnOutsideClick = this.props.closeOnOutsideClick;
    portalProps.closeOnScroll = !this.props.persistent;
    portalProps.closeOnClick = this.props.closeOnClick;

    // All the context consumers and providers are needed to fix the issue with the items rendered outside of the different providers
    // because portal.
    return (
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <RouterContext.Consumer>
            {(routerContext) => (
              <Portal
                ref={this.portalRef}
                {...portalProps}
                onOpen={this.onOpen}
                onClose={this.onClose}
                onWrapperKeyDown={this.onKeyDown}
                beforeClose={this.beforeClose}
                closeOnOutsideClick={false} // Disable Portal's built-in outside click handling
              >
                <Provider store={store}>
                  <RouterContext.Provider value={routerContext}>
                    <div
                      ref={this.dropdownRef}
                      id={this.id + "-menu"}
                      style={{
                        position: "fixed",
                        top: this.state.top,
                        left: this.state.left,
                        width: this.state.forcedWidth,
                      }}
                      className={`dropdown ${
                        this.props.modifier
                          ? "dropdown--" + this.props.modifier
                          : ""
                      } ${this.state.visible ? "visible" : ""}`}
                    >
                      <span
                        className="dropdown__arrow"
                        ref={this.arrowRef}
                        style={{
                          left: this.state.arrowLeft,
                          right: this.state.arrowRight,
                          top: this.state.arrowTop,
                          transform: this.state.reverseArrow
                            ? "scaleY(-1)"
                            : "",
                        }}
                      ></span>
                      {(this.props.content || this.props.items) && (
                        <div
                          className="dropdown__container"
                          id={this.props.tooltipId}
                        >
                          {this.props.content ? this.props.content : null}
                          {this.props.items
                            ? this.props.items.map((item, index) => {
                                const itemContent =
                                  typeof item === "function"
                                    ? item(this.close) // Pass the close function to the item renderer
                                    : item;

                                return (
                                  <div
                                    className="dropdown__container-item"
                                    key={index}
                                  >
                                    {React.cloneElement(
                                      itemContent as React.ReactElement,
                                      {
                                        id: this.id + "-item-" + index,
                                        onKeyDown: this.onItemKeyDown,
                                      }
                                    )}
                                  </div>
                                );
                              })
                            : null}
                        </div>
                      )}
                    </div>
                  </RouterContext.Provider>
                </Provider>
              </Portal>
            )}
          </RouterContext.Consumer>
        )}
      </ReactReduxContext.Consumer>
    );
  }
}

export default Dropdown;
