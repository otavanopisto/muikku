import * as React from "react";
import { useTranslation } from "react-i18next";
import { CopyWizardState } from "../hooks/useCopyWorkspace";

import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";

import { localize } from "~/locales/i18n";
import DatePicker from "react-datepicker";
import CKEditor from "~/components/general/ckeditor";

/**
 * Step1Props
 */
interface FormProps {
  state: CopyWizardState;
  updateState: (updates: Partial<CopyWizardState>) => void;
}

/**
 * Step1
 * @param props props
 */
const Form = (props: FormProps) => {
  const { state, updateState } = props;

  const { t } = useTranslation(["common", "workspace"]);

  /**
   * Handle form change
   * @param name name
   * @param value value
   */
  const handleFormChange = React.useCallback(
    <T extends keyof CopyWizardState>(name: T, value: CopyWizardState[T]) => {
      updateState({
        [name]: value,
      });
    },
    [updateState]
  );

  const copyMaterials =
    state.copyMaterials !== "NO" ? (
      <div className="form__fieldset-content form__fieldset-content--horizontal">
        <div className="form-element form-element--checkbox-radiobutton">
          <input
            type="radio"
            id="copyMaterialsAsClone"
            name="workspace-materials-clone-or-link"
            onChange={(e) =>
              handleFormChange(
                "copyMaterials",
                e.target.value as CopyWizardState["copyMaterials"]
              )
            }
            checked={state.copyMaterials === "CLONE"}
          />
          <label htmlFor="copyMaterialsAsClone">
            {t("labels.copy", { ns: "workspace", context: "materials" })}
          </label>
        </div>
        <div className="form-element form-element--checkbox-radiobutton">
          <input
            type="radio"
            id="copyMaterialsAsLink"
            name="workspace-materials-clone-or-link"
            onChange={(e) =>
              handleFormChange(
                "copyMaterials",
                e.target.value as CopyWizardState["copyMaterials"]
              )
            }
            checked={state.copyMaterials === "LINK"}
          />
          <label htmlFor="copyMaterialsAsLink">
            {t("labels.linkMaterials", { ns: "workspace" })}
          </label>
        </div>
      </div>
    ) : null;

  return (
    <div className="wizard__content">
      <div className="form" role="form">
        <div className="form__row form__row--split">
          <div className="form__subdivision">
            <div className="form__row">
              <div className="form-element form-element--workspace-name">
                <label htmlFor="workspaceName">
                  {t("labels.name", { ns: "workspace" })}
                </label>
                <input
                  id="workspaceName"
                  className="form-element__input form-element__input--workspace-data"
                  value={props.state.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                />
              </div>
            </div>
            <div className="form__row">
              <div className="form-element form-element--workspace-name-extension">
                <label htmlFor="workspaceExtension">
                  {t("labels.nameExtension", { ns: "workspace" })}
                </label>
                <input
                  id="workspaceExtension"
                  className="form-element__input form-element__input--workspace-data"
                  value={state.nameExtension || ""}
                  onChange={(e) =>
                    handleFormChange("nameExtension", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="form__row form__row--split">
              <div className="form-element form-element__copy-workspace-start-date">
                <label htmlFor="workspaceStartDate">
                  {t("labels.begingDate", { ns: "workspace" })}
                </label>
                <DatePicker
                  className="form-element__input form-element__input--workspace-data"
                  id="workspaceStartDate"
                  onChange={(date) => handleFormChange("beginDate", date)}
                  maxDate={state.endDate}
                  locale={outputCorrectDatePickerLocale(localize.language)}
                  selected={state.beginDate}
                  dateFormat="P"
                />
              </div>
              <div className="form-element form-element__copy-workspace-end-date">
                <label htmlFor="workspaceEndDate">
                  {t("labels.endDate", { ns: "workspace" })}
                </label>
                <DatePicker
                  className="form-element__input form-element__input--workspace-data"
                  id="workspaceEndDate"
                  onChange={(date) => handleFormChange("endDate", date)}
                  minDate={state.beginDate}
                  locale={outputCorrectDatePickerLocale(localize.language)}
                  selected={state.endDate}
                  dateFormat="P"
                />
              </div>
            </div>
          </div>
          <div className="form__subdivision">
            <div className="form__row">
              <div className="form-element form-element--copy-workspace-ckeditor">
                <label>{t("labels.content")}</label>
                <CKEditor
                  editorTitle={t("labels.content")}
                  onChange={(value) => handleFormChange("description", value)}
                >
                  {state.description}
                </CKEditor>
              </div>
            </div>
          </div>
        </div>
        <div className="form__row">
          <fieldset className="form__fieldset">
            <legend className="form__legend">
              {t("labels.otherCopySettings", { ns: "workspace" })}
            </legend>
            <div className="form__fieldset-content form__fieldset-content--horizontal">
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  type="checkbox"
                  id="copyMaterials"
                  onChange={(e) =>
                    handleFormChange(
                      "copyMaterials",
                      e.target.checked ? "CLONE" : "NO"
                    )
                  }
                  checked={state.copyMaterials !== "NO"}
                />
                <label htmlFor="copyMaterials">
                  {t("labels.materials", { ns: "workspace" })}
                </label>
              </div>
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  type="checkbox"
                  id="copyBackground"
                  onChange={(e) =>
                    handleFormChange("copyBackgroundPicture", e.target.checked)
                  }
                  checked={state.copyBackgroundPicture}
                />
                <label htmlFor="copyBackground">
                  {t("labels.coverImage", { ns: "workspace" })}
                </label>
              </div>
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  type="checkbox"
                  id="copyDiscussion"
                  onChange={(e) =>
                    handleFormChange("copyDiscussionAreas", e.target.checked)
                  }
                  checked={state.copyDiscussionAreas}
                />
                <label htmlFor="copyDiscussion">
                  {t("labels.discussions", { ns: "workspace" })}
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="form__row">
          <fieldset className="form__fieldset">
            <legend className="form__legend">
              {t("labels.materialCopyType", { ns: "workspace" })}
            </legend>
            {copyMaterials}
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default Form;
