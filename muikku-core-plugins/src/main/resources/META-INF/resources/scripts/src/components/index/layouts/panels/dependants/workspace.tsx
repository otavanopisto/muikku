import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { UserGuardiansDependantWorkspace } from "~/generated/client";
import { localize } from "~/locales/i18n";
import { useTranslation } from "react-i18next";
/**
 * DependantWorkspaceProps
 */
interface DependantWorkspaceProps {
  workspace: UserGuardiansDependantWorkspace;
}

/**
 * DependantWorkspace component
 * @param props
 * @returns JSX.Element
 */
const DependantWorkspace: React.FC<DependantWorkspaceProps> = (props) => {
  const { workspace } = props;
  const { t } = useTranslation("studies");
  return (
    <div className="item-list__item item-list__item--dependant-workspaces">
      <span className="item-list__icon item-list__icon--dependant-workspaces icon-books"></span>
      <span className="item-list__text-body">
        {`${workspace.name} ${
          workspace.nameExtension ? "(" + workspace.nameExtension + ")" : ""
        }`}
      </span>
      <span>
        <span className="item-list__text-title">
          {t("labels.enrollmentDate")}
        </span>
        <span className="item-list__text-body item-list__text-body--date">
          {localize.date(workspace.enrollmentDate)}
        </span>
      </span>
      {workspace.latestAssessmentRequestDate && (
        <>
          <Dropdown
            openByHover
            content={
              <span>
                {t("content.sent", {
                  context: "evaluationRequest",
                  date: localize.date(workspace.latestAssessmentRequestDate),
                })}
              </span>
            }
          >
            <span className="application-list__indicator-badge application-list__indicator-badge--evaluation-request icon-assessment-pending" />
          </Dropdown>
        </>
      )}
    </div>
  );
};

export default DependantWorkspace;
