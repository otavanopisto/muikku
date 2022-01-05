import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Link from "~/components/general/link";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import mApi, { MApiError } from "~/lib/mApi";

import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import { bindActionCreators } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import promisify from "~/util/promisify";

interface ForgotPasswordDialogProps {
  i18n: i18nType;
  displayNotification: DisplayNotificationTriggerType;
  children: React.ReactElement<any>;
  modifier?: string;
}

interface ForgotPasswordDialogState {
  email: string;
}

const emailRegexValidator =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

class ForgotPasswordDialog extends React.Component<
  ForgotPasswordDialogProps,
  ForgotPasswordDialogState
> {
  constructor(props: ForgotPasswordDialogProps) {
    super(props);

    this.state = {
      email: "",
    };

    this.resetPassword = this.resetPassword.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
  }
  updateEmail(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: e.target.value });
  }
  async resetPassword(closeDialog: () => any, e: React.ChangeEvent<any>) {
    if (!e.isDefaultPrevented()) {
      e.preventDefault();
    }

    if (!this.state.email) {
      this.props.displayNotification(
        this.props.i18n.text.get(
          "plugin.forgotpassword.forgotPasswordDialog.email.required",
        ),
        "error",
      );
      return;
    } else if (!emailRegexValidator.test(this.state.email)) {
      this.props.displayNotification(
        this.props.i18n.text.get(
          "plugin.forgotpassword.forgotPasswordDialog.email.invalid",
        ),
        "error",
      );
      return;
    }

    try {
      const result = await promisify(
        mApi().forgotpassword.reset.read({ email: this.state.email }),
        "callback",
      )();
      this.props.displayNotification(
        this.props.i18n.text.get(
          "plugin.forgotPassword.forgotPasswordDialog.mailSent",
          this.state.email,
        ),
        "success",
      );
      this.setState({
        email: "",
      });
      closeDialog();
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      this.props.displayNotification(
        this.props.i18n.text.get(
          "plugin.forgotpassword.forgotPasswordDialog.noUserFound",
          this.state.email,
        ),
        "error",
      );
    }
  }
  render() {
    const content = (closeDialog: () => any) => (
      <div>
        {this.props.i18n.text.get(
          "plugin.forgotpassword.forgotPasswordDialog.instructions",
        )}
        <br />
        <br />
        <form
          className="form"
          onSubmit={this.resetPassword.bind(this, closeDialog)}
        >
          <div className="form-element">
            <label
              className="form-element__label"
              htmlFor="forgotpassword-email"
            >
              {this.props.i18n.text.get(
                "plugin.forgotpassword.forgotPasswordDialog.email",
              )}
            </label>
            <input
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.updateEmail}
              className="form-element__input form-element__input--forgotpassword"
            />
          </div>
        </form>
      </div>
    );
    const footer = (closeDialog: () => any) => (
      <div>
        <Link
          className="button button--forgotpassword-dialog-cancel button--cancel"
          onClick={closeDialog}
        >
          {this.props.i18n.text.get(
            "plugin.forgotpassword.forgotPasswordDialog.cancelButtonLabel",
          )}
        </Link>
        <Link
          className="button button--forgotpassword-dialog-submit button--success"
          onClick={this.resetPassword.bind(this, closeDialog)}
        >
          {this.props.i18n.text.get(
            "plugin.forgotpassword.forgotPasswordDialog.sendButtonLabel",
          )}
        </Link>
      </div>
    );
    return (
      <Dialog
        title={this.props.i18n.text.get(
          "plugin.forgotpassword.forgotPasswordDialog.title",
        )}
        content={content}
        footer={footer}
        modifier={
          this.props.modifier
            ? ["forgot-password", this.props.modifier]
            : "forgot-password"
        }
      >
        {this.props.children}
      </Dialog>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotPasswordDialog);
