import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { Dispatch } from "redux";
import { StateType } from '~/reducers';
import mApi, { MApiError } from '~/lib/mApi';
import promisify from "~/util/promisify";

/**
 * Enum describing matriculation eligibility
 * 
 * @author Antti Leppä <antti.leppa@metatavu.fi>
 */
enum EligbleEnum { 
  FALSE,
  TRUE, 
  UNKNOWN
};

/**
 * Interface representing matriculation eligibility REST model 
 * 
 * @author Antti Leppä <antti.leppa@metatavu.fi>
 */
interface MatriculationEligibilityType {
  eligible: boolean;
  requirePassingGrades: number;
  acceptedCourseCount: number;
  acceptedTransferCreditCount: number;
}

/**
 * Interface representing MatriculationEligibilityRow component properties
 * 
 * @author Heikki Kurhinen <heikki.kurhinen@metatavu.fi>
 */
interface MatriculationEligibilityRowProps {
  code: string,
  subjectCode: string,
  i18n: i18nType
}

/**
 * Interface representing MatriculationEligibilityRow component state
 * 
 * @author Heikki Kurhinen <heikki.kurhinen@metatavu.fi>
 */
interface MatriculationEligibilityRowState {
  eligible: EligbleEnum,
  requiredCount: number;
  acceptedCount: number;
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
    
    this.state = {
      eligible: EligbleEnum.UNKNOWN,
      requiredCount: 0,
      acceptedCount: 0,
      loading: true
    }
  }

  /**
   * Component will mount life-cycle method  
   * 
   * Reads available matriculation subjects from REST API
   */
  async componentWillMount() {
    try {
      const result = await promisify(mApi().records.matriculationEligibility.read({"subjectCode": this.props.subjectCode}), 'callback')() as MatriculationEligibilityType;
      this.setState({
        eligible: result.eligible ? EligbleEnum.TRUE : EligbleEnum.FALSE,
        requiredCount: result.requirePassingGrades,
        acceptedCount: result.acceptedCourseCount + result.acceptedTransferCreditCount,
        loading: false
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }

      this.setState({
        eligible: EligbleEnum.UNKNOWN,
        loading: false
      });
    }
  }
  
  /**
   * Component render method  
   * 
   * Renders component
   */
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
    switch (this.state.eligible) { 
      case EligbleEnum.TRUE:
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleText.true");
      case EligbleEnum.FALSE:
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleText.false");
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

    switch (this.state.eligible) {
      case EligbleEnum.TRUE:
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleTooltip.true", this.state.acceptedCount, this.state.requiredCount);
      case EligbleEnum.FALSE:
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleTooltip.false", this.state.acceptedCount, this.state.requiredCount);
      default:
        return this.props.i18n.text.get("plugin.records.hops.matriculationEligibleTooltip.error");
    } 
  }
}

function mapStateToProps( state: StateType ) {
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( MatriculationEligibilityRow );
