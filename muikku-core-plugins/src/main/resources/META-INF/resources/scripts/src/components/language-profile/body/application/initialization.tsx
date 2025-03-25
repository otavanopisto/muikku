import * as React from "react";
import { useTranslation } from "react-i18next";
import Wizard, {
  WizardStep,
  createWizardSteps,
} from "~/components/general/wizard";
import AnimatedStep from "~/components/general/wizard/AnimateStep";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import { Step1, Step2, Step3, Step4 } from "./initialization/index";
import Header from "./initialization/header";
import Footer from "./initialization/footer";
/**
 * initializationProps
 */
interface initializationProps {}

/**
 * InitializationState
 */
export interface InitializationState {
  languageUsage: string;
  studyMotivation: string;
  studyMethods: string;
}

export type InitializationActions =
  | {
      type: "SET_LANGUAGE_USAGE";
      payload: string;
    }
  | { type: "SET_STUDY_MOTIVATION"; payload: string }
  | { type: "SET_STUDY_METHOD"; payload: string };

export const initialState: InitializationState = {
  languageUsage: "",
  studyMotivation: "",
  studyMethods: "",
};

export interface ContextProps {
  state: InitializationState;
  dispatch: React.Dispatch<InitializationActions>;
}

/**
 * InitializationReducer
 * @param state state
 * @param action action
 * @returns an action
 */
export const InitializationReducer = (
  state: InitializationState,
  action: InitializationActions
): InitializationState => {
  switch (action.type) {
    case "SET_LANGUAGE_USAGE":
      return { ...state, languageUsage: action.payload };
    case "SET_STUDY_MOTIVATION":
      return { ...state, studyMotivation: action.payload };
    case "SET_STUDY_METHOD":
      return { ...state, studyMethods: action.payload };
    default:
      return state;
  }
};

export const InitializationContext = React.createContext<ContextProps>({
  state: initialState,
  dispatch: () => {},
});

const Initialization = (props: initializationProps) => {
  const { t } = useTranslation("languageProfile");
  const [state, dispatch] = React.useReducer(
    InitializationReducer,
    initialState
  );
  /**
   * StepZilla steps
   */
  const steps = createWizardSteps(
    [Step1, Step2, Step3, Step4],
    "languageProfile"
  );

  const handleStepChange = (step: WizardStep) => {};
  const { ...wizardValues } = useWizard({
    preventNextIfInvalid: true,
    steps: steps,
    onStepChange: handleStepChange,
    preventStepperNavigation: true,
  });

  return (
    <WizardProvider value={wizardValues}>
      <InitializationContext.Provider value={{ state, dispatch }}>
        <Wizard
          modifiers={["pedagogy-form"]}
          header={<Header />}
          footer={<Footer />}
          wrapper={<div>wrapper</div>}
        />
      </InitializationContext.Provider>
    </WizardProvider>
  );
};

export default Initialization;
