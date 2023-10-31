import * as React from "react";
import { usePedagogy } from "./hooks/usePedagogy";
import { Step1, Step2, Step3, Step4, Step5, Step6 } from "./steps";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import { connect, Dispatch } from "react-redux";
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
  studentId: string;
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
  const usePedagogyValues = usePedagogy(
    props.studentId,
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
      name: "Perustiedot",
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step1 status={props.status} />
        </AnimatedStep>
      ),
    },
    {
      index: 1,
      name: "Asiakirja",
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step2 />
        </AnimatedStep>
      ),
    },
    {
      index: 2,
      name: "Pedagogisen tuen tarve",
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step3 />
        </AnimatedStep>
      ),
    },
    {
      index: 3,
      name: "Toteutetut tukitoimet",
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step4 status={props.status} />
        </AnimatedStep>
      ),
    },
    {
      index: 4,
      name: "Tuen seuranta ja arviointi",
      component: (
        <AnimatedStep previousStep={previousStep}>
          <Step5 status={props.status} />
        </AnimatedStep>
      ),
    },
    {
      index: 5,
      name: "Luvat ja hyväksyminen",
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
                      Pedagogisen tuen suunnitelmaa ei ole aktivoitu, ole
                      yhteydessä erityisopettajaasi.
                    </p>
                  ) : (
                    <p>Et ole aktivoinut pedagogisen tuen suunnitelmaa.</p>
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
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
