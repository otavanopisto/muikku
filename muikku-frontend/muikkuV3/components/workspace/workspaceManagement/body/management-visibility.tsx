import * as React from "react";
import { useTranslation } from "react-i18next";
import { WorkspaceAccess } from "~/generated/client";

/**
 * ManagementVisibilityProps
 */
interface ManagementVisibilityProps {
  workspacePublished: boolean;
  workspaceAccess: WorkspaceAccess;
  onWorkspacePublishedChange?: (value: boolean) => void;
  onWorkspaceAccessChange?: (value: WorkspaceAccess) => void;
}

/**
 * ManagementVisibility
 * @param props props
 */
const ManagementVisibility = (props: ManagementVisibilityProps) => {
  const {
    workspacePublished,
    workspaceAccess,
    onWorkspacePublishedChange,
    onWorkspaceAccessChange,
  } = props;

  const { t } = useTranslation(["workspace"]);

  /**
   * Handles published change
   * @param value value
   */
  const handlePublishedChange =
    (value: boolean) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onWorkspacePublishedChange) {
        onWorkspacePublishedChange(value);
      }
    };

  /**
   * Handles access change
   * @param value value
   */
  const handleAccessChange =
    (value: WorkspaceAccess) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onWorkspaceAccessChange) {
        onWorkspaceAccessChange(value);
      }
    };

  return (
    <>
      <h2 className="application-sub-panel__header">
        {t("labels.visibility", { ns: "workspace" })}
      </h2>
      <div className="application-sub-panel__body">
        <div className="form__row form__row--split">
          <div className="form__subdivision form__subdivision--auto-width">
            <div className="form__row">
              <fieldset className="form__fieldset">
                <legend className="form__legend">
                  {t("labels.publicity", { ns: "workspace" })}
                </legend>
                <div className="form__fieldset-content form__fieldset-content--horizontal">
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input
                      id="workspacePublish"
                      name="publish"
                      type="radio"
                      checked={workspacePublished === true}
                      onChange={handlePublishedChange(true)}
                    />
                    <label htmlFor="workspacePublish">
                      {t("labels.workspaces", {
                        ns: "workspace",
                        context: "published",
                      })}
                    </label>
                  </div>
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input
                      id="workspaceUnpublish"
                      name="unpublish"
                      type="radio"
                      checked={workspacePublished === false}
                      onChange={handlePublishedChange(false)}
                    />
                    <label htmlFor="workspaceUnpublish">
                      {t("labels.notPublished", { ns: "workspace" })}
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="form__subdivision form__subdivision--auto-width">
            <div className="form__row">
              <fieldset className="form__fieldset">
                <legend className="form__legend">
                  {t("labels.access", { ns: "workspace" })}
                </legend>
                <div className="form__fieldset-content form__fieldset-content--horizontal">
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input
                      id="workspaceAccessMembers"
                      name="access-members"
                      type="radio"
                      checked={workspaceAccess === "MEMBERS_ONLY"}
                      onChange={handleAccessChange("MEMBERS_ONLY")}
                    />
                    <label htmlFor="workspaceAccessMembers">
                      {t("labels.access", {
                        ns: "workspace",
                        context: "membersOnly",
                      })}
                    </label>
                  </div>
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input
                      id="workspaceAccessLoggedin"
                      name="access-loggedin"
                      type="radio"
                      checked={workspaceAccess === "LOGGED_IN"}
                      onChange={handleAccessChange("LOGGED_IN")}
                    />
                    <label htmlFor="workspaceAccessLoggedin">
                      {t("labels.access", {
                        ns: "workspace",
                        context: "loggedInUsers",
                      })}
                    </label>
                  </div>
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input
                      id="workspaceAccessAnyone"
                      name="access-anyone"
                      type="radio"
                      checked={workspaceAccess === "ANYONE"}
                      onChange={handleAccessChange("ANYONE")}
                    />
                    <label htmlFor="workspaceAccessAnyone">
                      {t("labels.access", {
                        ns: "workspace",
                        context: "anyone",
                      })}
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ManagementVisibilityMemoized = React.memo(ManagementVisibility);
