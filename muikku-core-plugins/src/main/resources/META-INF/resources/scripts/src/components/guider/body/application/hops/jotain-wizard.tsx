import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
const StepZilla = require("react-stepzilla").default;

import "~/sass/elements/wizard.scss";

export const NEEDED_OPTIONAL_COURSES = 9;
export const NEEDED_STUDIES_IN_TOTAL = 46;

interface JotainWizardProps {
  i18n: i18nType;
}

interface JotainWizardState {}

class JotainWizard extends React.Component<
  JotainWizardProps,
  JotainWizardState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: JotainWizardProps) {
    super(props);

    this.state = {};
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const steps = [
      {
        name: "Perustiedot",
        component: (
          <div>
            <h1>ots</h1>{" "}
          </div>
        ),
      },
      {
        name: "Osaamisen ja lähtötason arvointi",
        component: (
          <div>
            <h1>ots</h1>{" "}
          </div>
        ),
      },
      {
        name: "Opiskelutaidot ja Motivaatio",
        component: (
          <div>
            <h1>ots</h1>{" "}
          </div>
        ),
      },
      {
        name: "Tavoitteet ja opintojen suunnittelu",
        component: (
          <div>
            <h1>ots</h1>{" "}
          </div>
        ),
      },
    ];

    return (
      <div className="wizard">
        <div className="wizard_container">
          <StepZilla
            steps={steps}
            showNavigation={true}
            showSteps={true}
            preventEnterSubmission={true}
            prevBtnOnLastStep={true}
            nextTextOnFinalActionStep="Jatka"
            nextButtonCls="button button--wizard"
            backButtonCls="button button--wizard"
            nextButtonText={this.props.i18n.text.get(
              "plugin.workspace.management.wizard.button.next"
            )}
            backButtonText={this.props.i18n.text.get(
              "plugin.workspace.management.wizard.button.last"
            )}
          />
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(JotainWizard);
