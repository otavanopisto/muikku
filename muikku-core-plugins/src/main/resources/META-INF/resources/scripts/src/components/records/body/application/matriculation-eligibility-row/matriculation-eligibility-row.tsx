import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { Dispatch, bindActionCreators } from "redux";
import { StateType } from "~/reducers";
import { SubjectEligibilityType } from "~/reducers/main-function/records/yo";
import "~/sass/elements/application-sub-panel.scss";

/**
 * MatriculationEligibilityRowProps
 */
interface MatriculationEligibilityRowProps {
  subject: SubjectEligibilityType;
  i18nOLD: i18nType;
}

/**
 * MatriculationEligibilityRowState
 */
interface MatriculationEligibilityRowState {
  loading: boolean;
}

/**
 * MatriculationEligibilityRow
 */
class MatriculationEligibilityRow extends React.Component<
  MatriculationEligibilityRowProps,
  MatriculationEligibilityRowState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MatriculationEligibilityRowProps) {
    super(props);
  }

  /**
   * getMatriculationSubjectNameByCode
   * @param code code
   */
  getMatriculationSubjectNameByCode = (code: string): string =>
    this.props.i18nOLD.text.get(
      `plugin.records.hops.matriculationSubject.${code}`
    );

  /**
   * render
   */
  render() {
    return (
      <div className="application-sub-panel__summary-item application-sub-panel__summary-item--subject-eligibility">
        <div
          className={`application-sub-panel__summary-item-state application-sub-panel__summary-item-state--${
            this.props.subject.eligibility == "ELIGIBLE"
              ? "eligible"
              : "not-eligible"
          }`}
        >
          {this.props.subject.eligibility === "ELIGIBLE"
            ? this.props.i18nOLD.text.get(
                "plugin.records.hops.matriculationEligibleText.true.short"
              )
            : this.props.i18nOLD.text.get(
                "plugin.records.hops.matriculationEligibleText.false.short"
              )}
        </div>
        <div className="application-sub-panel__summary-item-label">
          {this.getMatriculationSubjectNameByCode(this.props.subject.code)}
        </div>
        <div
          className="application-sub-panel__summary-item-description"
          dangerouslySetInnerHTML={{
            __html: this.props.i18nOLD.text.get(
              "plugin.records.hops.matriculationEligibleTooltip",
              this.props.subject.acceptedCount,
              this.props.subject.requiredCount
            ),
          }}
        />
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationEligibilityRow);
