import * as React from "react";
import Dialog from "~/components/general/dialog";
import Link from "~/components/general/link";
import { StateType } from "reducers";
import { connect } from "react-redux";
import Button from "~/components/general/button";
import { i18nType } from "~/reducers/base/i18n";

interface EnrollmentDialogProps {
  isOpen?: boolean;
  onClose?: () => any;
  i18n: i18nType;
}

interface EnrollmentDialogState {}

class EnrollmentDialog extends React.Component<
  EnrollmentDialogProps,
  EnrollmentDialogState
> {
  render() {
    let footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Button href="/" buttonModifiers={["info", "standard-ok"]}>
            {this.props.i18n.text.get("plugin.workspace.logInGuidingLink")}
          </Button>
        </div>
      );
    };
    let content = (closeDialog: () => any) => {
      return (
        <div className="dialog__content-row dialog__content-row--label">
          <img
            src="/gfx/icons/64x64/certificate.png"
            alt="Enrollment logo"
            title="Enrollment logo"
            className="logo--enrollment-logo"
          />
          <div className="dialog__content-column">
            {this.props.i18n.text.get(
              "plugin.workspace.logInGuidingInformation"
            )}
          </div>
        </div>
      );
    };
    return (
      <Dialog
        closeOnOverlayClick={false}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="enrollment"
        title={this.props.i18n.text.get("plugin.workspace.logInGuidingTitle")}
        content={content}
        footer={footer}
      />
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentDialog);
