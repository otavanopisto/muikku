import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { MatriculationFormType } from "~/@types/shared";
import MatriculationWizardSummary from "~/components/general/matriculationExaminationWizard/matriculation-wizard-summary";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { MatriculationExam } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * MatriculationWizardSummaryDialogProps
 */
interface MatriculationWizardSummaryDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  exam: MatriculationExam;
  compulsoryEducationEligible: boolean;
  formType: MatriculationFormType;
}

/**
 * MatriculationWizardSummaryDialogState
 */
interface MatriculationWizardSummaryDialogState {}

/**
 * MatriculationWizardSummaryDialog
 */
class MatriculationWizardSummaryDialog extends React.Component<
  MatriculationWizardSummaryDialogProps,
  MatriculationWizardSummaryDialogState
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
    return (
      <Dialog
        disableScroll={true}
        title="Yhteenveto"
        content={content}
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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationWizardSummaryDialog);
