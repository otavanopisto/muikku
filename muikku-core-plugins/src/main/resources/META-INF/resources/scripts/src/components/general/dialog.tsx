import Portal from './portal';
import * as React from 'react';
import Button from '~/components/general/button';
import {i18nType} from '~/reducers/base/i18n';
import '~/sass/elements/dialog.scss';
import '~/sass/elements/form-elements.scss';

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
  closeOnOverlayClick?: boolean;
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
    if(this.props.disableScroll == true ) {
      document.body.style.overflow = "hidden";
    }
    if (element.childNodes && element.childNodes[0]) {
      let el = element.childNodes[0].firstChild as HTMLElement;
      let marginOffset = 20;
      document.body.style.marginBottom = el.offsetHeight - marginOffset + "px";
    }
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
    let closeOnOverlayClick = true;
    if (typeof this.props.closeOnOverlayClick !== "undefined") {
      closeOnOverlayClick = !!this.props.closeOnOverlayClick;
    }
    return (<Portal onKeyStroke={this.props.onKeyStroke} isOpen={this.props.isOpen}
        openByClickOn={this.props.children} onOpen={this.onOpen} onClose={this.props.onClose} beforeClose={this.beforeClose} closeOnEsc>
        {(closePortal: ()=>any)=>{
          let modifiers:Array<string> = typeof this.props.modifier === "string" ? [this.props.modifier] : this.props.modifier;
          return <div
            className={`dialog ${(modifiers || []).map(s=>`dialog--${s}`).join(" ")} ${this.state.visible ? "dialog--visible" : ""}`}
            onClick={closeOnOverlayClick ? this.onOverlayClick.bind(this, closePortal) : null} >
            <div className={`dialog__window ${(modifiers || []).map(s=>`dialog__window--${s}`).join(" ")}`}>
              <div className={`dialog__header ${(modifiers || []).map(s=>`dialog__header--${s}`).join(" ")}`}>
                <div className="dialog__title">
                    {this.props.title}
                </div>
                <div className="dialog__close icon-cross" onClick={closePortal}></div>
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

interface DialogRowProps {
  modifiers?: string | Array<string>,
}

interface DialogRowState {
}

export class DialogRow extends React.Component<DialogRowProps, DialogRowState> {
  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return (
      <div className={`dialog__content-row ${this.props.modifiers ? modifiers.map( m => `dialog__content-row--${m}` ).join( " " ) : ""}`}>
        {this.props.children}
      </div>
    );

  }
}
