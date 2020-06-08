import Dialog from './dialog';
import Portal from './portal';
import * as React from 'react';

import '~/sass/elements/environment-dialog.scss';

export default class JumboDialog extends Dialog {

  render(){
    return (
      <Portal onKeyStroke={this.props.onKeyStroke} isOpen={this.props.isOpen} openByClickOn={this.props.children} onOpen={this.onOpen} onClose={this.props.onClose} beforeClose={this.beforeClose} closeOnEsc>
        {(closePortal: ()=>any)=>{return <div className={`env-dialog env-dialog--mainfunction env-dialog--${this.props.modifier} ${this.state.visible ? "visible" : ""}`} onClick={this.onOverlayClick.bind(this, closePortal)}>
          <div className="env-dialog__wrapper">
             <div className="env-dialog__content">
                <div className="env-dialog__header">
                  {this.props.title}
                </div>
                <div className="env-dialog__body">
                  {this.props.content(closePortal)}
                </div>
                <div className="env-dialog__footer">
                  {this.props.footer && this.props.footer(closePortal)}
                </div>
              </div>
            </div>
          </div>}}
      </Portal>);
  }
}
