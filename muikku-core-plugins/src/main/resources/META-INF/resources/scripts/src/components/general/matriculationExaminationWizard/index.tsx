import * as React from "react";
import moment from "moment";
import { Step1, Step2, Step3, Step4, Step5 } from "./steps";
import { connect, Dispatch } from "react-redux";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/matriculation.scss";
import { StatusType } from "~/reducers/base/status";
import Wizard, { WizardStep } from "~/components/general/wizard";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import { MatriculationProvider } from "./context/matriculation-context";
import { useMatriculation } from "./hooks/use-matriculation";
import MatriculationWizardHeader from "./matriculation-wizard-header";
import MatriculationWizardFooter from "./matriculation-wizard-footer";
import { MatriculationFormType } from "~/@types/shared";
import { AnyActionType } from "~/actions";

moment.locale("fi");

/**
 * MatriculationExaminationWizardProps
 */
interface MatriculationExaminationWizardProps {
  status: StatusType;
  examId: number;
  compulsoryEducationEligible: boolean;
  onClose?: () => void;
  onUpdateExam?: (examId: number) => void;
  formType: MatriculationFormType;
}

/**
 * MatriculationExaminationWizard
 * @param props props
 */
const MatriculationExaminationWizard = (
  props: MatriculationExaminationWizardProps
) => {
  const { compulsoryEducationEligible, examId, status, onClose, onUpdateExam } =
    props;

  const useMatriculationValues = useMatriculation(
    examId,
    status.userSchoolDataIdentifier,
    compulsoryEducationEligible,
    undefined,
    props.formType
  );

  /**
   * Handles step change. Fires submit if last step
   * @param step step
   */
  const handleStepChange = (step: WizardStep) => {
    if (step.index === steps.length - 1) {
      if (useMatriculationValues.matriculation.saveState === "IN_PROGRESS") {
        return;
      }

      // Submit form. On success, call onDone (close dialog) and update exam
      useMatriculationValues.onMatriculationFormSubmit();
    }
  };

  /**
   * StepZilla steps
   */
  const steps: WizardStep[] = [
    {
      index: 0,
      name: "Opiskelijatiedot",
      component: <Step1 />,
    },
    {
      index: 1,
      name: "Ilmoittautuminen",
      component: <Step2 />,
    },
    {
      index: 2,
      name: "Suorituspaikka",
      component: <Step3 />,
    },
    {
      index: 3,
      name: "Yhteenveto",
      component: <Step4 />,
    },
    {
      index: 4,
      name: "Valmis",
      component: <Step5 onUpdateExam={onUpdateExam} onClose={onClose} />,
    },
  ];

  const { ...useWizardValues } = useWizard({
    preventNextIfInvalid: true,
    steps: steps,
    onStepChange: handleStepChange,
  });

  return (
    <MatriculationProvider value={useMatriculationValues}>
      <WizardProvider value={useWizardValues}>
        <Wizard
          header={<MatriculationWizardHeader />}
          footer={<MatriculationWizardFooter />}
        />
      </WizardProvider>
    </MatriculationProvider>
  );
};

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationExaminationWizard);
