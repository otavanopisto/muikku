import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { MatriculationFormType } from "~/@types/shared";
import MatriculationWizardSummary from "~/components/general/matriculationExaminationWizard/matriculation-wizard-summary";
import { Action, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  VerifyMatriculationExamTriggerType,
  verifyMatriculationExam,
} from "~/actions/main-function/hops/";
import Button from "~/components/general/button";
import { MatriculationExam } from "~/generated/client";

/**
 * MatriculationVerifyDialogProps
 */
interface MatriculationVerifyDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  exam: MatriculationExam;
  compulsoryEducationEligible: boolean;
  formType: MatriculationFormType;
  verifyMatriculationExam: VerifyMatriculationExamTriggerType;
}

/**
 * MatriculationVerifyDialogState
 */
interface MatriculationVerifyDialogState {}

/**
 * MatriculationVerifyDialog
 */
class MatriculationVerifyDialog extends React.Component<
  MatriculationVerifyDialogProps,
  MatriculationVerifyDialogState
> {
  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        <MatriculationWizardSummary
          exam={this.props.exam}
          compulsoryEducationEligible={this.props.compulsoryEducationEligible}
          formType={this.props.formType}
        />
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          className="button"
          onClick={() => {
            this.props.verifyMatriculationExam({
              examId: this.props.exam.id,
            });
            closeDialog();
          }}
          buttonModifiers={["success", "standard-ok"]}
        >
          Vahvista
        </Button>
        <Button
          className="button"
          onClick={closeDialog}
          buttonModifiers={["cancel", "standard-cancel"]}
        >
          Peruuta
        </Button>
      </div>
    );

    return (
      <Dialog
        disableScroll={true}
        title="Vahvista ilmoittautuminen"
        content={content}
        footer={footer}
        modifier={["wizard", "matriculation"]}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ verifyMatriculationExam }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationVerifyDialog);
