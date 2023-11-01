import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { localize } from "~/locales/i18n";
import { CopyWizardStoreType, CopyWizardStoreUpdateType } from "./";
import { CopyCurrentWorkspaceStepType } from "~/actions/workspaces";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * StepProps
 */
interface StepProps extends WithTranslation {
  workspace: WorkspaceDataType;
  getStore: () => CopyWizardStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateStore: (u: CopyWizardStoreUpdateType) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDone: () => any;
  resultingWorkspace?: WorkspaceDataType;
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
          <label>
            {t("actions.copy", { ns: "workspace", context: "workspace" })}
          </label>
          <p>
            {nameExtension
              ? t("labels.nameWithExtension", {
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
          <label>{t("labels.dates")}</label>
          <p>
            {t("labels.begingDate_copySummary", {
              ns: "workspace",
              beginDate: beginDate
                ? localize.date(beginDate)
                : t("labels.noBeginDate", { ns: "workspace" }),
            })}
          </p>
          <p>
            {t("labels.endDate_copySummary", {
              ns: "workspace",
              endDate: endDate
                ? localize.date(endDate)
                : t("labels.noEndDate", { ns: "workspace" }),
            })}
          </p>
        </div>
        <div className="wizard__summary-row">
          <ul>
            {this.props.getStore().copyDiscussionAreas ? (
              <li>
                {t("labels.copy", {
                  ns: "workspace",
                  context: "discussionsAreas",
                })}
              </li>
            ) : null}
            {copyMaterials !== "NO" ? (
              <li>
                {copyMaterials === "CLONE"
                  ? t("labels.copy", {
                      ns: "workspace",
                      context: "materialsClone",
                    })
                  : t("labels.copy", {
                      ns: "workspace",
                      context: "materialsLink",
                    })}
              </li>
            ) : null}
            {this.props.getStore().copyBackgroundPicture ? (
              <li>
                {t("labels.copy", { ns: "workspace", context: "coverImage" })}
              </li>
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

export default withTranslation(["workspace", "common"])(Step);
