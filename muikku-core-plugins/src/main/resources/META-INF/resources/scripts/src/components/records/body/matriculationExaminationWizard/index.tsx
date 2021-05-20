import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { MatriculationExaminationEnrollmentInfo as Step1 } from "./matriculation-examination-enrollment-info";
import { MatriculationExaminationEnrollmentInformation as Step2 } from "./matriculation-examination-enrollment-information";
import { MatriculationExaminationEnrollmentAct as Step3 } from "./matriculation-examination-enrollment-act";
import { MatriculationExaminationEnrollmentCompleted as Step4 } from "./matriculation-examination-enrollment-completed";
const StepZilla = require("react-stepzilla").default;
import moment from "~/lib/moment";
import "~/sass/elements/wizard.scss";
import {
  copyCurrentWorkspace,
  CopyCurrentWorkspaceTriggerType,
  CopyCurrentWorkspaceStepType,
} from "~/actions/workspaces";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import { bindActionCreators } from "redux";
import "~/sass/elements/matriculation.scss";
import { SaveState } from "../../../../@types/shared";

interface MatriculationExaminationWizardProps {
  workspace: WorkspaceType;
  i18n: i18nType;
  copyCurrentWorkspace: CopyCurrentWorkspaceTriggerType;
  onDone: () => any;
}

interface MatriculationExaminationWizardState {
  locked: boolean;
  resultingWorkspace?: WorkspaceType;
  step?: CopyCurrentWorkspaceStepType;
}

export interface CopyWizardStoreType {
  description: string;
  name: string;
  nameExtension?: string;
  beginDate: any;
  endDate: any;
  copyDiscussionAreas: boolean;
  copyMaterials: "NO" | "CLONE" | "LINK";
  copyBackgroundPicture: boolean;
}

class MatriculationExaminationWizard extends React.Component<
  MatriculationExaminationWizardProps,
  MatriculationExaminationWizardState
> {
  constructor(props: MatriculationExaminationWizardProps) {
    super(props);

    this.state = {
      locked: false,
    };
  }

  /**
   * Renders steps title by state of saving
   * @param state State of saving
   * @returns title
   */
  renderSaveStateMessageTitle = (state: SaveState) => {
    const animatedDots = (
      <>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </>
    );

    let title: JSX.Element;
    switch (state) {
      case "PENDING":
        title = <p>Odottaa{animatedDots}</p>;
      case "IN_PROGRESS":
        title = <p>Ladataan{animatedDots}</p>;
      case "SUCCESS":
        title = <p>Valmis</p>;
      case "FAILED":
        title = <p>Epäonnistui</p>;
        break;
      default:
        return;
    }
    return title;
  };

  /**
   * Component render
   */
  render() {
    const steps = [
      {
        name: "Info",
        component: <Step1 />,
      },
      {
        name: "Oppilastiedot",
        component: <Step2 />,
      },
      {
        name: "Suorituspaikka",
        component: <Step3 />,
      },
      {
        name: this.renderSaveStateMessageTitle("SUCCESS"),
        component: <Step4 saveState="SUCCESS" />,
      },
    ];

    return (
      <div className="wizard">
        <div className="wizard_container">
          <StepZilla
            stepsNavigation={!this.state.locked}
            showNavigation={!this.state.locked}
            steps={steps}
            showSteps={true}
            preventEnterSubmission={true}
            prevBtnOnLastStep={false}
            nextTextOnFinalActionStep="Ilmoittaudu"
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
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces && state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ copyCurrentWorkspace }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationExaminationWizard);
