import * as React from "react";
import moment from "moment";
import { Step4 } from "./steps";
import { connect, Dispatch } from "react-redux";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/matriculation.scss";
import { StatusType } from "~/reducers/base/status";
import { MatriculationProvider } from "./context/matriculation-context";
import { useMatriculation } from "./hooks/use-matriculation";
import { MatriculationFormType } from "~/@types/shared";
import { AnyActionType } from "~/actions";

moment.locale("fi");

/**
 * MatriculationExaminationWizardProps
 */
interface MatriculationWizardSummaryProps {
  status: StatusType;
  examId: number;
  compulsoryEducationEligible: boolean;
  formType: MatriculationFormType;
}

/**
 * MatriculationWizardSummary
 * @param props props
 */
const MatriculationWizardSummary = (props: MatriculationWizardSummaryProps) => {
  const { compulsoryEducationEligible, examId, status } = props;

  const useMatriculationValues = useMatriculation(
    examId,
    status.userSchoolDataIdentifier,
    compulsoryEducationEligible,
    undefined,
    props.formType
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
    status: state.status,
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
)(MatriculationWizardSummary);
