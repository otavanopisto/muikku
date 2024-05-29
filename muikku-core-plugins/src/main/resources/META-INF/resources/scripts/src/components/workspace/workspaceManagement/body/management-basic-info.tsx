import * as React from "react";
import { useTranslation } from "react-i18next";
import CKEditor from "~/components/general/ckeditor";
import Link from "~/components/general/link";
import { languageOptions } from "~/reducers/workspaces";
import CopyWizardDialog from "../dialogs/copy-wizard";

/**
 * WorkspaceSignupGroups
 */
interface ManagementBasicInfoProps {
  workspaceName: string;
  workspaceLanguage: string;
  workspaceDescription: string;

  externalViewUrl?: string;

  onWorkspaceNameChange?: (workspaceName: string) => void;
  onWorkspaceLanguageChange?: (workspaceLanguage: string) => void;
  onWorkspaceDescriptionChange?: (workspaceDescription: string) => void;
}

/**
 * WorkspaceSignupGroup
 * @param props props
 */
const ManagementBasicInfo = (props: ManagementBasicInfoProps) => {
  const {
    workspaceName,
    workspaceLanguage,
    workspaceDescription,
    externalViewUrl,
    onWorkspaceNameChange,
    onWorkspaceLanguageChange,
    onWorkspaceDescriptionChange,
  } = props;

  const { t } = useTranslation(["workspace"]);

  /**
   * Handles workspace name change
   * @param e e
   */
  const handleWorkspaceNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (onWorkspaceNameChange) {
      onWorkspaceNameChange(e.target.value);
    }
  };

  /**
   * Handles language change
   * @param e e
   */
  const handleWorkspaceLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (onWorkspaceLanguageChange) {
      onWorkspaceLanguageChange(e.target.value);
    }
  };

  /**
   * Handles description change
   * @param text text
   */
  const handleDescriptionChange = (text: string) => {
    if (onWorkspaceDescriptionChange) {
      onWorkspaceDescriptionChange(text);
    }
  };

  return (
    <>
      <h2 className="application-sub-panel__header">
        {t("labels.basicInfo", { ns: "workspace" })}
      </h2>
      <div className="application-sub-panel__body">
        <div className="form__row form__row--split">
          <div className="form__subdivision">
            <div className="form__row">
              <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management">
                <label htmlFor="wokspaceName">{t("labels.name")}</label>
                <input
                  id="wokspaceName"
                  name="wokspace-name"
                  type="text"
                  className="form-element__input form-element__input--workspace-name"
                  value={workspaceName || ""}
                  onChange={handleWorkspaceNameChange}
                />
                <div className="application-sub-panel__item-actions">
                  <Link
                    href={externalViewUrl}
                    openInNewTab="_blank"
                    className="link link--workspace-management"
                  >
                    {t("labels.showInPyramus", { ns: "workspace" })}
                  </Link>
                  <CopyWizardDialog>
                    <Link className="link link--workspace-management">
                      {t("labels.copy", {
                        ns: "workspace",
                        context: "workspace",
                      })}
                    </Link>
                  </CopyWizardDialog>
                </div>
              </div>
            </div>
            <div className="form__row">
              <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management">
                <label htmlFor="workspaceLanguage">
                  {t("labels.localeCode", { ns: "workspace" })}
                </label>
                <select
                  id="workspaceLanguage"
                  className="form-element__select"
                  value={workspaceLanguage}
                  onChange={handleWorkspaceLanguageChange}
                >
                  {languageOptions.map((language) => (
                    <option key={language} value={language}>
                      {t("labels.language", {
                        ns: "workspace",
                        context: language,
                      })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="form__subdivision">
            <div className="form__row">
              <div className="application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-description form-element">
                <label>{t("labels.description")}</label>
                <CKEditor
                  editorTitle={t("wcag.workspaceDescription", {
                    ns: "workspace",
                  })}
                  onChange={handleDescriptionChange}
                >
                  {workspaceDescription}
                </CKEditor>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ManagementBasicInfoMemoized = React.memo(ManagementBasicInfo);
