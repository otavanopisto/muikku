import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18nOLD";
import Step1 from "./form";
import Step2 from "./summary";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StepZilla = require("react-stepzilla").default;
import "~/sass/elements/wizard.scss";
import {
  copyCurrentWorkspace,
  CopyCurrentWorkspaceTriggerType,
  CopyCurrentWorkspaceStepType,
} from "~/actions/workspaces";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import { bindActionCreators } from "redux";
import * as moment from "moment";

/**
 * CopyWizardProps
 */
interface CopyWizardProps {
  workspace: WorkspaceType;
  i18nOLD: i18nType;
  copyCurrentWorkspace: CopyCurrentWorkspaceTriggerType;
  onDone: () => any;
}

/**
 * CopyWizardState
 */
interface CopyWizardState {
  store: CopyWizardStoreType;
  locked: boolean;
  resultingWorkspace?: WorkspaceType;
  step?: CopyCurrentWorkspaceStepType;
}

/**
 * CopyWizardStoreType
 */
export interface CopyWizardStoreType {
  description: string;
  name: string;
  nameExtension?: string;
  beginDate: Date | null;
  endDate: Date | null;
  copyDiscussionAreas: boolean;
  copyMaterials: "NO" | "CLONE" | "LINK";
  copyBackgroundPicture: boolean;
}

export type CopyWizardStoreUpdateType = Partial<CopyWizardStoreType>;

/**
 * CopyWizard
 */
class CopyWizard extends React.Component<CopyWizardProps, CopyWizardState> {
  private store: CopyWizardStoreType;
  /**
   * constructor
   * @param props props
   */
  constructor(props: CopyWizardProps) {
    super(props);

    this.state = {
      store: {
        description: props.workspace.description,
        name: props.workspace.name,
        nameExtension: props.workspace.nameExtension,
        beginDate:
          props.workspace.additionalInfo.beginDate !== null
            ? moment(props.workspace.additionalInfo.beginDate).toDate()
            : null,
        endDate:
          props.workspace.additionalInfo.endDate !== null
            ? moment(props.workspace.additionalInfo.endDate).toDate()
            : null,
        copyDiscussionAreas: false,
        copyMaterials: "CLONE",
        copyBackgroundPicture: true,
      },
      locked: false,
    };

    this.getStore = this.getStore.bind(this);
    this.updateStore = this.updateStore.bind(this);
    this.checkLastStep = this.checkLastStep.bind(this);
    this.copyWorkspace = this.copyWorkspace.bind(this);
  }

  /**
   * getStore
   */
  getStore() {
    return this.state.store;
  }

  /**
   * updateStore
   * @param update update
   */
  updateStore(update: CopyWizardStoreUpdateType) {
    this.setState({
      store: {
        ...this.state.store,
        ...update,
      },
    });
  }

  /**
   * copyWorkspace
   */
  copyWorkspace() {
    this.setState({
      locked: true,
    });

    this.props.copyCurrentWorkspace({
      description: this.state.store.description,
      name: this.state.store.name,
      nameExtension: this.state.store.nameExtension,
      beginDate:
        this.state.store.beginDate != null
          ? this.state.store.beginDate.toISOString()
          : null,
      endDate:
        this.state.store.endDate != null
          ? this.state.store.endDate.toISOString()
          : null,
      copyDiscussionAreas: this.state.store.copyDiscussionAreas,
      copyMaterials: this.state.store.copyMaterials,
      copyBackgroundPicture: this.state.store.copyBackgroundPicture,
      /**
       * success
       * @param step step
       * @param workspace workspace
       */
      success: (step, workspace) => {
        this.setState({
          step,
        });
        if (step === "done") {
          this.setState({
            resultingWorkspace: workspace,
          });
        }
      },
      /**
       * fail
       */
      fail: () => {
        this.setState({
          locked: false,
        });
      },
    });
  }

  /**
   * checkLastStep
   * @param steps steps
   * @param step step
   */
  checkLastStep(steps: Array<any>, step: number) {
    if (step === steps.length - 1) {
      this.copyWorkspace();
    }
  }

  /**
   * render
   */
  render() {
    const props = {
      getStore: this.getStore,
      updateStore: this.updateStore,
      i18nOLD: this.props.i18nOLD,
      workspace: this.props.workspace,
      onDone: this.props.onDone,
      resultingWorkspace: this.state.resultingWorkspace,
      step: this.state.step,
    };
    const steps = [
      {
        name: this.props.i18nOLD.text.get(
          "plugin.workspace.management.wizard.step1"
        ),
        component: <Step1 {...props} />,
      },
    ];

    //The reason step 6 is twice is so that the user can review before
    //the action is completed, I guess this stepzilla thing is kind of funny
    steps.push({
      name: this.props.i18nOLD.text.get(
        "plugin.workspace.management.wizard.step6"
      ),
      component: <Step2 {...props} />,
    });
    steps.push({
      name: this.props.i18nOLD.text.get(
        "plugin.workspace.management.wizard.finalStep"
      ),
      component: <Step2 {...props} />,
    });

    // https://github.com/newbreedofgeek/react-stepzilla/blob/master/src/examples/i18nOLD/Example.js
    return (
      <div className="wizard">
        <div className="wizard__container">
          <StepZilla
            stepsNavigation={!this.state.locked}
            showNavigation={!this.state.locked}
            steps={steps}
            showSteps={false}
            preventEnterSubmission={true}
            prevBtnOnLastStep={true}
            nextTextOnFinalActionStep={this.props.i18nOLD.text.get(
              "plugin.workspace.management.copyWorkspace"
            )}
            nextButtonCls="button button--wizard"
            backButtonCls="button button--wizard"
            nextButtonText={this.props.i18nOLD.text.get(
              "plugin.workspace.management.wizard.button.next"
            )}
            backButtonText={this.props.i18nOLD.text.get(
              "plugin.workspace.management.wizard.button.prev"
            )}
            onStepChange={this.checkLastStep.bind(this, steps)}
          />
        </div>
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
    workspace: state.workspaces && state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ copyCurrentWorkspace }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyWizard);
