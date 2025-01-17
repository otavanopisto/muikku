import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface NewHopsEventDescriptionDialogProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  isOpen: boolean;
  content: JSX.Element;
  onSaveClick?: () => void;
  onCancelClick?: () => void;
}

/**
 * MatriculationExaminationWizardDialogState
 */
interface NewHopsEventDescriptionDialogState {}

/**
 * MatriculationExaminationWizardDialog
 */
class NewHopsEventDescriptionDialog extends React.Component<
  NewHopsEventDescriptionDialogProps,
  NewHopsEventDescriptionDialogState
> {
  /**
   * Constructor method
   *
   * @param props props
   */
  constructor(props: NewHopsEventDescriptionDialogProps) {
    super(props);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => void) => this.props.content;

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "execute"]}
          onClick={this.props.onSaveClick}
        >
          {this.props.t("actions.save", { ns: "common" })}
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={this.props.onCancelClick}
        >
          {this.props.t("actions.cancel", { ns: "common" })}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        disableScroll={true}
        title={this.props.t("labels.save", {
          ns: "common",
          context: "changes",
        })}
        content={content}
        footer={footer}
        isOpen={this.props.isOpen}
        closeOnOverlayClick={false}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
const mapDispatchToProps = (dispatch: Dispatch<Action<AnyActionType>>) => ({});

export default withTranslation()(
  connect(null, mapDispatchToProps)(NewHopsEventDescriptionDialog)
);
