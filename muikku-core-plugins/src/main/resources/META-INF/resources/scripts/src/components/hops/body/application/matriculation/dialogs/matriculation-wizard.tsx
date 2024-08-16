import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { MatriculationFormType } from "~/@types/shared";
import MatriculationExaminationWizard from "~/components/general/matriculationExaminationWizard";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface MatriculationExaminationWizardDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  examId: number;
  compulsoryEducationEligible: boolean;
  updateEnrollemnts: (examId: number) => void;
  formType: MatriculationFormType;
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
    const content = (closeDialog: () => void) => (
      <div>
        <MatriculationExaminationWizard
          examId={this.props.examId}
          compulsoryEducationEligible={this.props.compulsoryEducationEligible}
          onDone={closeDialog}
          updateEnrollemnts={this.props.updateEnrollemnts}
          formType={this.props.formType}
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

export default MatriculationExaminationWizardDialog;
