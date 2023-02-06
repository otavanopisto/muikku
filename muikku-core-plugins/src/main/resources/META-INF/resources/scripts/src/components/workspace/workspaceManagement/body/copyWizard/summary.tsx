import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18nOLD";
import { CopyWizardStoreType, CopyWizardStoreUpdateType } from "./";
import { CopyCurrentWorkspaceStepType } from "~/actions/workspaces";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";

/**
 * StepProps
 */
interface StepProps extends WithTranslation {
  workspace: WorkspaceType;
  i18nOLD: i18nType;
  getStore: () => CopyWizardStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateStore: (u: CopyWizardStoreUpdateType) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDone: () => any;
  resultingWorkspace?: WorkspaceType;
  step?: CopyCurrentWorkspaceStepType;
}

/**
 * StepState
 */
interface StepState {}

/**
 * Step
 */
class Step extends React.Component<StepProps, StepState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: StepProps) {
    super(props);
  }
  /**
   * render
   */
  render() {
    const { t } = this.props;

    const copyMaterials = this.props.getStore().copyMaterials;
    const beginDate = this.props.getStore().beginDate;
    const endDate = this.props.getStore().endDate;
    const nameExtension = this.props.getStore().nameExtension;
    return (
      <div className="wizard__content">
        <h2>{t("labels.summary", { ns: "workspace" })}</h2>

        <div className="wizard__summary-row">
          <label>{t("actions.copy_workspace", { ns: "workspace" })}</label>
          <p>
            {nameExtension
              ? t("labels.nameWithExtension_copySummary", {
                  ns: "workspace",
                  workspaceName: this.props.getStore().name,
                  workspaceNameExtension: nameExtension,
                })
              : t("labels.name_copySummary", {
                  ns: "workspace",
                  workspaceName: this.props.getStore().name,
                })}
          </p>
        </div>
        <div className="wizard__summary-row">
          <label>{t("labels.date_other")}</label>
          <p>
            {t("labels.begingDate_copySummary", {
              ns: "workspace",
              beginDate: beginDate
                ? this.props.i18nOLD.time.format(beginDate)
                : t("labels.beginDateEmpty", { ns: "workspace" }),
            })}
          </p>
          <p>
            {t("labels.endDate_copySummary", {
              ns: "workspace",
              endDate: endDate
                ? this.props.i18nOLD.time.format(endDate)
                : t("labels.endDateEmpty", { ns: "workspace" }),
            })}
          </p>
        </div>
        <div className="wizard__summary-row">
          <ul>
            {this.props.getStore().copyDiscussionAreas ? (
              <li>{t("labels.copy_discussionsAreas", { ns: "workspace" })}</li>
            ) : null}
            {copyMaterials !== "NO" ? (
              <li>
                {copyMaterials === "CLONE"
                  ? t("labels.copy_materialsClone", { ns: "workspace" })
                  : t("labels.copy_materialsLink", { ns: "workspace" })}
              </li>
            ) : null}
            {this.props.getStore().copyBackgroundPicture ? (
              <li>{t("labels.copy_coverImage", { ns: "workspace" })}</li>
            ) : null}
          </ul>
        </div>
        {this.props.step === "done" && this.props.resultingWorkspace ? (
          <div className="wizard__summary-row">
            <Button
              className="button button--primary-function-content"
              onClick={this.props.onDone}
            >
              {t("actions.close")}
            </Button>
            <Button
              className="button button--primary-function-content"
              href={`/workspace/${this.props.resultingWorkspace.urlName}`}
            >
              {t("actions.openInMuikku", { ns: "workspace" })}
            </Button>
            <Button
              className="button button--primary-function-content"
              href={this.props.resultingWorkspace.details.externalViewUrl}
              openInNewTab="_blank"
            >
              {t("actions.openInPyramus", { ns: "workspace" })}
            </Button>
          </div>
        ) : null}
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation(["workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(Step)
);
