import * as React from "react";
import Dialog from "~/components/general/dialog";
import { StateType } from "reducers";
import { connect } from "react-redux";
import Button from "~/components/general/button";
import { i18nType } from "~/reducers/base/i18nOLD";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * EnrollmentDialogProps
 */
interface EnrollmentDialogProps extends WithTranslation<["common"]> {
  isOpen?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: () => any;
  i18nOLD: i18nType;
}

/**
 * EnrollmentDialogState
 */
interface EnrollmentDialogState {}

/**
 * EnrollmentDialog
 */
class EnrollmentDialog extends React.Component<
  EnrollmentDialogProps,
  EnrollmentDialogState
> {
  /**
   * render
   */
  render() {
    /**
     * footer
     */
    const footer = () => (
      <div className="dialog__button-set">
        <Button href="/" buttonModifiers={["info", "standard-ok"]}>
          {this.props.i18nOLD.text.get("plugin.workspace.logInGuidingLink")}
        </Button>
      </div>
    );
    /**
     * content
     * @param closeDialog  closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div className="dialog__content-row dialog__content-row--label">
        <img
          src="/gfx/icons/64x64/certificate.png"
          alt="Enrollment logo"
          title="Enrollment logo"
          className="logo--enrollment-logo"
        />
        <div className="dialog__content-column">
          {this.props.i18nOLD.text.get(
            "plugin.workspace.logInGuidingInformation"
          )}
        </div>
      </div>
    );
    return (
      <Dialog
        closeOnOverlayClick={false}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="enrollment"
        title={this.props.i18nOLD.text.get(
          "plugin.workspace.logInGuidingTitle"
        )}
        content={content}
        footer={footer}
      />
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(EnrollmentDialog)
);
