import Portal from './portal.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';

export default class Dropdown extends React.Component {
  static propTypes = {
    classNameExtension: PropTypes.string.isRequired,
    classNameSuffix: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.func])).isRequired
  }
  constructor(props){
    super(props);
    this.onOpen = this.onOpen.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    this.close = this.close.bind(this);
    
    this.state = {
      top: null,
      left: null,
      arrowLeft: null,
      arrowRight: null,
      visible: false
    }
  }
  onOpen(DOMNode){
    let activator = this.refs.activator;
    if (!(activator instanceof HTMLElement)){
      activator = findDOMNode(activator);
    }
    
    let $target = $(activator);
    let $arrow = $(this.refs.arrow);
    let $dropdown = $(this.refs.dropdown);
      
    let position = $target.offset();
    let windowWidth = $(window).width();
    let moreSpaceInTheLeftSide = (windowWidth - position.left) < position.left;
    
    let left = null;
    if (moreSpaceInTheLeftSide){
      left = position.left - $dropdown.outerWidth() + $target.outerWidth();
    } else {
      left = position.left;
    }
    let top = position.top + $target.outerHeight() + 5;
    
    let arrowLeft = null;
    let arrowRight = null;
    if (moreSpaceInTheLeftSide){
      arrowRight = ($target.outerWidth() / 2) + ($arrow.width()/2);
    } else {
      arrowLeft = ($target.outerWidth() / 2) + ($arrow.width()/2);
    }
    
    this.setState({top, left, arrowLeft, arrowRight, visible: true});
  }
  beforeClose(DOMNode, removeFromDOM){
    this.setState({
      visible: false
    });
    setTimeout(removeFromDOM, 300);
  }
  close(){
    this.refs.portal.closePortal();
  }
  render(){
    return <Portal ref="portal" openByClickOn={React.cloneElement(this.props.children, { ref: "activator" })}
      closeOnEsc closeOnOutsideClick closeOnScroll onOpen={this.onOpen} beforeClose={this.beforeClose}>
      <div ref="dropdown"
        style={{
          top: this.state.top,
          left: this.state.left
        }}
        className={`${this.props.classNameExtension} dropdown ${this.props.classNameExtension}-dropdown-${this.props.classNameSuffix} ${this.state.visible ? "visible" : ""}`}>
        <span className="arrow" ref="arrow" style={{left: this.state.arrowLeft, right: this.state.arrowRight}}></span>
        <div className="dropdown-container">
          {this.props.items.map((item, index)=>{
            let element = typeof item === "function" ? item(this.close) : item;
            return (<div className="dropdown-item" key={index}>
              {element}
            </div>);
          })}
        </div>
      </div>
    </Portal>
  }
}