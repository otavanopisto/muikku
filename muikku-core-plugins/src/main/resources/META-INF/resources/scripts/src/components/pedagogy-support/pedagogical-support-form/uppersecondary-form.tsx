import * as React from "react";
import { Step1, Step2, Step3, Step5, Step6 } from "./steps/uppersecondary";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import AnimatedStep from "~/components/general/wizard/AnimateStep";
import Wizard, { WizardStep } from "~/components/general/wizard";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import { AnimatePresence } from "framer-motion";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import "~/sass/elements/pedagogy.scss";
import { useTranslation } from "react-i18next";
import PedagogyFormWizardHeader from "../components/pedagogy-form-wizard-header";
import PedagogyFormWizardFooter from "../components/pedagogy-form-wizard-footer";
import { useUpperSecondaryForm } from "../hooks/useUppersecondaryForm";

/**
 * The props for the UpperSecondaryPedagogicalSupportForm component.
 */
interface UpperSecondaryPedagogicalSupportWizardFormmProps {}

/**
 * Creates a new UpperSecondaryPedagogicalSupportForm component.
 *
 * @param props props
 * @returns JSX.Element
 */
const UpperSecondaryPedagogicalSupportWizardForm = (
  props: UpperSecondaryPedagogicalSupportWizardFormmProps
) => {
  const status = useSelector((state: StateType) => state.status);

  const { t } = useTranslation(["pedagogySupportPlan"]);

  const { loading } = useUpperSecondaryForm();

  const previousStep = React.useRef<number>(0);

  /**
   * Default steps
   */
  const listOfStepObjects: WizardStep[] = [
    {
      index: 0,
      name: t("labels.step1", { ns: "pedagogySupportPlan" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step1 status={status} />
        </AnimatedStep>
      ),
    },
    {
      index: 1,
      name: t("labels.step2", { ns: "pedagogySupportPlan" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step2 />
        </AnimatedStep>
      ),
    },
    {
      index: 2,
      name: t("labels.step3", { ns: "pedagogySupportPlan" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step3 />
        </AnimatedStep>
      ),
    },
    {
      index: 3,
      name: t("labels.step5", { ns: "pedagogySupportPlan" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step5 status={status} />
        </AnimatedStep>
      ),
    },
    {
      index: 4,
      name: "Näkyvyys",
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step6 />
        </AnimatedStep>
      ),
    },
  ];

  const { ...useWizardValues } = useWizard({
    preventNextIfInvalid: true,
    steps: listOfStepObjects,
  });

  return (
    <WizardProvider value={useWizardValues}>
      <div className="pedagogy-form">
        {loading && (
          <OverlayComponent>
            <div className="pedagogy-form__overlay-content">
              <div className="loader-empty" />
            </div>
          </OverlayComponent>
        )}

        <div className="pedagogy-form__container">
          <Wizard
            modifiers={["pedagogy-form"]}
            header={<PedagogyFormWizardHeader />}
            footer={<PedagogyFormWizardFooter />}
            wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
          />
        </div>
      </div>
    </WizardProvider>
  );
};

export default UpperSecondaryPedagogicalSupportWizardForm;

/**
 * OverlayComponentProsp
 */
interface OverlayComponentProsp {}

/**
 * OverlayComponent
 * @param props props
 * @returns JSX.Element
 */
const OverlayComponent: React.FC<OverlayComponentProsp> = (props) => (
  <div className="pedagogy-form__overlay">{props.children}</div>
);
