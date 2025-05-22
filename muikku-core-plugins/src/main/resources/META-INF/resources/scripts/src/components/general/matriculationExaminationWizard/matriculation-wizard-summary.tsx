import * as React from "react";
import { Step4 } from "./steps";
import { connect } from "react-redux";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/matriculation.scss";
import { MatriculationProvider } from "./context/matriculation-context";
import { useMatriculation } from "./hooks/use-matriculation";
import { MatriculationFormType } from "~/@types/shared";
import { AnyActionType } from "~/actions";
import { HopsState } from "~/reducers/hops";
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { MatriculationExam } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * MatriculationExaminationWizardProps
 */
interface MatriculationWizardSummaryProps {
  hops: HopsState;
  exam: MatriculationExam;
  compulsoryEducationEligible: boolean;
  formType: MatriculationFormType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * MatriculationWizardSummary
 * @param props props
 */
const MatriculationWizardSummary = (props: MatriculationWizardSummaryProps) => {
  const {
    compulsoryEducationEligible,
    exam,
    hops,
    displayNotification,
    formType,
  } = props;

  const useMatriculationValues = useMatriculation(
    exam,
    hops.currentStudentIdentifier,
    compulsoryEducationEligible,
    displayNotification,
    formType
  );

  return (
    <MatriculationProvider value={useMatriculationValues}>
      <Step4 />
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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationWizardSummary);
