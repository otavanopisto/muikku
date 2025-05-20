import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { localize } from "~/locales/i18n";
import { CopyWizardState } from "./hooks/useCopyWorkspace";
import { CopyCurrentWorkspaceStepType } from "~/actions/workspaces";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";

/**
 * StepProps
 */
interface StepProps {
  workspace: WorkspaceDataType;
  state: CopyWizardState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateState: (u: Partial<CopyWizardState>) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDone: () => any;
  resultingWorkspace?: WorkspaceDataType;
  step?: CopyCurrentWorkspaceStepType;
}

/**
 * Step
 * @param props props
 */
const Step: React.FC<StepProps> = (props) => {
  const { t } = useTranslation(["workspace", "common"]);

  const copyMaterials = props.state.copyMaterials;
  const beginDate = props.state.beginDate;
  const endDate = props.state.endDate;
  const nameExtension = props.state.nameExtension;

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
                workspaceName: props.state.name,
                workspaceNameExtension: nameExtension,
              })
            : t("labels.name_copySummary", {
                ns: "workspace",
                workspaceName: props.state.name,
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
          {props.state.copyDiscussionAreas ? (
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
          {props.state.copyBackgroundPicture ? (
            <li>
              {t("labels.copy", { ns: "workspace", context: "coverImage" })}
            </li>
          ) : null}
        </ul>
      </div>
      {props.step === "done" && props.resultingWorkspace ? (
        <div className="wizard__summary-row">
          <Button
            className="button button--primary-function-content"
            onClick={props.onDone}
          >
            {t("actions.close")}
          </Button>
          <Button
            className="button button--primary-function-content"
            href={`/workspace/${props.resultingWorkspace.urlName}`}
          >
            {t("actions.openInMuikku", { ns: "workspace" })}
          </Button>
          <Button
            className="button button--primary-function-content"
            href={props.resultingWorkspace.details.externalViewUrl}
            openInNewTab="_blank"
          >
            {t("actions.openInPyramus", { ns: "workspace" })}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Step;
