import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { Dispatch, bindActionCreators } from "redux";
import { StateType } from '~/reducers';
import { SubjectEligibilityType } from '~/reducers/main-function/records/subject_eligibility';
import {updateMatriculationSubjectEligibility, UpdateMatriculationSubjectEligibilityTriggerType} from '~/actions/main-function/records/subject_eligibility';
import mApi, { MApiError } from '~/lib/mApi';
import promisify from "~/util/promisify";

/**
 * Interface representing MatriculationEligibilityRow component properties
 * 
 */

interface MatriculationEligibilityRowProps {
  subjectEligibility: SubjectEligibilityType,
  code: string,
  subjectCode: string,  
  i18n: i18nType,
  updateMatriculationSubjectEligibility:UpdateMatriculationSubjectEligibilityTriggerType
}

/**
 * Interface representing MatriculationEligibilityRow component state
 * 
 */

interface MatriculationEligibilityRowState {
  loading: boolean
}

/**
 * MatriculationEligibilityRow component
 * 
 * @author Heikki Kurhinen <heikki.kurhinen@metatavu.fi>
 */

class MatriculationEligibilityRow extends React.Component<MatriculationEligibilityRowProps, MatriculationEligibilityRowState> {
  constructor(props: MatriculationEligibilityRowProps){
    super(props);
    this.state = {loading : true};    
  }
  
  componentWillMount () {
    this.props.updateMatriculationSubjectEligibility(this.props.subjectCode);
  }
  
  componentDidMount () {
    this.setState({
      loading: false
    });
  }
  
  render() {
    return (
       <div title={this.getEligibleTooltip()}>
        <span>{this.getName()}</span>
        <span style={{float: 'right'}}>{this.state.loading ? this.props.i18n.text.get("plugin.records.hops.matriculationEligibleLoading") : (this.getEligibleText())}</span>
      </div>
    );
  }

  /**
   * Returns name for matriculation subject
   * 
   * @returns matriculation subject name or empty string if not found 
   */
  
  getName(): string {
    return this.props.i18n.text.get(`plugin.records.hops.matriculationSubject.${this.props.code}`);
  }
  
  /**
   * Returns list text for student matriculation eligibility
   * 
   * @returns list text for student matriculation eligibility
   */
  getEligibleText(): string {
    switch (this.props.subjectEligibility.egilibility) { 
      case "TRUE":
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleText.true");
      case "FALSE":
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleText.false");
      default:
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleText.error");
    } 
  }

  /**
   * Returns item tooltip for student matriculation eligibility
   * 
   * @returns item tooltip for student matriculation eligibility
   * 
   * 
   * 
   * , this.state.acceptedCount, this.state.requiredCount
   * 
   */
  
  getEligibleTooltip(): string {
    if (this.state.loading) {
      return "";
    }
    switch (this.props.subjectEligibility.egilibility) {
      case "TRUE":
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleTooltip.true");
      case "FALSE":
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleTooltip.false");
      default:
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleTooltip.error");
    } 
  }
}

function mapStateToProps( state: StateType ) {
  return {
    i18n: state.i18n,
    subjectEligibility: state.subjectEligibility
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return bindActionCreators({updateMatriculationSubjectEligibility}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( MatriculationEligibilityRow );
