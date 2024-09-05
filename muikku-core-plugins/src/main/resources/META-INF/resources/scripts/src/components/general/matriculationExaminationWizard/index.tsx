import * as React from "react";
import moment from "moment";
import { Step1, Step2, Step3, Step4, Step5 } from "./steps";
import { connect, Dispatch } from "react-redux";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/matriculation.scss";
import Wizard, { WizardStep } from "~/components/general/wizard";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import { MatriculationProvider } from "./context/matriculation-context";
import { useMatriculation } from "./hooks/use-matriculation";
import MatriculationWizardHeader from "./matriculation-wizard-header";
import MatriculationWizardFooter from "./matriculation-wizard-footer";
import { MatriculationFormType } from "~/@types/shared";
import { AnyActionType } from "~/actions";
import { HopsState } from "~/reducers/hops";
import Button from "../button";
import { bindActionCreators } from "redux";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";

moment.locale("fi");

/**
 * MatriculationExaminationWizardProps
 */
interface MatriculationExaminationWizardProps {
  hops: HopsState;
  examId: number;
  compulsoryEducationEligible: boolean;
  onClose?: () => void;
  onUpdateExam?: (examId: number) => void;
  formType: MatriculationFormType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * MatriculationExaminationWizard
 * @param props props
 */
const MatriculationExaminationWizard = (
  props: MatriculationExaminationWizardProps
) => {
  const {
    compulsoryEducationEligible,
    examId,
    hops,
    onClose,
    onUpdateExam,
    displayNotification,
    formType,
  } = props;

  const useMatriculationValues = useMatriculation(
    examId,
    hops.currentStudentIdentifier,
    compulsoryEducationEligible,
    displayNotification,
    formType
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
      component: <Step5 formType={props.formType} />,
    },
  ];

  const { ...useWizardValues } = useWizard({
    preventNextIfInvalid: true,
    steps: steps,
    onStepChange: handleStepChange,
  });

  const footer = (
    <MatriculationWizardFooter
      secondLastButtonText={
        props.formType === "initial" ? "Lähetä" : "Tallenna"
      }
      lastStepButton={
        <Button
          onClick={() => {
            onUpdateExam(examId);
            onClose();
          }}
          buttonModifiers={["info"]}
          disabled={
            !(
              useMatriculationValues.matriculation.saveState === "SUCCESS" ||
              useMatriculationValues.matriculation.saveState === "FAILED"
            )
          }
        >
          Sulje
        </Button>
      }
    />
  );

  return (
    <MatriculationProvider value={useMatriculationValues}>
      <WizardProvider value={useWizardValues}>
        <Wizard header={<MatriculationWizardHeader />} footer={footer} />
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
    hops: state.hopsNew,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationExaminationWizard);
