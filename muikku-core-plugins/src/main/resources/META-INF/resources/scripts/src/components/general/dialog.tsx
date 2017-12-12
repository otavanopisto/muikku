import Portal from './portal';
import * as React from 'react';

import '~/sass/elements/dialog.scss';

interface DialogProps {
  children?: React.ReactElement<any>,
  title: string,
  modifier: string,
  content: any,
  footer?: (closePortal: ()=>any)=>any,
  onOpen?: (e?: HTMLElement)=>any,
  onClose?: ()=>any,
  isOpen?:boolean,
  onKeyStroke?(keyCode: number, closePortal: ()=>any): any,
}

interface DialogState {
  visible: boolean
}

export default class Dialog extends React.Component<DialogProps, DialogState> {
  private oldOverflow:string;
  
  constructor(props: DialogProps){
    super(props);
    
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    
    this.oldOverflow = null;
    
    this.state = {
      visible: false
    }
  }
  onOverlayClick(close: ()=>any, e: Event){
    if (e.target === e.currentTarget){
      close();
    }
  }
  onOpen(element: HTMLElement){
    setTimeout(()=>{
      this.setState({
        visible: true
      });
    }, 10);
    this.oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    this.props.onOpen && this.props.onOpen(element);
  }
  beforeClose(DOMNode: HTMLElement, removeFromDOM: ()=>any){
    this.setState({
      visible: false
    });
    document.body.style.overflow = this.oldOverflow;
    setTimeout(removeFromDOM, 300);
  }
  render(){
    return (<Portal onKeyStroke={this.props.onKeyStroke} isOpen={this.props.isOpen}
        openByClickOn={this.props.children} onOpen={this.onOpen} onClose={this.props.onClose} beforeClose={this.beforeClose} closeOnEsc>
{(closePortal: ()=>any)=>{return <div className={`dialog dialog--${this.props.modifier} ${this.state.visible ? "dialog--visible" : ""}`} onClick={this.onOverlayClick.bind(this, closePortal)}>
  <div className="dialog__window">
      <div className="dialog__header">
        <div className="dialog__title">
            {this.props.title}
            <span className="dialog__close icon-close" onClick={closePortal}></span>
        </div>
      </div>
      <div className="dialog__content">
        {this.props.content(closePortal)}
      </div>
      <div className="dialog__footer">
        {this.props.footer && this.props.footer(closePortal)}
      </div>
  </div>
</div>}}
        </Portal>);
  }
}