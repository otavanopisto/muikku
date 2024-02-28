import Dialog from "./dialog";
import Portal from "./portal";
import * as React from "react";
import FocusTrap from "focus-trap-react";
import "~/sass/elements/environment-dialog.scss";

/**
 * EnvironmentDialog
 */
export default class EnvironmentDialog extends Dialog {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <Portal
        onKeyStroke={this.props.onKeyStroke}
        isOpen={this.props.isOpen}
        openByClickOn={this.props.children}
        onOpen={this.onOpen}
        onClose={this.props.onClose}
        beforeClose={this.beforeClose}
        closeOnEsc
      >
        {(closePortal: () => any) => (
          <FocusTrap
            active={this.state.visible}
            focusTrapOptions={{ allowOutsideClick: true }}
          >
            <div
              className={`env-dialog env-dialog--mainfunction env-dialog--${
                this.props.modifier
              } ${this.state.visible ? "visible" : ""}`}
              onClick={this.onOverlayClick.bind(this, closePortal)}
            >
              <section
                role="dialog"
                className="env-dialog__wrapper"
                aria-labelledby={`dialog-title-${this.props.modifier}`}
                aria-modal="true"
              >
                <div role="form" className="env-dialog__content">
                  <header
                    className="env-dialog__header"
                    id={`dialog-title-${this.props.modifier}`}
                  >
                    {this.props.title}
                  </header>
                  <section className="env-dialog__body">
                    {this.props.content(closePortal)}
                  </section>
                  <footer className="env-dialog__footer">
                    {this.props.footer && this.props.footer(closePortal)}
                  </footer>
                </div>
              </section>
            </div>
          </FocusTrap>
        )}
      </Portal>
    );
  }
}
