import Portal from './portal';
import * as React from 'react';

interface DialogProps {
  children?: React.ReactElement<any>,
  title: string,
  classNameExtension: string,
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
  constructor(props: DialogProps){
    super(props);
    
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    
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
    this.props.onOpen && this.props.onOpen(element);
  }
  beforeClose(DOMNode: HTMLElement, removeFromDOM: ()=>any){
    this.setState({
      visible: false
    });
    setTimeout(removeFromDOM, 300);
  }
  render(){
    return (<Portal onKeyStroke={this.props.onKeyStroke} isOpen={this.props.isOpen}
        openByClickOn={this.props.children} onOpen={this.onOpen} onClose={this.props.onClose} beforeClose={this.beforeClose} closeOnEsc>
{(closePortal: ()=>any)=>{return <div className={`dialog ${this.props.classNameExtension} ${this.state.visible ? "visible" : ""}`} onClick={this.onOverlayClick.bind(this, closePortal)}>
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