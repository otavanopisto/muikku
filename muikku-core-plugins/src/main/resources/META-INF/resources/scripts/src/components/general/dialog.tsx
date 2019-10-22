import Portal from './portal';
import * as React from 'react';

import '~/sass/elements/dialog.scss';

interface DialogProps {
  children?: React.ReactElement<any>,
  title: string,
  modifier?: string | Array<string>,
  content: any,
  disableScroll? : boolean,
  footer?: (closePortal: ()=>any)=>any,
  onOpen?: (e?: HTMLElement)=>any,
  onClose?: ()=>any,
  isOpen?:boolean,
  onKeyStroke?(keyCode: number, closePortal: ()=>any): any,
}

interface DialogState {
  visible: boolean,
}

export default class Dialog extends React.Component<DialogProps, DialogState> {
  private oldOverflow:string;

  constructor(props: DialogProps){
    super(props);

    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    this.oldOverflow = null;
    this.state = {visible: false}
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
    this.props.onOpen && this.props.onOpen(element);
    let el = element.childNodes[0].firstChild as HTMLElement;
    let marginOffset = 20;
    if(this.props.disableScroll == true ) {
      document.body.style.overflow = "hidden";
    }
    document.body.style.marginBottom = el.offsetHeight - marginOffset + "px";
  }

  beforeClose(DOMNode: HTMLElement, removeFromDOM: ()=>any){
    this.setState({
      visible: false
    });
    if(this.props.disableScroll == true ) {
      document.body.style.overflow = "scroll";
    }
    document.body.style.marginBottom = "0";
    setTimeout(removeFromDOM, 300);
  }

  render(){
    return (<Portal onKeyStroke={this.props.onKeyStroke} isOpen={this.props.isOpen}
        openByClickOn={this.props.children} onOpen={this.onOpen} onClose={this.props.onClose} beforeClose={this.beforeClose} closeOnEsc>
        {(closePortal: ()=>any)=>{
          let modifiers:Array<string> = typeof this.props.modifier === "string" ? [this.props.modifier] : this.props.modifier;
          return <div className={`dialog ${(modifiers || []).map(s=>`dialog--${s}`).join(" ")} ${this.state.visible ? "dialog--visible" : ""}`} onClick={this.onOverlayClick.bind(this, closePortal)}>
            <div className={`dialog__window ${(modifiers || []).map(s=>`dialog__window--${s}`).join(" ")}`}>
              <div className={`dialog__header ${(modifiers || []).map(s=>`dialog__header--${s}`).join(" ")}`}>
                <div className="dialog__title">
                    {this.props.title}
                </div>
                <div className="dialog__close icon-close" onClick={closePortal}></div>
              </div>
              <div className="dialog__content">
                {this.props.content(closePortal)}
              </div>
              {this.props.footer?
              <div className="dialog__footer">
                {this.props.footer && this.props.footer(closePortal)}
              </div>
              : null}
          </div>
        </div>}}
    </Portal>);
  }
}