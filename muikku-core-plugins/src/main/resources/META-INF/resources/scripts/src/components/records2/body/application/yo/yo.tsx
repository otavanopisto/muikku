import * as React from "react";
import { connect, Dispatch, Store } from "react-redux";
import { bindActionCreators, Action } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import { RecordsType } from "~/reducers/main-function/records";
import { StateType } from "~/reducers";
import { HOPSType } from "~/reducers/main-function/hops";
import {
  YOType,
  YOEligibilityType,
  YOEligibilityStatusType,
  SubjectEligibilitySubjectsType,
} from "~/reducers/main-function/records/yo";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/course.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/buttons.scss";
import { updateYO } from "~/actions/main-function/records/yo";
import { updateYOTriggerType } from "../../../../../actions/main-function/records/yo";

/**
 * YOProps
 */
interface YOProps {
  i18n: i18nType;
  records: RecordsType;
  hops: HOPSType;
  yo: YOType;
  updateYO: updateYOTriggerType;
  eligibilitySubjects: SubjectEligibilitySubjectsType;
}

/**
 * YOState
 */
interface YOState {
  eligibility?: YOEligibilityType;
  eligibilityStatus?: YOEligibilityStatusType;
  err?: String;
  succesfulEnrollments: number[];
}

/**
 * YO
 */
class YO extends React.Component<YOProps, YOState> {
  constructor(props: YOProps) {
    super(props);

    this.state = {
      succesfulEnrollments: [],
    };
  }

  /**
   * Render method
   * @returns JSX.Element
   */
  render() {
    return <div>Tyhjä yo näkymä</div>;
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: state.records,
    hops: state.hops,
    yo: state.yo,
    eligibilitySubjects: state.eligibilitySubjects,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ updateYO }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(YO);
