import * as React from "react";
import moment from "moment";
import { Step1, Step2, Step3, Step4, Step5 } from "./steps";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { connect, Dispatch } from "react-redux";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/matriculation.scss";
import { StatusType } from "~/reducers/base/status";
import { HOPSState } from "~/reducers/main-function/hops";
import { MatriculationState } from "~/reducers/main-function/records/yo";
import Wizard, { WizardStep } from "~/components/general/wizard";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import { MatriculationProvider } from "./context/matriculation-context";
import { useMatriculation } from "./hooks/use-matriculation";
import MatriculationWizardHeader from "./matriculation-wizard-header";
import MatriculationWizardFooter from "./matriculation-wizard-footer";
import {
  ExaminationGrade,
  ExaminationSubject,
  MatriculationFormType,
} from "~/@types/shared";
import { AnyActionType } from "~/actions";

moment.locale("fi");

export const ACADEMIC_SUBJECTS = [
  "UE",
  "ET",
  "YO",
  "KE",
  "GE",
  "TT",
  "PS",
  "FI",
  "HI",
  "FY",
  "BI",
];
export const ADVANCED_SUBJECTS = [
  "MAA",
  "RUA",
  "ENA",
  "RAA",
  "ESA",
  "SAA",
  "VEA",
];

export const FINNISH_SUBJECTS = ["AI", "S2"];
export const SUBJECT_MAP: ExaminationSubject = {
  AI: "Äidinkieli",
  S2: "Suomi toisena kielenä",
  ENA: "Englanti, A-taso",
  RAA: "Ranska, A-taso",
  ESA: "Espanja, A-taso",
  SAA: "Saksa, A-taso",
  VEA: "Venäjä, A-taso",
  RUA: "Ruotsi, A-taso",
  RUB: "Ruotsi, B-taso",
  MAA: "Matematiikka, pitkä",
  MAB: "Matematiikka, lyhyt",
  UE: "Uskonto",
  ET: "Elämänkatsomustieto",
  YO: "Yhteiskuntaoppi",
  KE: "Kemia",
  GE: "Maantiede",
  TT: "Terveystieto",
  PS: "Psykologia",
  FI: "Filosofia",
  HI: "Historia",
  FY: "Fysiikka",
  BI: "Biologia",
  ENC: "Englanti, C-taso",
  RAC: "Ranska, C-taso",
  ESC: "Espanja, C-taso",
  SAC: "Saksa, C-taso",
  VEC: "Venäjä, C-taso",
  ITC: "Italia, C-taso",
  POC: "Portugali, C-taso",
  LAC: "Latina, C-taso",
  SM_DC: "Pohjoissaame, C-taso",
  SM_ICC: "Inarinsaame, C-taso",
  SM_QC: "Koltansaame, C-taso",
};

export const EXAMINATION_GRADES_MAP: ExaminationGrade = {
  K: "K (Hylätty, muu syy)",
  IMPROBATUR: "I (Improbatur)",
  APPROBATUR: "A (Approbatur)",
  LUBENTER_APPROBATUR: "B (Lubenter approbatur)",
  CUM_LAUDE_APPROBATUR: "C (Cum laude approbatur)",
  MAGNA_CUM_LAUDE_APPROBATUR: "M (Magna cum laude approbatur)",
  EXIMIA_CUM_LAUDE_APPROBATUR: "E (Eximia cum laude approbatur)",
  LAUDATUR: "L (Laudatur)",
  UNKNOWN: "Ei vielä tiedossa",
};

export const EXAMINATION_SUCCESS_GRADES_MAP = [
  "APPROBATUR",
  "LUBENTER_APPROBATUR",
  "CUM_LAUDE_APPROBATUR",
  "MAGNA_CUM_LAUDE_APPROBATUR",
  "EXIMIA_CUM_LAUDE_APPROBATUR",
  "LAUDATUR",
];

/**
 * MatriculationExaminationWizardProps
 */
interface MatriculationExaminationWizardProps {
  workspace: WorkspaceDataType;
  status: StatusType;
  examId: number;
  compulsoryEducationEligible: boolean;
  onClose?: () => void;
  onUpdateExam?: (examId: number) => void;
  hops: HOPSState;
  yo: MatriculationState;
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
    workspace: state.workspaces && state.workspaces.currentWorkspace,
    status: state.status,
    hops: state.hops,
    yo: state.yo,
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
