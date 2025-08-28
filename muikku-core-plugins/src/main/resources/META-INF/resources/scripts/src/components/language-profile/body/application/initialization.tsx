import * as React from "react";
import Wizard, { createWizardSteps } from "~/components/general/wizard";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import { Step1, Step2, Step3, Step4 } from "./initialization/index";
import Header from "./initialization/header";
import Footer from "./initialization/footer";
import AnimatedStep from "~/components/general/wizard/AnimateStep";

/**
 * initializationProps
 */
interface initializationProps {}

/**
 * Initialization component - contains the wizard for language profile initialization
 * @param props props
 * Initialization component
 * @returns JSX.Element
 */
const Initialization = (props: initializationProps) => {
  const previousStep = React.useRef<number>(0);

  const stepComponents = [Step1, Step2, Step3, Step4].map(
    (Step, index) =>
      // Wrap each step in AnimatedStep to enable animations
      // it's done with a named function to preserve the display name
      function WrappedStep() {
        return (
          <AnimatedStep previousStep={previousStep} key={index}>
            <Step />
          </AnimatedStep>
        );
      }
  );

  /**
   * StepZilla steps
   */
  const steps = createWizardSteps(stepComponents, "languageProfile");

  const { ...wizardValues } = useWizard({
    preventNextIfInvalid: true,
    steps: steps,
    preventStepperNavigation: true,
  });

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [wizardValues.currentStepIndex]);

  return (
    <WizardProvider value={wizardValues}>
      <div className="panguage-profile-form">
        <div className="panguage-profile-form__container">
          <Wizard
            modifiers={["language-profile"]}
            header={<Header />}
            footer={<Footer />}
            wrapper={<div>wrapper</div>}
          />
        </div>
      </div>
    </WizardProvider>
  );
};

export default Initialization;
