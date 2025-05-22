import * as React from "react";
import { usePedagogy } from "./hooks/usePedagogy";
import { Step1, Step2, Step3, Step4, Step5, Step6 } from "./steps";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import { PDFViewer } from "@react-pdf/renderer";
import PedagogyPDF from "./pedagogy-PDF";
import AnimatedStep from "../wizard/AnimateStep";
import Wizard, { WizardStep } from "../wizard";
import { useWizard } from "../wizard/hooks/useWizard";
import { AnimatePresence } from "framer-motion";
import { WizardProvider } from "../wizard/context/wizard-context";
import PedagogyFormWizardHeader from "./pedagogy-form-wizard-header";
import PedagogyFormWizardFooter from "./pedagogy-form-wizard-footer";
import { PedagogyProvider } from "./context/pedagogy-context";
import "~/sass/elements/pedagogy.scss";
import PedagogyToolbar from "./pedagogy-toolbar";
import { UserRole } from "~/@types/pedagogy-form";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

// Visibility settings which study programmes have access to the form
export const UPPERSECONDARY_PEDAGOGYFORM = [
  "Nettilukio",
  "Aikuislukio",
  "Nettilukio/yksityisopiskelu (aineopintoina)",
];

/**
 * The props for the UpperSecondaryPedagogicalSupportForm component.
 */
interface UpperSecondaryPedagogicalSupportWizardFormmProps {
  userRole: UserRole;
  studentUserEntityId: number;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Creates a new UpperSecondaryPedagogicalSupportForm component.
 *
 * @param props props
 * @returns JSX.Element
 */
const UpperSecondaryPedagogicalSupportWizardForm: React.FC<
  UpperSecondaryPedagogicalSupportWizardFormmProps
> = (props) => {
  const { t } = useTranslation(["pedagogySupportPlan"]);
  const usePedagogyValues = usePedagogy(
    props.studentUserEntityId,
    props.displayNotification
  );
  const { loading, data } = usePedagogyValues;
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
          <Step1 status={props.status} />
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
      name: t("labels.step4", { ns: "pedagogySupportPlan" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step4 status={props.status} />
        </AnimatedStep>
      ),
    },
    {
      index: 4,
      name: t("labels.step5", { ns: "pedagogySupportPlan" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step5 status={props.status} />
        </AnimatedStep>
      ),
    },
    {
      index: 5,
      name: t("labels.step6", { ns: "pedagogySupportPlan" }),
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step6 />
        </AnimatedStep>
      ),
    },
  ];

  // Remove last step if use case is student
  if (props.userRole === "STUDENT") {
    listOfStepObjects.pop();
  }

  const { ...useWizardValues } = useWizard({
    preventNextIfInvalid: true,
    steps: listOfStepObjects,
  });

  return (
    <PedagogyProvider
      value={{
        userRole: props.userRole,
        ...usePedagogyValues,
      }}
    >
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
    </PedagogyProvider>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    displayNotification,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpperSecondaryPedagogicalSupportWizardForm);

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
