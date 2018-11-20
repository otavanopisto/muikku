import Portal from './portal';
import * as React from 'react';
import {findDOMNode} from 'react-dom';
import $ from "~/lib/jquery";

import '~/sass/elements/dropdown.scss';

type itemType2 = (closeDropdown: ()=>any)=>any

interface DropdownProps {
  modifier: string,
  children?: React.ReactElement<any>,
  items: Array<(React.ReactElement<any> | itemType2)>,
  persistent?:boolean,
  onClose?: ()=>any
}

interface DropdownState {
  top: number | null,
  left: number | null,
  arrowLeft: number | null,
  arrowRight: number | null,
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
      visible: false
    }
  }
  onOpen(DOMNode: HTMLElement){
    let activator = this.refs["activator"];
    if (!(activator instanceof HTMLElement)){
      activator = findDOMNode(activator);
    }
    
    let $target = $(activator);
    let $arrow = $(this.refs["arrow"]);
    let $dropdown = $(this.refs["dropdown"]);
      
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
      arrowRight = ($target.outerWidth() / 2) - ($arrow.outerWidth()/2);
    } else {
      arrowLeft = ($target.outerWidth() / 2) - ($arrow.outerWidth()/2);
    }
    
    this.setState({top, left, arrowLeft, arrowRight, visible: true});
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
    let elementCloned : React.ReactElement<any> = React.cloneElement(this.props.children, { ref: "activator" });
    return <Portal ref="portal" openByClickOn={elementCloned} onClose={this.props.onClose}
      closeOnEsc closeOnOutsideClick closeOnScroll={!this.props.persistent} onOpen={this.onOpen} beforeClose={this.beforeClose}>
      <div ref="dropdown"
        style={{
          top: this.state.top,
          left: this.state.left
        }}
        className={`dropdown ${this.props.modifier ? 'dropdown--' + this.props.modifier : ''} ${this.state.visible ? "visible" : ""}`}>
        <span className="dropdown__arrow" ref="arrow" style={{left: this.state.arrowLeft, right: this.state.arrowRight}}></span>
        <div className="dropdown__container">
          {this.props.items.map((item, index)=>{
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