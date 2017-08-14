import PropTypes from 'prop-types';

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

  componentWillReceiveProps(newProps) {
    this.renderPortal(newProps);
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

    this.closePortal(true);
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

  closePortal(isUnmounted = false) {
    const resetPortalState = () => {
      if (this.node) {
        ReactDOM.unmountComponentAtNode(this.node);
        document.body.removeChild(this.node);
      }
      this.portal = null;
      this.node = null;
      if (isUnmounted !== true) {
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

    const root = ReactDOM.findDOMNode(this.portal);
    if (root.contains(e.target) || (e.button && e.button !== 0)) {
      return;
    }

    e.stopPropagation();
    this.closePortal();
  }

  handleKeydown(e) {
    if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
      this.closePortal();
    }
  }

  renderPortal(props, isOpening) {
    if (!this.node) {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);
    }

    let children = props.children;
    // https://gist.github.com/jimfb/d99e0678e9da715ccf6454961ef04d1b
    if (typeof props.children.type === 'function') {
      children = React.cloneElement(props.children, {
        closePortal: this.closePortal
      });
    }

    this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      children,
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
  children: PropTypes.element.isRequired,
  openByClickOn: PropTypes.element,
  closeOnEsc: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  closeOnScroll: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  beforeClose: PropTypes.func,
  onUpdate: PropTypes.func
};

Portal.defaultProps = {
  onOpen: () => {},
  onClose: () => {},
  onUpdate: () => {}
};