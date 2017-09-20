import Dialog from './dialog';
import Portal from './portal';
import * as React from 'react';

export default class JumboDialog extends Dialog {
  render(){
    return (
        <Portal onKeyStroke={this.props.onKeyStroke} isOpen={this.props.isOpen} openByClickOn={this.props.children} onOpen={this.onOpen} onClose={this.props.onClose} beforeClose={this.beforeClose} closeOnEsc>
          {(closePortal)=>{return <div className={`jumbo-dialog ${this.props.classNameExtension} ${this.state.visible ? "visible" : ""}`} onClick={this.onOverlayClick.bind(this, closePortal)}>
            <div className="jumbo-dialog-wrapper">
               <div className="jumbo-dialog-window">
                  <div className="jumbo-dialog-header">
                    {this.props.title}
                    <span className="jumbo-dialog-close icon icon-close" onClick={closePortal}></span>
                  </div>
                  <div className="jumbo-dialog-body">
                    {this.props.content(closePortal)}
                  </div>
                  <div className="jumbo-dialog-footer">
                    {this.props.footer && this.props.footer(closePortal)}
                  </div>
                </div>
              </div>
            </div>}}
        </Portal>);
  }
}