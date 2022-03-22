import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { Textarea } from "~/components/records2/body/hops-compulsory-education-wizard/text-area";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface EditHopsEventDescriptionDialogProps {
  i18n: i18nType;
  children?: React.ReactElement<any>;
  eventId: number;
}

/**
 * MatriculationExaminationWizardDialogState
 */
interface EditHopsEventDescriptionDialogState {
  scale: number;
  angle: number;
}

/**
 * MatriculationExaminationWizardDialog
 */
class EditHopsEventDescriptionDialog extends React.Component<
  EditHopsEventDescriptionDialogProps,
  EditHopsEventDescriptionDialogState
> {
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
    const content = (closeDialog: () => any) => (
      <div>
        <Textarea
          label="Kuvaus"
          className="form-element__textarea form-element__textarea--resize__vertically"
        />
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={closeDialog}
        >
          Ok
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={closeDialog}
        >
          Peruuta
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        disableScroll={true}
        title="Muokkaa kuvausta"
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditHopsEventDescriptionDialog);
