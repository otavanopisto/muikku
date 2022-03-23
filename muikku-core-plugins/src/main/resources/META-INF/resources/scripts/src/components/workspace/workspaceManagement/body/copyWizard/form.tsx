import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { CopyWizardStoreType, CopyWizardStoreUpdateType } from "./";
import DatePicker from "react-datepicker";
import CKEditor from "~/components/general/ckeditor";
import "~/sass/elements/form.scss";

/**
 * StepProps
 */
interface StepProps {
  workspace: WorkspaceType;
  i18n: i18nType;
  getStore: () => CopyWizardStoreType;
  updateStore: (u: CopyWizardStoreUpdateType) => any;
}

/**
 * StepState
 */
interface StepState {}

/**
 * Step
 */
export default class Step extends React.Component<StepProps, StepState> {
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
  updateStartDate(newDate: any) {
    this.props.updateStore({
      beginDate: newDate,
    });
  }

  /**
   * updateEndDate
   * @param newDate newDate
   */
  updateEndDate(newDate: any) {
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
    const copyMaterials =
      this.props.getStore().copyMaterials !== "NO" ? (
        <div className="form__row form__row--wizard">
          <div className="form-element form-element--checkbox-radiobutton">
            <input
              type="radio"
              id="copyMaterialsAsClone"
              name="workspace-materials-clone-or-link"
              onChange={this.switchBetweenCloneAndLink}
              checked={this.props.getStore().copyMaterials === "CLONE"}
            />
            <label htmlFor="copyMaterialsAsClone">
              {this.props.i18n.text.get(
                "plugin.workspacecopywizard.workspaceMaterials.copyMaterials.label"
              )}
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
              {this.props.i18n.text.get(
                "plugin.workspacecopywizard.workspaceMaterials.linkMaterials.label"
              )}
            </label>
          </div>
        </div>
      ) : null;

    return (
      <div className="wizard__content form">
        <div className="form__row form__row--wizard">
          <div className="form__subdivision form__subdivision--wizard">
            <div className="form__row form__row--wizard">
              <div className="form-element form-element--workspace-name">
                <label htmlFor="workspaceName">
                  {this.props.i18n.text.get(
                    "plugin.workspacecopywizard.workspaceName.label"
                  )}
                </label>
                <input
                  id="workspaceName"
                  className="form-element__input form-element__input--workspace-data"
                  value={this.props.getStore().name}
                  onChange={this.updateName}
                />
              </div>
            </div>
            <div className="form__row form__row--wizard">
              <div className="form-element form-element--workspace-name-extension">
                <label htmlFor="workspaceExtension">
                  {this.props.i18n.text.get(
                    "plugin.workspacecopywizard.workspaceExtension.label"
                  )}
                </label>
                <input
                  id="workspaceExtension"
                  className="form-element__input form-element__input--workspace-data"
                  value={this.props.getStore().nameExtension || ""}
                  onChange={this.updateNameExtension}
                />
              </div>
            </div>
            <div className="form__row form__row--wizard form__row--wizard-dates">
              <div className="form-element form-element--copy-workspace-start-date">
                <label htmlFor="workspaceStartDate">
                  {this.props.i18n.text.get(
                    "plugin.workspacecopywizard.workspaceStartDate.label"
                  )}
                </label>
                <DatePicker
                  className="form-element__input form-element__input--workspace-data"
                  id="workspaceStartDate"
                  onChange={this.updateStartDate}
                  maxDate={this.props.getStore().endDate}
                  locale={this.props.i18n.time.getLocale()}
                  selected={this.props.getStore().beginDate}
                />
              </div>
              <div className="form-element form-element--copy-workspace-end-date">
                <label htmlFor="workspaceEndDate">
                  {this.props.i18n.text.get(
                    "plugin.workspacecopywizard.workspaceEndDate.label"
                  )}
                </label>
                <DatePicker
                  className="form-element__input form-element__input--workspace-data"
                  id="workspaceEndDate"
                  onChange={this.updateEndDate}
                  minDate={this.props.getStore().beginDate}
                  locale={this.props.i18n.time.getLocale()}
                  selected={this.props.getStore().endDate}
                />
              </div>
            </div>
          </div>
          <div className="form__subdivision form__subdivision--wizard">
            <div className="form__row form__row--wizard">
              <div className="form-element form-element--copy-workspace-ckeditor">
                <label>
                  {this.props.i18n.text.get(
                    "plugin.workspacecopywizard.workspaceDescription.label"
                  )}
                </label>
                <CKEditor
                  editorTitle={this.props.i18n.text.get(
                    "plugin.workspacecopywizard.workspaceDescription.label"
                  )}
                  onChange={this.onDescriptionChange}
                >
                  {this.props.getStore().description}
                </CKEditor>
              </div>
            </div>
          </div>
        </div>
        <fieldset>
          <legend className="form__fieldset-header">
            {this.props.i18n.text.get(
              "plugin.workspacecopywizard.workspaceOtherSettings.label"
            )}
          </legend>
          <div className="form__row form__row--wizard">
            <div className="form-element form-element--checkbox-radiobutton">
              <input
                type="checkbox"
                id="copyMaterials"
                onChange={this.toggleCopyMaterials}
                checked={this.props.getStore().copyMaterials !== "NO"}
              />
              <label htmlFor="copyMaterials">
                {this.props.i18n.text.get(
                  "plugin.workspacecopywizard.workspaceMaterials.label"
                )}
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
                {this.props.i18n.text.get(
                  "plugin.workspacecopywizard.workspaceFiles.label"
                )}
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
                {this.props.i18n.text.get(
                  "plugin.workspacecopywizard.workspaceDiscussionsAreas.label"
                )}
              </label>
            </div>
          </div>
          {copyMaterials}
        </fieldset>
      </div>
    );
  }
}
