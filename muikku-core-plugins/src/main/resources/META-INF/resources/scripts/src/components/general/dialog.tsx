import * as PropTypes from 'prop-types';
import Portal from './portal.tsx';
import * as React from 'react';

export default class Dialog extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    title: PropTypes.string.isRequired,
    classNameExtension: PropTypes.string.isRequired,
    content: PropTypes.any.isRequired,
    footer: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    onKeyStroke: PropTypes.func
  }
  constructor(props){
    super(props);
    
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    
    this.state = {
      visible: false
    }
  }
  onOverlayClick(close, e){
    if (e.target === e.currentTarget){
      close();
    }
  }
  onOpen(){
    setTimeout(()=>{
      this.setState({
        visible: true
      });
    }, 10);
    this.props.onOpen && this.props.onOpen();
  }
  beforeClose(DOMNode, removeFromDOM){
    this.setState({
      visible: false
    });
    setTimeout(removeFromDOM, 300);
  }
  render(){
    return (<Portal onKeyStroke={this.props.onKeyStroke} isOpen={this.props.isOpen}
        openByClickOn={this.props.children} onOpen={this.onOpen} onClose={this.props.onClose} beforeClose={this.beforeClose} closeOnEsc>
{(closePortal)=>{return <div className={`dialog ${this.props.classNameExtension} ${this.state.visible ? "visible" : ""}`} onClick={this.onOverlayClick.bind(this, closePortal)}>
  <div className="dialog-window">
      <div className="dialog-header">
        <div className="dialog-title">
            {this.props.title}
            <span className="dialog-close icon icon-close" onClick={closePortal}></span>
        </div>
      </div>
      <div className="dialog-content">
        {this.props.content(closePortal)}
      </div>
      <div className="dialog-footer">
        {this.props.footer && this.props.footer(closePortal)}
      </div>
  </div>
</div>}}
        </Portal>);
  }
}