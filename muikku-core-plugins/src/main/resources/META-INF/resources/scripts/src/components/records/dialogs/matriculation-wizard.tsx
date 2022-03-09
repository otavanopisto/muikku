import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import MatriculationExaminationWizard from "../body/matriculationExaminationWizard";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface MatriculationExaminationWizardDialogProps {
  i18n: i18nType;
  children?: React.ReactElement<any>;
  examId: number;
  compulsoryEducationEligible: boolean;
  updateEnrollemnts: (examId: number) => void;
}

/**
 * MatriculationExaminationWizardDialogState
 */
interface MatriculationExaminationWizardDialogState {
  scale: number;
  angle: number;
}

/**
 * MatriculationExaminationWizardDialog
 */
class MatriculationExaminationWizardDialog extends React.Component<
  MatriculationExaminationWizardDialogProps,
  MatriculationExaminationWizardDialogState
> {
  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div>
        <MatriculationExaminationWizard
          examId={this.props.examId}
          compulsoryEducationEligible={this.props.compulsoryEducationEligible}
          onDone={closeDialog}
          updateEnrollemnts={this.props.updateEnrollemnts}
        />
      </div>
    );
    return (
      <Dialog
        disableScroll={true}
        title="Ilmoittaudu ylioppilaskokeisiin"
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
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationExaminationWizardDialog);
