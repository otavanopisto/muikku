import Portal from './portal';
import * as React from 'react';
import {findDOMNode} from 'react-dom';
import $ from "~/lib/jquery";

import '~/sass/elements/dropdown.scss';

type itemType2 = (closeDropdown: ()=>any)=>any

interface DropdownProps {
  modifier?: string,
  children?: React.ReactNode,
  items?: Array<(React.ReactNode | itemType2)>,
  content?: any,
  openByHover?: boolean,
  openByHoverIsClickToo?: boolean,
  persistent?:boolean,
  onOpen?: ()=>any,
  onClose?: ()=>any,
  onClick?: ()=>any
}

interface DropdownState {
  top: number | null,
  left: number | null,
  arrowLeft: number | null,
  arrowRight: number | null,
  arrowTop: number | null,
  reverseArrow: boolean,
  visible: boolean
}

export default class Dropdown extends React.Component<DropdownProps, DropdownState> {
  constructor(props: DropdownProps){
    super(props);
    this.onOpen = this.onOpen.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    this.close = this.close.bind(this);
    
    this.state = {
      top: null,
      left: null,
      arrowLeft: null,
      arrowRight: null,
      arrowTop: null,
      reverseArrow: false,
      visible: false
    }
  }
  onOpen(DOMNode: HTMLElement){
    let activator: any = this.refs["activator"];
    if (!(activator instanceof HTMLElement)){
      activator = findDOMNode(activator);
    }
    
    const $target = $(activator);
    const $arrow = $(this.refs["arrow"]);
    const $dropdown = $(this.refs["dropdown"]);
      
    const position = activator.getBoundingClientRect();
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    const moreSpaceInTheLeftSide = (windowWidth - position.left) < position.left;
    const targetIsWiderThanDropdown = $target.outerWidth() > $dropdown.outerWidth();
    const spaceLeftInBottom = windowHeight - position.top - position.height;
    const notEnoughSpaceInBottom = spaceLeftInBottom < $dropdown.outerHeight() + 5;
    
    let left = null;
    if (targetIsWiderThanDropdown) {
      left = position.left + $target.outerWidth()/2 - ($dropdown.outerWidth()/2);
    } else if (moreSpaceInTheLeftSide){
      left = position.left - $dropdown.outerWidth() + $target.outerWidth();
    } else {
      left = position.left;
    }
    let top = null;
    let bottom = null;
    if (notEnoughSpaceInBottom) {
      top = position.top - 5 - $dropdown.outerHeight();
    } else {
      top = position.top + $target.outerHeight() + 5;
    }
    
    let arrowLeft = null;
    let arrowRight = null;
    let arrowTop = null;
    let reverseArrow = false;
    if (targetIsWiderThanDropdown) {
      arrowLeft = ($dropdown.outerWidth() / 2) - ($arrow.outerWidth()/2);
    } else if (moreSpaceInTheLeftSide){
      arrowRight = ($target.outerWidth() / 2) - ($arrow.outerWidth()/2);
    } else {
      arrowLeft = ($target.outerWidth() / 2) - ($arrow.outerWidth()/2);
    }
    
    if (notEnoughSpaceInBottom) {
      arrowTop = $dropdown.outerHeight();
      reverseArrow = true;
    }
    
    this.setState({top, left, arrowLeft, arrowRight, arrowTop, reverseArrow, visible: true}, this.props.onOpen);
  }
  beforeClose(DOMNode : HTMLElement, removeFromDOM: Function){
    this.setState({
      visible: false
    });
    setTimeout(removeFromDOM, 300);
  }
  close(){
    (this.refs["portal"] as Portal).closePortal();
  }
  render(){
    let elementCloned : React.ReactElement<any> = React.cloneElement(this.props.children as any, { ref: "activator"});
    let portalProps:any = {};
    if (!this.props.openByHover){
      portalProps.openByClickOn = elementCloned;
    } else {
      if (this.props.onClick) {
        elementCloned = React.cloneElement(this.props.children as any, { ref: "activator", onClick: this.props.onClick });
      }
      portalProps.openByHoverOn = elementCloned;
      portalProps.openByHoverIsClickToo = this.props.openByHoverIsClickToo;
    }
    
    portalProps.closeOnEsc = true;
    portalProps.closeOnOutsideClick = true;
    portalProps.closeOnScroll = !this.props.persistent;
    portalProps.onClose = this.props.onClose;
    
    return <Portal ref="portal" {...portalProps} onOpen={this.onOpen} beforeClose={this.beforeClose}>
      <div ref="dropdown"
        style={{
          position: "fixed",
          top: this.state.top,
          left: this.state.left,
        }}
        className={`dropdown ${this.props.modifier ? 'dropdown--' + this.props.modifier : ''} ${this.state.visible ? "visible" : ""}`}>
        <span className="dropdown__arrow" ref="arrow"
         style={{
           left: this.state.arrowLeft,
           right: this.state.arrowRight,
           top: this.state.arrowTop,
           transform: this.state.reverseArrow ? "scaleY(-1)" : null,
         }}></span>
        <div className="dropdown__container">
          {this.props.content}
          {this.props.items && this.props.items.map((item, index)=>{
            let element = typeof item === "function" ? item(this.close) : item;
            return (<div className="dropdown__container-item" key={index}>
              {element}
            </div>);
          })}
        </div>
      </div>
    </Portal>
  }
}
