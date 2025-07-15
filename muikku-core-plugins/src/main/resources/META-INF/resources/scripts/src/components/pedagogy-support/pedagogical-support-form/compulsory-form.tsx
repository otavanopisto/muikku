import * as React from "react";
import { Step1, Step2, Step3, Step5, Step6 } from "./steps/compulsory";
import { PDFViewer } from "@react-pdf/renderer";
import AnimatedStep from "~/components/general/wizard/AnimateStep";
import Wizard, { WizardStep } from "~/components/general/wizard";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import { AnimatePresence } from "framer-motion";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import "~/sass/elements/pedagogy.scss";
import { UserRole } from "~/@types/pedagogy-form";
import { useTranslation } from "react-i18next";
import PedagogyToolbar from "../components/pedagogy-toolbar";
import PedagogyPDF from "../pedagogy-PDF";
import PedagogyFormWizardHeader from "../components/pedagogy-form-wizard-header";
import PedagogyFormWizardFooter from "../components/pedagogy-form-wizard-footer";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { useCompulsoryForm } from "../hooks/useCompulsoryForm";

/**
 * The props for the UpperSecondaryPedagogicalSupportForm component.
 */
interface CompulsoryPedagogicalSupportWizardFormmProps {
  userRole: UserRole;
  studentUserEntityId: number;
}

/**
 * Creates a new UpperSecondaryPedagogicalSupportForm component.
 *
 * @param props props
 * @returns JSX.Element
 */
const CompulsoryPedagogicalSupportWizardForm = (
  props: CompulsoryPedagogicalSupportWizardFormmProps
) => {
  const { t } = useTranslation(["pedagogySupportPlan"]);
  const status = useSelector((state: StateType) => state.status);

  const { loading, data } = useCompulsoryForm();
  const [showPDF, setShowPDF] = React.useState(false);

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
        {loading ? (
          <OverlayComponent>
            <div className="pedagogy-form__overlay-content">
              <div className="loader-empty" />
            </div>
          </OverlayComponent>
        ) : null}

        <PedagogyToolbar showPDF={showPDF} setShowPDF={setShowPDF} />

        <div className="pedagogy-form__container">
          {data && data.state === "INACTIVE" ? (
            <OverlayComponent>
              <div className="pedagogy-form__overlay-content">
                {props.userRole === "STUDENT" ? (
                  <p>
                    {t("content.notActivated", {
                      ns: "pedagogySupportPlan",
                      context: props.userRole.toLowerCase(),
                    })}
                  </p>
                ) : (
                  <p>
                    {t("content.notActivated", { ns: "pedagogySupportPlan" })}
                  </p>
                )}
              </div>
            </OverlayComponent>
          ) : null}

          {showPDF ? (
            <PDFViewer className="pedagogy-form__pdf">
              <PedagogyPDF data={data} />
            </PDFViewer>
          ) : (
            <Wizard
              modifiers={["pedagogy-form"]}
              header={<PedagogyFormWizardHeader />}
              footer={<PedagogyFormWizardFooter />}
              wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
            />
          )}
        </div>
      </div>
    </WizardProvider>
  );
};

export default CompulsoryPedagogicalSupportWizardForm;

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
