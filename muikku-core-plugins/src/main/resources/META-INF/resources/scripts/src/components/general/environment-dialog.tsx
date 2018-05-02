import Dialog from './dialog';
import Portal from './portal';
import * as React from 'react';

import '~/sass/elements/dialog.scss';

export default class JumboDialog extends Dialog {
  render(){
    return (
        
        <Portal onKeyStroke={this.props.onKeyStroke} isOpen={this.props.isOpen} openByClickOn={this.props.children} onOpen={this.onOpen} onClose={this.props.onClose} beforeClose={this.beforeClose} closeOnEsc>
          {(closePortal: ()=>any)=>{return <div className={`environment-dialog environment-dialog--mainfunction environment-dialog--${this.props.modifier} ${this.state.visible ? "visible" : ""}`} onClick={this.onOverlayClick.bind(this, closePortal)}>
            <div className="environment-dialog__wrapper">
               <div className="environment-dialog__window">
                  <div className="environment-dialog__header">
                    {this.props.title}
                    <span className="environment-dialog__close icon-close" onClick={closePortal}></span>
                  </div>
                  <div className="environment-dialog__body">
                    {this.props.content(closePortal)}
                  </div>
                  <div className="environment-dialog__footer">
                    {this.props.footer && this.props.footer(closePortal)}
                  </div>
                </div>
              </div>
            </div>}}
        </Portal>);
  }
}