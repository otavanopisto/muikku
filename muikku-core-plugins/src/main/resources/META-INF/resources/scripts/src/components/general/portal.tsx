import * as PropTypes from 'prop-types';
import * as React from 'react';
import {unstable_renderSubtreeIntoContainer, unmountComponentAtNode, findDOMNode} from 'react-dom';

const KEYCODES = {
  ESCAPE: 27
};

export default class Portal extends React.Component {
  constructor() {
    super();
    this.state = { active: false };
    this.handleWrapperClick = this.handleWrapperClick.bind(this);
    this.closePortal = this.closePortal.bind(this);
    this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.portal = null;
    this.node = null;
    this.isUnmounted = false;
  }

  componentDidMount() {
    if (this.props.closeOnEsc) {
      document.addEventListener('keydown', this.handleKeydown);
    }

    if (this.props.closeOnOutsideClick) {
      document.addEventListener('mouseup', this.handleOutsideMouseClick);
      document.addEventListener('touchstart', this.handleOutsideMouseClick);
    }
    
    if (this.props.closeOnScroll) {
      document.addEventListener('scroll', this.handleOutsideMouseClick);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.active){
      this.renderPortal(nextProps);
    } else if (nextProps.isOpen === true && !this.props.isOpen && !this.state.active){
      this.openPortal(nextProps);
    } else if (nextProps.isOpen === false && this.state.active){
      this.closePortal();
    }
  }

  componentWillUnmount() {
    if (this.props.closeOnEsc) {
      document.removeEventListener('keydown', this.handleKeydown);
    }

    if (this.props.closeOnOutsideClick) {
      document.removeEventListener('mouseup', this.handleOutsideMouseClick);
      document.removeEventListener('touchstart', this.handleOutsideMouseClick);
    }
    
    if (this.props.closeOnScroll) {
      document.removeEventListener('scroll', this.handleOutsideMouseClick);
    }

    this.isUnmounted = true;
    this.closePortal();
  }

  handleWrapperClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.active) {
      return;
    }
    this.openPortal();
  }

  openPortal(props = this.props) {
    this.setState({ active: true });
    this.renderPortal(props, true);
  }

  closePortal() {
    const resetPortalState = () => {
      if (this.node) {
        unmountComponentAtNode(this.node);
        document.body.removeChild(this.node);
      }
      this.portal = null;
      this.node = null;
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

      this.props.onClose();
    }
  }

  handleOutsideMouseClick(e) {
    if (!this.state.active) {
      return;
    }

    const root = findDOMNode(this.portal);
    if (root.contains(e.target) || (e.button && e.button !== 0)) {
      return;
    }

    e.stopPropagation();
    this.closePortal();
  }

  handleKeydown(e) {
    if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
      this.closePortal();
    } else if (this.state.active){
      this.props.onKeyStroke && this.props.onKeyStroke(e.keyCode, this.closePortal);
    }
  }

  renderPortal(props, isOpening) {
    if (!this.node) {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);
    }

    this.portal = unstable_renderSubtreeIntoContainer(
      this,
      typeof props.children === "function" ? props.children(this.closePortal) : props.children,
      this.node,
      this.props.onUpdate
    );
    
    if (isOpening) {
      this.props.onOpen(this.node);
    }
  }

  render() {
    if (this.props.openByClickOn) {
      return React.cloneElement(this.props.openByClickOn, {
        onClick: this.handleWrapperClick
      });
    }
    return null;
  }
}

Portal.propTypes = {
  children: PropTypes.any.isRequired,
  openByClickOn: PropTypes.element,
  closeOnEsc: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  closeOnScroll: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  beforeClose: PropTypes.func,
  onUpdate: PropTypes.func,
  onKeyStroke: PropTypes.func,
  isOpen: PropTypes.bool
};

Portal.defaultProps = {
  onOpen: () => {},
  onClose: () => {},
  onUpdate: () => {}
};