import * as React from "react";
import {
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode,
  findDOMNode,
} from "react-dom";

const KEYCODES = {
  ESCAPE: 27,
};

interface PortalProps {
  children?: any;
  openByClickOn?: React.ReactElement<any>;
  openByHoverOn?: React.ReactElement<any>;
  openByHoverIsClickToo?: boolean;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnScroll?: boolean;
  onOpen?(e: HTMLElement): any;
  onClose?(): any;
  beforeClose?(e: HTMLElement, resetPortalState: () => any): any;
  onKeyStroke?(keyCode: number, closePortal: () => any): any;
  onWrapperKeyDown?(e: React.KeyboardEvent): any;
  isOpen?: boolean;
}

interface PortalState {
  active: boolean;
}

export default class Portal extends React.Component<PortalProps, PortalState> {
  private portal: any;
  private node: HTMLElement | null;
  private isUnmounted: boolean;
  private isClosing: boolean;

  constructor(props: PortalProps) {
    super(props);
    this.state = { active: false };
    this.handleWrapperClick = this.handleWrapperClick.bind(this);
    this.closePortal = this.closePortal.bind(this);
    this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleWrapperKeyDown = this.handleWrapperKeyDown.bind(this);
    this.portal = null;
    this.node = null;
    this.isUnmounted = false;
    this.isClosing = false;
  }

  componentDidMount() {
    if (this.props.closeOnEsc) {
      document.addEventListener("keydown", this.handleKeydown);
    }

    if (this.props.closeOnOutsideClick) {
      document.addEventListener("mouseup", this.handleOutsideMouseClick);
      document.addEventListener("touchstart", this.handleOutsideMouseClick);
    }

    if (this.props.closeOnScroll) {
      document.addEventListener("scroll", this.handleOutsideMouseClick);
    }

    if (this.props.isOpen === true) {
      this.openPortal();
    }
  }

  componentWillUpdate(nextProps: PortalProps, nextState: PortalState) {
    if (
      nextProps.isOpen === true &&
      !this.props.isOpen &&
      !this.state.active &&
      !this.isClosing
    ) {
      this.openPortal(nextProps);
    } else if (
      nextProps.isOpen === false &&
      this.state.active &&
      !this.isClosing
    ) {
      this.closePortal();
    } else if (nextState.active) {
      this.renderPortal(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.props.closeOnEsc) {
      document.removeEventListener("keydown", this.handleKeydown);
    }

    if (this.props.closeOnOutsideClick) {
      document.removeEventListener("mouseup", this.handleOutsideMouseClick);
      document.removeEventListener("touchstart", this.handleOutsideMouseClick);
    }

    if (this.props.closeOnScroll) {
      document.removeEventListener("scroll", this.handleOutsideMouseClick);
    }

    this.isUnmounted = true;
    this.closePortal();
  }

  handleWrapperClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.active) {
      return;
    }
    this.openPortal();
  }

  handleWrapperKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      if (this.state.active) {
        this.closePortal();
      } else {
        this.openPortal();
      }
    }

    if (e.key === "Tab" && this.state.active) {
      this.closePortal();
    }

    if (this.props.onWrapperKeyDown) {
      this.props.onWrapperKeyDown(e);
    }
  }

  openPortal(props: PortalProps = this.props) {
    this.setState({ active: true });
    this.renderPortal(props, true);
  }

  closePortal() {
    this.isClosing = true;

    const resetPortalState = () => {
      if (this.node) {
        unmountComponentAtNode(this.node);
        document.body.removeChild(this.node);
      }
      this.portal = null;
      this.node = null;
      this.isClosing = false;

      if (!this.isUnmounted) {
        this.setState({ active: false });
      }
    };

    if (this.state.active) {
      if (this.props.beforeClose) {
        this.props.beforeClose(this.node, resetPortalState);
      } else {
        resetPortalState();
      }

      this.props.onClose && this.props.onClose();
    }
  }

  handleOutsideMouseClick(e: Event) {
    if (!this.state.active) {
      return;
    }

    const root = findDOMNode(this.portal);
    if (root === null) {
      e.stopPropagation();
      this.closePortal();
    }
    const node: Node = e.target as Node;
    if (root.contains(node)) {
      return;
    }

    e.stopPropagation();
    this.closePortal();
  }

  handleKeydown(e: KeyboardEvent) {
    if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
      this.closePortal();
    } else if (this.state.active) {
      this.props.onKeyStroke &&
        this.props.onKeyStroke(e.keyCode, this.closePortal);
    }
  }

  renderPortal(props: PortalProps, isOpening = false) {
    if (!this.node) {
      this.node = document.createElement("div");
      document.body.appendChild(this.node);
    }

    this.portal = unstable_renderSubtreeIntoContainer(
      this,
      typeof props.children === "function"
        ? props.children(this.closePortal)
        : props.children,
      this.node,
    );

    if (isOpening) {
      this.props.onOpen && this.props.onOpen(this.node);
    }
  }

  render() {
    if (this.props.openByClickOn) {
      return React.cloneElement(this.props.openByClickOn, {
        onClick: this.handleWrapperClick,
        onKeyDown: this.handleWrapperKeyDown,
      });
    } else if (this.props.openByHoverOn && this.props.openByHoverIsClickToo) {
      return React.cloneElement(this.props.openByHoverOn, {
        onMouseEnter: this.handleWrapperClick,
        onMouseLeave: this.handleOutsideMouseClick,
        onClick: this.handleWrapperClick,
        onFocus: this.handleWrapperClick,
        onBlur: this.handleOutsideMouseClick,
        onKeyDown: this.handleWrapperKeyDown,
      });
    } else if (this.props.openByHoverOn) {
      return React.cloneElement(this.props.openByHoverOn, {
        onMouseEnter: this.handleWrapperClick,
        onMouseLeave: this.handleOutsideMouseClick,
        onFocus: this.handleWrapperClick,
        onBlur: this.handleOutsideMouseClick,
      });
    }
    return null;
  }
}
