import * as React from "react";
// import { useTranslation } from "react-i18next";
// import AnimatedStep from "~/components/general/wizard/AnimateStep";
import Wizard, {
  WizardStep,
  createWizardSteps,
} from "~/components/general/wizard";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import { Step1, Step2, Step3, Step4 } from "./initialization/index";
import Header from "./initialization/header";
import Footer from "./initialization/footer";

/**
 * initializationProps
 */
interface initializationProps {}

const Initialization = (props: initializationProps) => {
  // const { t } = useTranslation("languageProfile");

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
      <Wizard
        modifiers={["language-profile"]}
        header={<Header />}
        footer={<Footer />}
        wrapper={<div>wrapper</div>}
      />
    </WizardProvider>
  );
};

export default Initialization;
