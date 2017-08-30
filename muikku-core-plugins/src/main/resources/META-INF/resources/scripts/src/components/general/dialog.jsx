import PropTypes from 'prop-types';
import Portal from './portal.jsx';
import React from 'react';

export default class Dialog extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    classNameExtension: PropTypes.string.isRequired,
    content: PropTypes.element.isRequired,
    footer: PropTypes.func.isRequired
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
  }
  beforeClose(DOMNode, removeFromDOM){
    this.setState({
      visible: false
    });
    setTimeout(removeFromDOM, 300);
  }
  render(){
    return (<Portal openByClickOn={this.props.children} onOpen={this.onOpen} beforeClose={this.beforeClose} closeOnEsc>
{(closePortal)=>{return <div className={`dialog ${this.props.classNameExtension}-dialog ${this.state.visible ? "visible" : ""}`} onClick={this.onOverlayClick.bind(this, closePortal)}>
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
        {this.props.footer(closePortal)}
      </div>
  </div>
</div>}}
        </Portal>);
  }
}