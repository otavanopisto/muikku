import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { Dispatch, bindActionCreators } from "redux";
import { StateType } from '~/reducers';
import { SubjectEligibilityType, EligibleStatusType } from '~/reducers/main-function/records/yo';
import {updateMatriculationSubjectEligibility, UpdateMatriculationSubjectEligibilityTriggerType} from '~/actions/main-function/records/yo';
import mApi, { MApiError } from '~/lib/mApi';
import promisify from "~/util/promisify";
import '~/sass/elements/application-sub-panel.scss';

interface MatriculationEligibilityRowProps {
  subject: SubjectEligibilityType,
  i18n: i18nType,
}

interface MatriculationEligibilityRowState {
  loading: boolean
}

class MatriculationEligibilityRow extends React.Component<MatriculationEligibilityRowProps, MatriculationEligibilityRowState> {
  constructor(props: MatriculationEligibilityRowProps){
    super(props);
    this.state = {
      loading: true
    };
  }
 componentDidMount () {
    this.setState({
      loading: false
    });
  }
  getMatriculationSubjectNameByCode = (code: string): string => {
    return this.props.i18n.text.get(`plugin.records.hops.matriculationSubject.${code}`);
  }
  render() {
    return (
       <div className="application-sub-panel__summary-item application-sub-panel__summary-item--subject-eligibility" title={this.getEligibleTooltip()}>
        <div className="application-sub-panel__summary-item-label">{this.getMatriculationSubjectNameByCode(this.props.subject.code)}</div>
        <div className={`application-sub-panel__summary-item-state application-sub-panel__summary-item-state--${this.props.subject.eligibility == "ELIGIBLE" ? "eligible" : "not-eligible" }`}>{this.state.loading ? this.props.i18n.text.get("plugin.records.hops.matriculationEligibleLoading") : (this.getEligibleText())}</div>
      </div>
    );
  }

  /**
   * Returns name for matriculation subject
   *
   * @returns matriculation subject name or empty string if not found
   */

  /**
   * Returns list text for student matriculation eligibility
   *
   * @returns list text for student matriculation eligibility
   */

  getEligibleText(): string {
    switch (this.props.subject.eligibility) { 
      case "ELIGIBLE":
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleText.true.short");
      case "NOT_ELIGIBLE":
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleText.false.short");
      default:
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleText.error");
    }
  }

  /**
   * Returns item tooltip for student matriculation eligibility
   *
   * @returns item tooltip for student matriculation eligibility
   */

  getEligibleTooltip(): string {
    if (this.state.loading) {
      return "";
    }
    switch (this.props.subject.eligibility) {
      case "ELIGIBLE":
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleTooltip.true", this.props.subject.acceptedCount, this.props.subject.requiredCount);
      case "NOT_ELIGIBLE":
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleTooltip.false", this.props.subject.acceptedCount, this.props.subject.requiredCount);
      default:
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleTooltip.error");
    }
  }
}

function mapStateToProps( state: StateType ) {
  return {
    i18n: state.i18n,
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( MatriculationEligibilityRow );
