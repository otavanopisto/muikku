import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { CopyWizardStoreType, CopyWizardStoreUpdateType } from "./";
import DatePicker from "react-datepicker";
import CKEditor from "~/components/general/ckeditor";
import "~/sass/elements/form.scss";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { withTranslation, WithTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";

/**
 * StepProps
 */
interface StepProps extends WithTranslation {
  workspace: WorkspaceDataType;
  getStore: () => CopyWizardStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateStore: (u: CopyWizardStoreUpdateType) => any;
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
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.updateNameExtension = this.updateNameExtension.bind(this);
    this.updateName = this.updateName.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.toggleCopyMaterials = this.toggleCopyMaterials.bind(this);
    this.toggleCopyBackgroundPicture =
      this.toggleCopyBackgroundPicture.bind(this);
    this.toggleCopyDiscussionAreas = this.toggleCopyDiscussionAreas.bind(this);
    this.switchBetweenCloneAndLink = this.switchBetweenCloneAndLink.bind(this);
  }

  /**
   * updateNameExtension
   * @param e e
   */
  updateNameExtension(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.updateStore({
      nameExtension: e.target.value || null,
    });
  }

  /**
   * updateName
   * @param e e
   */
  updateName(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.updateStore({
      name: e.target.value,
    });
  }

  /**
   * updateStartDate
   * @param newDate newDate
   */
  updateStartDate(newDate: Date) {
    this.props.updateStore({
      beginDate: newDate,
    });
  }

  /**
   * updateEndDate
   * @param newDate newDate
   */
  updateEndDate(newDate: Date) {
    this.props.updateStore({
      endDate: newDate,
    });
  }

  /**
   * onDescriptionChange
   * @param text text
   */
  onDescriptionChange(text: string) {
    this.props.updateStore({
      description: text,
    });
  }

  /**
   * toggleCopyMaterials
   */
  toggleCopyMaterials() {
    this.props.updateStore({
      copyMaterials:
        this.props.getStore().copyMaterials === "NO" ? "CLONE" : "NO",
    });
  }

  /**
   * toggleCopyBackgroundPicture
   */
  toggleCopyBackgroundPicture() {
    this.props.updateStore({
      copyBackgroundPicture: !this.props.getStore().copyBackgroundPicture,
    });
  }

  /**
   * toggleCopyDiscussionAreas
   */
  toggleCopyDiscussionAreas() {
    this.props.updateStore({
      copyDiscussionAreas: !this.props.getStore().copyDiscussionAreas,
    });
  }

  /**
   * switchBetweenCloneAndLink
   */
  switchBetweenCloneAndLink() {
    this.props.updateStore({
      copyMaterials:
        this.props.getStore().copyMaterials === "CLONE" ? "LINK" : "CLONE",
    });
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;

    const copyMaterials =
      this.props.getStore().copyMaterials !== "NO" ? (
        <div className="form__fieldset-content form__fieldset-content--horizontal">
          <div className="form-element form-element--checkbox-radiobutton">
            <input
              type="radio"
              id="copyMaterialsAsClone"
              name="workspace-materials-clone-or-link"
              onChange={this.switchBetweenCloneAndLink}
              checked={this.props.getStore().copyMaterials === "CLONE"}
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
              onChange={this.switchBetweenCloneAndLink}
              checked={this.props.getStore().copyMaterials === "LINK"}
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
                    value={this.props.getStore().name}
                    onChange={this.updateName}
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
                    value={this.props.getStore().nameExtension || ""}
                    onChange={this.updateNameExtension}
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
                    onChange={this.updateStartDate}
                    maxDate={this.props.getStore().endDate}
                    locale={outputCorrectDatePickerLocale(localize.language)}
                    selected={this.props.getStore().beginDate}
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
                    onChange={this.updateEndDate}
                    minDate={this.props.getStore().beginDate}
                    locale={outputCorrectDatePickerLocale(localize.language)}
                    selected={this.props.getStore().endDate}
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
                    onChange={this.onDescriptionChange}
                  >
                    {this.props.getStore().description}
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
                    onChange={this.toggleCopyMaterials}
                    checked={this.props.getStore().copyMaterials !== "NO"}
                  />
                  <label htmlFor="copyMaterials">
                    {t("labels.materials", { ns: "workspace" })}
                  </label>
                </div>
                <div className="form-element form-element--checkbox-radiobutton">
                  <input
                    type="checkbox"
                    id="copyBackground"
                    onChange={this.toggleCopyBackgroundPicture}
                    checked={this.props.getStore().copyBackgroundPicture}
                  />
                  <label htmlFor="copyBackground">
                    {t("labels.coverImage", { ns: "workspace" })}
                  </label>
                </div>
                <div className="form-element form-element--checkbox-radiobutton">
                  <input
                    type="checkbox"
                    id="copyDiscussion"
                    onChange={this.toggleCopyDiscussionAreas}
                    checked={this.props.getStore().copyDiscussionAreas}
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
  }
}

export default withTranslation(["workspace", "common"])(Step);
