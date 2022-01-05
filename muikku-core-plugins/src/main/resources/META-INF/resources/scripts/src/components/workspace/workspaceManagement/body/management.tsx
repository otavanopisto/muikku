import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType, WorkspaceChatStatusType, WorkspaceAccessType, WorkspaceTypeType, WorkspaceProducerType, WorkspaceUpdateType, WorkspaceDetailsType, WorkspacePermissionsType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import Button, { ButtonPill } from "~/components/general/button";
import Link from "~/components/general/link";
import moment from "~/lib/moment";
import DatePicker from "react-datepicker";
import CKEditor from "~/components/general/ckeditor";
import equals = require("deep-equal");
import CopyWizardDialog from "../dialogs/copy-wizard";
import ApplicationPanel from '~/components/general/application-panel/application-panel';
import '~/sass/elements/panel.scss';
import '~/sass/elements/item-list.scss';
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/change-image.scss';
import '~/sass/elements/wcag.scss';
import { LicenseSelector } from "~/components/general/license-selector";
import UploadImageDialog from '../dialogs/upload-image';
import DeleteImageDialog from '../dialogs/delete-image';
import AddProducer from '~/components/general/add-producer';
import {
  updateWorkspace, UpdateWorkspaceTriggerType,
  updateWorkspaceProducersForCurrentWorkspace, UpdateWorkspaceProducersForCurrentWorkspaceTriggerType,
  updateCurrentWorkspaceImagesB64, UpdateCurrentWorkspaceImagesB64TriggerType,
  updateWorkspaceDetailsForCurrentWorkspace, UpdateWorkspaceDetailsForCurrentWorkspaceTriggerType,
  UpdateCurrentWorkspaceUserGroupPermissionTriggerType
} from "~/actions/workspaces";
import { bindActionCreators } from "redux";
import { displayNotification, DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { filterMatch, filterHighlight } from "~/util/modifiers";
import { SearchFormElement } from '~/components/general/form-element';

const PERMISSIONS_TO_EXTRACT = ["WORKSPACE_SIGNUP"];

interface ManagementPanelProps {
  status: StatusType,
  workspace: WorkspaceType,
  i18n: i18nType,
  workspaceTypes: Array<WorkspaceTypeType>,
  updateWorkspace: UpdateWorkspaceTriggerType,
  updateWorkspaceProducersForCurrentWorkspace: UpdateWorkspaceProducersForCurrentWorkspaceTriggerType,
  updateCurrentWorkspaceImagesB64: UpdateCurrentWorkspaceImagesB64TriggerType,
  updateWorkspaceDetailsForCurrentWorkspace: UpdateWorkspaceDetailsForCurrentWorkspaceTriggerType,
  displayNotification: DisplayNotificationTriggerType
}

interface ManagementPanelState {
  workspaceName: string,
  workspacePublished: boolean,
  workspaceAccess: WorkspaceAccessType,
  workspaceExtension: string,
  workspaceType: string,
  workspaceStartDate: any,
  workspaceEndDate: any,
  workspaceProducers: Array<WorkspaceProducerType>,
  workspaceDescription: string,
  workspaceLicense: string,
  workspaceHasCustomImage: boolean,
  workspacePermissions: Array<WorkspacePermissionsType>,
  workspaceChatStatus: WorkspaceChatStatusType,
  workspaceUsergroupNameFilter: string,
  currentWorkspaceProducerInputValue: string,
  newWorkspaceImageSrc?: string,
  newWorkspaceImageFile?: File,
  newWorkspaceImageB64?: string,
  newWorkspaceImageCombo?: {
    file?: File,
    originalB64?: string,
    croppedB64: string
  },
  isImageDialogOpen: boolean,
  isDeleteImageDialogOpen: boolean,
  locked: boolean,
}

class ManagementPanel extends React.Component<ManagementPanelProps, ManagementPanelState> {
  constructor(props: ManagementPanelProps) {
    super(props);
    this.state = {
      workspaceName: props.workspace ? props.workspace.name : null,
      workspacePublished: props.workspace ? props.workspace.published : null,
      workspaceAccess: props.workspace ? props.workspace.access : null,
      workspaceExtension: props.workspace ? props.workspace.nameExtension : null,
      workspaceType: props.workspace && props.workspace.details ? props.workspace.details.typeId : null,
      workspaceStartDate: props.workspace && props.workspace.details ? moment(props.workspace.details.beginDate) : null,
      workspaceEndDate: props.workspace && props.workspace.details ? moment(props.workspace.details.endDate) : null,
      workspaceProducers: props.workspace && props.workspace.producers ? props.workspace.producers : null,
      workspaceDescription: props.workspace ? props.workspace.description || "" : "",
      workspaceLicense: props.workspace ? props.workspace.materialDefaultLicense : "",
      workspaceHasCustomImage: props.workspace ? props.workspace.hasCustomImage : false,
      workspaceChatStatus: props.workspace && props.status && props.status.permissions.CHAT_AVAILABLE ? props.workspace.chatStatus : null,
      workspacePermissions: props.workspace && props.workspace.permissions ? props.workspace.permissions : [],
      workspaceUsergroupNameFilter: "",
      currentWorkspaceProducerInputValue: "",
      isDeleteImageDialogOpen: false,
      isImageDialogOpen: false,
      locked: false
    }

    this.updateWorkspaceName = this.updateWorkspaceName.bind(this);
    this.setWorkspacePublishedTo = this.setWorkspacePublishedTo.bind(this);
    this.setWorkspaceAccessTo = this.setWorkspaceAccessTo.bind(this);
    this.updateWorkspaceType = this.updateWorkspaceType.bind(this);
    this.setWorkspaceChatTo = this.setWorkspaceChatTo.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.updateWorkspaceExtension = this.updateWorkspaceExtension.bind(this);
    this.updateLicense = this.updateLicense.bind(this);
    this.removeCustomImage = this.removeCustomImage.bind(this);
    this.readNewImage = this.readNewImage.bind(this);
    this.acceptNewImage = this.acceptNewImage.bind(this);
    this.imageDeleted = this.imageDeleted.bind(this);
    this.editCurrentImage = this.editCurrentImage.bind(this);
    this.updateCurrentWorkspaceProducerInputValue = this.updateCurrentWorkspaceProducerInputValue.bind(this);
    this.addProducer = this.addProducer.bind(this);
    this.removeProducer = this.removeProducer.bind(this);
    this.checkIfEnterKeyIsPressedAndAddProducer = this.checkIfEnterKeyIsPressedAndAddProducer.bind(this);
    this.togglePermissionIn = this.togglePermissionIn.bind(this);
    this.updateWorkspaceUsergroupNameFilter = this.updateWorkspaceUsergroupNameFilter.bind(this);
    this.save = this.save.bind(this);
  }
  componentWillReceiveProps(nextProps: ManagementPanelProps) {
    this.setState({
      workspaceName: nextProps.workspace ? nextProps.workspace.name : null,
      workspacePublished: nextProps.workspace ? nextProps.workspace.published : null,
      workspaceAccess: nextProps.workspace ? nextProps.workspace.access : null,
      workspaceExtension: nextProps.workspace ? nextProps.workspace.nameExtension : null,
      workspaceType: nextProps.workspace && nextProps.workspace.details ? nextProps.workspace.details.typeId : null,
      workspaceStartDate: nextProps.workspace && nextProps.workspace.details ? nextProps.workspace.details.beginDate != null ? moment(nextProps.workspace.details.beginDate) : null : null,
      workspaceEndDate: nextProps.workspace && nextProps.workspace.details ? nextProps.workspace.details.endDate != null ? moment(nextProps.workspace.details.endDate) : null : null,
      workspaceProducers: nextProps.workspace && nextProps.workspace.producers ? nextProps.workspace.producers : null,
      workspaceLicense: nextProps.workspace ? nextProps.workspace.materialDefaultLicense : "",
      workspaceDescription: nextProps.workspace ? nextProps.workspace.description || "" : "",
      workspaceHasCustomImage: nextProps.workspace ? nextProps.workspace.hasCustomImage : false,
      workspaceChatStatus: nextProps.workspace ? nextProps.workspace.chatStatus : null,
      workspacePermissions: nextProps.workspace && nextProps.workspace.permissions ? nextProps.workspace.permissions : [],
    });

  }
  updateWorkspaceName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      workspaceName: e.target.value
    });
  }
  setWorkspacePublishedTo(value: boolean) {
    this.setState({
      workspacePublished: value
    });
  }
  setWorkspaceChatTo(value: WorkspaceChatStatusType) {
    this.setState({
      workspaceChatStatus: value
    });
  }
  setWorkspaceAccessTo(value: WorkspaceAccessType) {
    this.setState({
      workspaceAccess: value
    });
  }
  updateWorkspaceExtension(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      workspaceExtension: e.target.value
    });
  }
  updateWorkspaceType(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      workspaceType: e.target.value
    });
  }
  updateStartDate(newDate: any) {
    this.setState({
      workspaceStartDate: newDate
    });
  }
  updateEndDate(newDate: any) {
    this.setState({
      workspaceEndDate: newDate
    });
  }
  updateCurrentWorkspaceProducerInputValue(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      currentWorkspaceProducerInputValue: e.target.value
    });
  }
  updateWorkspaceUsergroupNameFilter(query: string) {
    this.setState({
      workspaceUsergroupNameFilter: query
    });
  }

  checkIfEnterKeyIsPressedAndAddProducer(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode == 13) {
      this.addProducer(this.state.currentWorkspaceProducerInputValue);
    }
  }

  addProducer(name: string) {
    this.setState({
      currentWorkspaceProducerInputValue: "",
      workspaceProducers: [...this.state.workspaceProducers, {
        name
      }]
    });
  }
  removeProducer(index: number) {
    this.setState({
      workspaceProducers: this.state.workspaceProducers.filter((p, i) => i !== index)
    });
  }
  onDescriptionChange(text: string) {
    this.setState({
      workspaceDescription: text
    });
  }
  updateLicense(newLicense: string) {
    this.setState({
      workspaceLicense: newLicense
    });
  }

  removeCustomImage() {
    this.setState({
      isDeleteImageDialogOpen: true,
    });
  }

  readNewImage(e: React.ChangeEvent<HTMLInputElement>) {
    let file = e.target.files[0];
    let reader = new FileReader();

    e.target.value = "";

    reader.addEventListener("load", () => {
      this.setState({
        newWorkspaceImageB64: String(reader.result),
        newWorkspaceImageFile: file,
        isImageDialogOpen: true,
        newWorkspaceImageSrc: null
      })
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  editCurrentImage() {
    // let imageSrc = this.state.newWorkspaceImageCombo && this.state.newWorkspaceImageCombo.originalB64 ? this.state.newWorkspaceImageCombo.originalB64: `/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-original`;

    if (this.state.newWorkspaceImageCombo) {
      this.setState({
        newWorkspaceImageSrc: this.state.newWorkspaceImageCombo.originalB64,
        isImageDialogOpen: true,
        newWorkspaceImageB64: this.state.newWorkspaceImageCombo.originalB64,
        newWorkspaceImageFile: this.state.newWorkspaceImageCombo.file
      });
    } else if (this.props.workspace.hasCustomImage) {
      this.setState({
        newWorkspaceImageSrc: `/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-original`,
        isImageDialogOpen: true,
        newWorkspaceImageB64: null,
        newWorkspaceImageFile: null
      });
    }
  }
  imageDeleted() {
    this.setState({
      newWorkspaceImageCombo: null,
      workspaceHasCustomImage: false
    });
  }

  acceptNewImage(croppedB64: string, originalB64?: string, file?: File) {
    this.setState({
      workspaceHasCustomImage: true,
      newWorkspaceImageCombo: {
        file,
        originalB64,
        croppedB64
      }
    });
  }
  togglePermissionIn(permission: WorkspacePermissionsType, valueToToggle: string) {
    this.setState({
      workspacePermissions: this.state.workspacePermissions.map((pte) => {
        if (pte.userGroupEntityId === permission.userGroupEntityId) {
          const newPermission = { ...permission };
          newPermission.canSignup = !newPermission.canSignup;
          return newPermission;
        }
        return pte;
      })
    });
  }
  saveImage(croppedB64: string, originalB64?: string, file?: File) {

    this.props.updateCurrentWorkspaceImagesB64({
      originalB64: originalB64,
      croppedB64: croppedB64,
      success: () => {
        this.props.displayNotification(this.props.i18n.text.get("plugin.workspace.management.notification.coverImage.saved"), "success");
      },
    });

    this.setState({
      workspaceHasCustomImage: true,
      newWorkspaceImageCombo: {
        file,
        originalB64,
        croppedB64
      }
    });
  }
  save() {
    this.setState({
      locked: true
    });

    let payload: WorkspaceUpdateType = {};
    let workspaceUpdate: WorkspaceUpdateType = {
      name: this.state.workspaceName,
      published: this.state.workspacePublished,
      access: this.state.workspaceAccess,
      nameExtension: this.state.workspaceExtension,
      materialDefaultLicense: this.state.workspaceLicense,
      description: this.state.workspaceDescription,
      hasCustomImage: this.state.workspaceHasCustomImage,
    }
    let currentWorkspaceAsUpdate: WorkspaceUpdateType = {
      name: this.props.workspace.name,
      published: this.props.workspace.published,
      access: this.props.workspace.access,
      nameExtension: this.props.workspace.nameExtension,
      materialDefaultLicense: this.props.workspace.materialDefaultLicense,
      description: this.props.workspace.description,
      hasCustomImage: this.props.workspace.hasCustomImage,
    }

    if (!equals(workspaceUpdate, currentWorkspaceAsUpdate)) {
      payload = Object.assign(workspaceUpdate, payload);
    }

    let workspaceMaterialProducers = this.state.workspaceProducers;

    if (!equals(workspaceMaterialProducers, this.props.workspace.producers)) {
      payload = Object.assign({ producers: workspaceMaterialProducers }, payload);
    }

    // Chat
    let workspaceChatStatus = this.state.workspaceChatStatus;
    let currentWorkspaceChatStatus = this.props.workspace.chatStatus;

    if (!equals(workspaceChatStatus, currentWorkspaceChatStatus)) {
      payload = Object.assign({ chatStatus: workspaceChatStatus }, payload);
    }

    let workspaceDetails: WorkspaceDetailsType = {
      externalViewUrl: this.props.workspace.details.externalViewUrl,
      typeId: this.state.workspaceType,
      beginDate: this.state.workspaceStartDate ? this.state.workspaceStartDate.toISOString() : null,
      endDate: this.state.workspaceEndDate ? this.state.workspaceEndDate.toISOString() : null,
      rootFolderId: this.props.workspace.details.rootFolderId,
      helpFolderId: this.props.workspace.details.helpFolderId,
      indexFolderId: this.props.workspace.details.indexFolderId,
    }

    let currentWorkspaceAsDetails: WorkspaceDetailsType = {
      externalViewUrl: this.props.workspace.details.externalViewUrl,
      typeId: this.props.workspace.details.typeId,
      beginDate: moment(this.props.workspace.details.beginDate).toISOString(),
      endDate: moment(this.props.workspace.details.endDate).toISOString(),
      rootFolderId: this.props.workspace.details.rootFolderId,
      helpFolderId: this.props.workspace.details.helpFolderId,
      indexFolderId: this.props.workspace.details.indexFolderId,
    }

    if (!equals(workspaceDetails, currentWorkspaceAsDetails)) {
      payload = Object.assign({ details: workspaceDetails }, payload);
    }

    if (!equals(this.props.workspace.permissions, this.state.workspacePermissions)) {
      let permissionsArray: WorkspacePermissionsType[] = [];

      this.state.workspacePermissions.forEach((permission) => {
        const originalPermission = this.props.workspace.permissions.find(p => p.userGroupEntityId === permission.userGroupEntityId);
        if (!equals(originalPermission, permission)) {
          permissionsArray.push(permission);
        }
      });
      payload = Object.assign({ permissions: permissionsArray }, payload);
    }

    this.props.updateWorkspace({
      workspace: this.props.workspace,
      update: payload,
      success: () => {
        this.props.displayNotification(this.props.i18n.text.get("plugin.workspace.management.notification.save.successful"), "success");
        this.setState({
          locked: false
        });
      },
      fail: () => {
        this.setState({
          locked: false
        });
      }
    });
  }

  render() {
    let actualBackgroundSRC = this.state.workspaceHasCustomImage ?
      `/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-cropped` :
      "/gfx/workspace-default-header.jpg";
    if (this.state.newWorkspaceImageCombo) {
      actualBackgroundSRC = this.state.newWorkspaceImageCombo.croppedB64;
    }

    return (<div className="application-panel-wrapper">
      <ApplicationPanel modifier="workspace-management" title={this.props.i18n.text.get("plugin.workspace.management.pageTitle")}>
        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <h2 className="application-sub-panel__header application-sub-panel__header--workspace-settings">{this.props.i18n.text.get("plugin.workspace.management.title.basicInfo")}</h2>
          <div className="application-sub-panel__body application-sub-panel__body--workspace-settings">
            <div className="application-sub-panel__item-split-container">
              <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management">
                <label htmlFor="wokspaceName" className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.workspace.management.title.basicInfo.name")}</label>
                <input id="wokspaceName" name="wokspace-name" type="text" className="form-element__input form-element__input--workspace-name"
                  value={this.state.workspaceName || ""} onChange={this.updateWorkspaceName} />
                <div className="application-sub-panel__item-actions">
                  <Link href={this.props.workspace && this.props.workspace.details && this.props.workspace.details.externalViewUrl}
                    openInNewTab="_blank"
                    className="link link--workspace-management">{this.props.i18n.text.get("plugin.workspace.management.viewInPyramus")}</Link>
                  <CopyWizardDialog>
                    <Link className="link link--workspace-management">{this.props.i18n.text.get("plugin.workspace.management.copyWorkspace")}</Link>
                  </CopyWizardDialog>
                </div>
              </div>
            </div>
            <div className="application-sub-panel__item-split-container">
              <div className="application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-description">
                <label className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.workspace.management.title.basicInfo.description")}</label>
                <CKEditor editorTitle={this.props.i18n.text.get("plugin.wcag.workspaceDescription.label")} onChange={this.onDescriptionChange}>{this.state.workspaceDescription}</CKEditor>
              </div>
            </div>
          </div>
        </section>
        <section className="application-sub-panel application-sub-panel--workspace-settings application-sub-panel--workspace-image-settings">
          <h2 className="application-sub-panel__header application-sub-panel__header--workspace-settings application-sub-panel__header--workspace-image-settings">{this.props.i18n.text.get("plugin.workspace.management.imageSectionTitle")}</h2>
          <div className="application-sub-panel__body application-sub-panel__body--workspace-settings">
            <div className="change-image">
              <div className="change-image__container change-image__container--workspace" style={{ backgroundImage: `url("${actualBackgroundSRC}")`, backgroundSize: `cover` }}>
                <label className="visually-hidden" htmlFor="workspaceImage">{this.props.i18n.text.get("plugin.wcag.workspaceImage.label")}</label>
                <input id="workspaceImage" name="file" type="file" accept="image/*" onChange={this.readNewImage} />
                {this.state.workspaceHasCustomImage ?
                  <div className="change-image__actions">
                    <Button buttonModifiers="change-image-edit button--change-image-workspace" onClick={this.editCurrentImage}>
                      <span className="icon icon-pencil" />
                      {this.props.i18n.text.get("plugin.profile.editImage")}
                    </Button>
                    <Button buttonModifiers="change-image-delete button--change-image-workspace" onClick={this.removeCustomImage}>
                      <span className="icon icon-trash" />
                      {this.props.i18n.text.get("plugin.profile.deleteImage")}
                    </Button>
                  </div> : <div className="change-image__default-content">{this.props.i18n.text.get("plugin.workspace.management.changeImage.defaultImageInfo")}</div>}
              </div>
              <DeleteImageDialog isOpen={this.state.isDeleteImageDialogOpen} onDelete={this.imageDeleted} onClose={() => this.setState({ isDeleteImageDialogOpen: false })} />
              <UploadImageDialog isOpen={this.state.isImageDialogOpen}
                b64={this.state.newWorkspaceImageB64} file={this.state.newWorkspaceImageFile}
                onClose={() => this.setState({ isImageDialogOpen: false })} src={this.state.newWorkspaceImageSrc}
                onImageChange={this.acceptNewImage} />
            </div>
          </div>
        </section>
        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <h2 className="application-sub-panel__header application-sub-panel__header--workspace-settings">{this.props.i18n.text.get("plugin.workspace.management.workspaceVisibilitySectionTitle")}</h2>
          <div className="application-sub-panel__body application-sub-panel__body--workspace-settings">
            <div className="application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-publicity">
              <fieldset>
                <legend className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.workspace.management.settings.publicity")}</legend>
                <div className="application-sub-panel__item-data application-sub-panel__item-data--workspace-management">
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input id="workspacePublish" name="publish" type="radio"
                      checked={this.state.workspacePublished === true}
                      onChange={this.setWorkspacePublishedTo.bind(this, true)} />
                    <label htmlFor="workspacePublish">{this.props.i18n.text.get("plugin.workspace.management.settings.publicity.publish")}</label>
                  </div>
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input id="workspaceUnpublish" name="unpublish" type="radio"
                      checked={this.state.workspacePublished === false}
                      onChange={this.setWorkspacePublishedTo.bind(this, false)} />
                    <label htmlFor="workspaceUnpublish">{this.props.i18n.text.get("plugin.workspace.management.settings.publicity.unpublish")}</label>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-access">
              <fieldset>
                <legend className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.workspace.management.settings.access")}</legend>
                <div className="application-sub-panel__item-data application-sub-panel__item-data--workspace-management">
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input id="workspaceAccessMembers" name="access-members" type="radio"
                      checked={this.state.workspaceAccess === "MEMBERS_ONLY"}
                      onChange={this.setWorkspaceAccessTo.bind(this, "MEMBERS_ONLY")} />
                    <label htmlFor="workspaceAccessMembers">{this.props.i18n.text.get("plugin.workspace.management.settings.access.membersOnly")}</label>
                  </div>
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input id="workspaceAccessLoggedin" name="access-loggedin" type="radio"
                      checked={this.state.workspaceAccess === "LOGGED_IN"}
                      onChange={this.setWorkspaceAccessTo.bind(this, "LOGGED_IN")} />
                    <label htmlFor="workspaceAccessLoggedin">{this.props.i18n.text.get("plugin.workspace.management.settings.access.loggedIn")}</label>
                  </div>
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input id="workspaceAccessAnyone" name="access-anyone" type="radio"
                      checked={this.state.workspaceAccess === "ANYONE"}
                      onChange={this.setWorkspaceAccessTo.bind(this, "ANYONE")} />
                    <label htmlFor="workspaceAccessAnyone">{this.props.i18n.text.get("plugin.workspace.management.settings.access.anyone")}</label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </section>
        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <h2 className="application-sub-panel__header application-sub-panel__header--workspace-settings">{this.props.i18n.text.get("plugin.workspace.management.additionalInfoSectionTitle")}</h2>
          <div className="application-sub-panel__body application-sub-panel__body--workspace-settings">
            <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-name-extension">
              <label htmlFor="workspaceNameExtension" className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.workspace.management.additionalInfo.nameExtension")}</label>
              <input id="workspaceNameExtension" name="workspace-name-extension" type="text" className="form-element__input form-element__input--workspace-name-extension"
                value={this.state.workspaceExtension || ""} onChange={this.updateWorkspaceExtension} />
            </div>
            <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-type">
              <label htmlFor="workspaceType" className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.workspace.management.additionalInfo.courseType")}</label>
              <select id="workspaceType" name="workspace-type" className="form-element__select" value={this.state.workspaceType || ""} onChange={this.updateWorkspaceType}>
                {this.props.workspaceTypes && this.props.workspaceTypes.map(type =>
                  <option key={type.identifier} value={type.identifier}>{type.name}</option>
                )}
              </select>
            </div>
            <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-start-date">
              <label htmlFor="workspaceStartDate" className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.workspace.management.additionalInfo.startDate")}</label>
              <DatePicker id="workspaceStartDate" className="form-element__input" onChange={this.updateStartDate}
                maxDate={this.state.workspaceEndDate}
                locale={this.props.i18n.time.getLocale()} selected={this.state.workspaceStartDate} />
            </div>
            <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-end-date">
              <label htmlFor="workspaceEndDate" className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.workspace.management.additionalInfo.endDate")}</label>
              <DatePicker id="workspaceEndDate" className="form-element__input" onChange={this.updateEndDate}
                minDate={this.state.workspaceStartDate}
                locale={this.props.i18n.time.getLocale()} selected={this.state.workspaceEndDate} />
            </div>
          </div>
        </section>
        <section className="form-element application-sub-panel application-sub-panel--workspace-settings">
          <h2 className="application-sub-panel__header application-sub-panel__header--workspace-settings">{this.props.i18n.text.get("plugin.workspace.management.workspaceLicenceSectionTitle")}</h2>
          <div className="application-sub-panel__body application-sub-panel__body--workspace-settings">
            <LicenseSelector wcagLabel="workspaceLicense" wcagDesc={this.props.i18n.text.get("plugin.wcag.workspaceLicense.label")} modifier="workspace-management" value={this.state.workspaceLicense} onChange={this.updateLicense} i18n={this.props.i18n} />
          </div>
        </section>
        <section className="form-element  application-sub-panel application-sub-panel--workspace-settings">
          <h2 className="application-sub-panel__header application-sub-panel__header--workspace-settings">{this.props.i18n.text.get("plugin.workspace.management.workspaceProducersSectionTitle")}</h2>
          {this.state.workspaceProducers ?
            <div className="application-sub-panel__body application-sub-panel__body--workspace-settings">
              <AddProducer wcagLabel="workspaceProducer" removeProducer={this.removeProducer} addProducer={this.addProducer} producers={this.state.workspaceProducers} i18n={this.props.i18n} />
            </div>
            : null}
        </section>
        {this.props.status.permissions.CHAT_AVAILABLE ?
          <section className="application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header application-sub-panel__header--workspace-settings">{this.props.i18n.text.get("plugin.workspace.management.workspaceChatSectionTitle")}</h2>
            <div className="application-sub-panel__body application-sub-panel__body--workspace-settings">
              <div className="application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-chat-option">
                <fieldset>
                  <legend className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.workspace.management.settings.status")}</legend>
                  <div className="application-sub-panel__item-data application-sub-panel__item-data--workspace-management">
                    <div className="form-element form-element--checkbox-radiobutton">
                      <input id="chatEnabled" name="chat-enabled" type="radio"
                        checked={this.state.workspaceChatStatus === "ENABLED"}
                        onChange={this.setWorkspaceChatTo.bind(this, "ENABLED")} />
                      <label htmlFor="chatEnabled">{this.props.i18n.text.get("plugin.workspace.management.settings.chatEnabled")}</label>
                    </div>
                    <div className="form-element form-element--checkbox-radiobutton">
                      <input id="chatDisabled" name="chat-disabled" type="radio"
                        checked={this.state.workspaceChatStatus === "DISABLED"}
                        onChange={this.setWorkspaceChatTo.bind(this, "DISABLED")} />
                      <label htmlFor="chatDisabled">{this.props.i18n.text.get("plugin.workspace.management.settings.chatDisabled")}</label>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </section>
          : null}
        <section className="form-element  application-sub-panel application-sub-panel--workspace-settings">
          <h2 className="application-sub-panel__header application-sub-panel__header--workspace-settings">{this.props.i18n.text.get("plugin.workspace.permissions.viewTitle")}</h2>
          <div className="application-sub-panel__body application-sub-panel__body--workspace-settings">
            <SearchFormElement delay={0} id="workspacePermissions" modifiers="subpanel-search" name="workspace-permissions" placeholder={this.props.i18n.text.get("plugin.workspace.permissions.searchUsergroups")} value={this.state.workspaceUsergroupNameFilter} updateField={this.updateWorkspaceUsergroupNameFilter} />

            <div className="application-sub-panel__item application-sub-panel__item--workspace-management">
              <fieldset>
                <legend className="application-sub-panel__item-header">{this.props.i18n.text.get("plugin.workspace.permissions.usergroupsColumn.label")}</legend>

                {/*
                If we ever have multiple permissions to set then we need to use the following code.
                Also input and label elements needs to have htmlFor and id attributes removed if there are more than one checkboxes

                  {PERMISSIONS_TO_EXTRACT.map((pte, index) =>
                  <div className="what" key={pte}>{this.props.i18n.text.get("plugin.workspace.permissions.label." + pte)}</div>
                  )}
                */}

                {this.state.workspacePermissions
                  .filter((permission) => filterMatch(permission.userGroupName, this.state.workspaceUsergroupNameFilter)).map((permission) => {
                    return <span className="form-element form-element--checkbox-radiobutton" key={permission.userGroupEntityId}>
                      {PERMISSIONS_TO_EXTRACT.map((pte, index) =>
                        <input id={`usergroup${permission.userGroupEntityId}`} key={pte} type="checkbox" checked={permission.canSignup}
                          onChange={this.togglePermissionIn.bind(this, permission, pte)} />
                      )}
                      <label htmlFor={`usergroup${permission.userGroupEntityId}`}>{filterHighlight(permission.userGroupName, this.state.workspaceUsergroupNameFilter)}</label>
                    </span>
                  })}
              </fieldset>
            </div>
          </div>
        </section>
        <section className="form-element  application-sub-panel application-sub-panel--workspace-settings">
          <div className="application-sub-pane__button-container">
            <Button className="button--primary-function-save" disabled={this.state.locked} onClick={this.save}>{this.props.i18n.text.get("plugin.workspace.management.workspaceButtons.save")}</Button>
          </div>
        </section>
      </ApplicationPanel>
    </div>);
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    workspaceTypes: state.workspaces.types,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    updateWorkspace, updateWorkspaceProducersForCurrentWorkspace,
    updateCurrentWorkspaceImagesB64, updateWorkspaceDetailsForCurrentWorkspace, displayNotification
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagementPanel);
