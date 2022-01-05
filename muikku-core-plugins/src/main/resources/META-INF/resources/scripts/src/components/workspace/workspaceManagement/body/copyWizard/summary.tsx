import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { CopyWizardStoreType, CopyWizardStoreUpdateType } from "./";
import { CopyCurrentWorkspaceStepType } from "~/actions/workspaces";
import Button from "~/components/general/button";

interface StepProps {
  workspace: WorkspaceType;
  i18n: i18nType;
  getStore: () => CopyWizardStoreType;
  updateStore: (u: CopyWizardStoreUpdateType) => any;
  onDone: () => any;
  resultingWorkspace?: WorkspaceType;
  step?: CopyCurrentWorkspaceStepType;
}

interface StepState {}

export default class Step extends React.Component<StepProps, StepState> {
  constructor(props: StepProps) {
    super(props);
  }
  render() {
    const copyMaterials = this.props.getStore().copyMaterials;
    const beginDate = this.props.getStore().beginDate;
    const endDate = this.props.getStore().endDate;
    const nameExtension = this.props.getStore().nameExtension;
    return (
      <div className="wizard__content">
        <h2>
          {this.props.i18n.text.get(
            "plugin.workspacecopywizard.summaryPage.title",
          )}
        </h2>

        <div className="wizard__summary-row">
          <label>
            {this.props.i18n.text.get(
              "plugin.workspacecopywizard.doCopyButton.label",
            )}
          </label>
          <p>
            {this.props.i18n.text.get(
              nameExtension
                ? "plugin.workspacecopywizard.summarySteps.copyWorkspaceName"
                : "plugin.workspacecopywizard.summarySteps.copyWorkspaceNameWithExtension",
              this.props.getStore().name,
              nameExtension,
            )}
          </p>
        </div>
        <div className="wizard__summary-row">
          <label>
            {this.props.i18n.text.get("plugin.workspacecopywizard.dates.title")}
          </label>
          <p>
            {this.props.i18n.text.get(
              "plugin.workspacecopywizard.summarySteps.changeDatesBeginDate",
              beginDate
                ? this.props.i18n.time.format(beginDate)
                : this.props.i18n.text.get(
                    "plugin.workspacecopywizard.workspaceStartDate.empty.label",
                  ),
            )}
          </p>
          <p>
            {this.props.i18n.text.get(
              "plugin.workspacecopywizard.summarySteps.changeDatesEndDate",
              endDate
                ? this.props.i18n.time.format(endDate)
                : this.props.i18n.text.get(
                    "plugin.workspacecopywizard.workspaceEndDate.empty.label",
                  ),
            )}
          </p>
        </div>
        <div className="wizard__summary-row">
          <ul>
            {this.props.getStore().copyDiscussionAreas ? (
              <li>
                {this.props.i18n.text.get(
                  "plugin.workspacecopywizard.summarySteps.copyDiscussionAreas",
                )}
              </li>
            ) : null}
            {copyMaterials !== "NO" ? (
              <li>
                {this.props.i18n.text.get(
                  copyMaterials === "CLONE"
                    ? "plugin.workspacecopywizard.summarySteps.copyMaterials"
                    : "plugin.workspacecopywizard.summarySteps.copyMaterialsLink",
                )}
              </li>
            ) : null}
            {this.props.getStore().copyBackgroundPicture ? (
              <li>
                {this.props.i18n.text.get(
                  "plugin.workspacecopywizard.summarySteps.copyFiles",
                )}
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
              {this.props.i18n.text.get(
                "plugin.workspacecopywizard.closeWizardButton.label",
              )}
            </Button>
            <Button
              className="button button--primary-function-content"
              href={`/workspace/${this.props.resultingWorkspace.urlName}`}
            >
              {this.props.i18n.text.get(
                "plugin.workspacecopywizard.gotToWorkspaceMuikkuButton.label",
              )}
            </Button>
            <Button
              className="button button--primary-function-content"
              href={this.props.resultingWorkspace.details.externalViewUrl}
              openInNewTab="_blank"
            >
              {this.props.i18n.text.get(
                "plugin.workspacecopywizard.gotToWorkspacePyramusButton.label",
              )}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}
