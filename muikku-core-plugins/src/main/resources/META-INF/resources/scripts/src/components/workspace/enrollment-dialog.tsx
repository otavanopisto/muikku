import * as React from "react";
import Dialog from "~/components/general/dialog";
import { StateType } from "reducers";
import { connect } from "react-redux";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * EnrollmentDialogProps
 */
interface EnrollmentDialogProps extends WithTranslation {
  isOpen?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: () => any;
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
    const { t } = this.props;

    /**
     * footer
     */
    const footer = () => (
      <div className="dialog__button-set">
        <Button href="/" buttonModifiers={["info", "standard-ok"]}>
          {t("actions.readMore", { ns: "workspace" })}
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
          {t("content.logInGuidingInformation", { ns: "workspace" })}
        </div>
      </div>
    );
    return (
      <Dialog
        closeOnOverlayClick={false}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="enrollment"
        title={t("labels.guidance", { ns: "materials" })}
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
  return {};
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["users", "workspace", "materials", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(EnrollmentDialog)
);
