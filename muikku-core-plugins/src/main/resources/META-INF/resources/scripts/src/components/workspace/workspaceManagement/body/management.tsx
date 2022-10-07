import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import {
  WorkspaceType,
  WorkspaceChatStatusType,
  WorkspaceAccessType,
  WorkspaceTypeType,
  WorkspaceProducerType,
  WorkspaceUpdateType,
  WorkspaceDetailsType,
  WorkspacePermissionsType,
} from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import Button from "~/components/general/button";
import Link from "~/components/general/link";
import DatePicker from "react-datepicker";
import CKEditor from "~/components/general/ckeditor";
import equals = require("deep-equal");
import CopyWizardDialog from "../dialogs/copy-wizard";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/change-image.scss";
import "~/sass/elements/wcag.scss";
import { LicenseSelector } from "~/components/general/license-selector";
import UploadImageDialog from "../dialogs/upload-image";
import DeleteImageDialog from "../dialogs/delete-image";
import AddProducer from "~/components/general/add-producer";
import {
  updateWorkspace,
  UpdateWorkspaceTriggerType,
  updateWorkspaceProducersForCurrentWorkspace,
  UpdateWorkspaceProducersForCurrentWorkspaceTriggerType,
  updateCurrentWorkspaceImagesB64,
  UpdateCurrentWorkspaceImagesB64TriggerType,
  updateWorkspaceDetailsForCurrentWorkspace,
  UpdateWorkspaceDetailsForCurrentWorkspaceTriggerType,
} from "~/actions/workspaces";
import { bindActionCreators } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { filterMatch, filterHighlight } from "~/util/modifiers";
import { SearchFormElement } from "~/components/general/form-element";
import * as moment from "moment";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { AnyActionType } from "~/actions/index";

const PERMISSIONS_TO_EXTRACT = ["WORKSPACE_SIGNUP"];

/**
 * ManagementPanelProps
 */
interface ManagementPanelProps {
  status: StatusType;
  workspace: WorkspaceType;
  i18n: i18nType;
  workspaceTypes: Array<WorkspaceTypeType>;
  updateWorkspace: UpdateWorkspaceTriggerType;
  updateWorkspaceProducersForCurrentWorkspace: UpdateWorkspaceProducersForCurrentWorkspaceTriggerType;
  updateCurrentWorkspaceImagesB64: UpdateCurrentWorkspaceImagesB64TriggerType;
  updateWorkspaceDetailsForCurrentWorkspace: UpdateWorkspaceDetailsForCurrentWorkspaceTriggerType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * ManagementPanelState
 */
interface ManagementPanelState {
  workspaceName: string;
  workspacePublished: boolean;
  workspaceAccess: WorkspaceAccessType;
  workspaceExtension: string;
  workspaceType: string;
  workspaceStartDate: Date | null;
  workspaceEndDate: Date | null;
  workspaceSignupStartDate: Date | null;
  workspaceSignupEndDate: Date | null;
  workspaceProducers: Array<WorkspaceProducerType>;
  workspaceDescription: string;
  workspaceLicense: string;
  workspaceHasCustomImage: boolean;
  workspacePermissions: Array<WorkspacePermissionsType>;
  workspaceChatStatus: WorkspaceChatStatusType;
  workspaceUsergroupNameFilter: string;
  currentWorkspaceProducerInputValue: string;
  newWorkspaceImageSrc?: string;
  newWorkspaceImageFile?: File;
  newWorkspaceImageB64?: string;
  newWorkspaceImageCombo?: {
    file?: File;
    originalB64?: string;
    croppedB64: string;
  };
  isImageDialogOpen: boolean;
  isDeleteImageDialogOpen: boolean;
  locked: boolean;
}

/**
 * ManagementPanel
 */
class ManagementPanel extends React.Component<
  ManagementPanelProps,
  ManagementPanelState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ManagementPanelProps) {
    super(props);
    this.state = {
      workspaceName: null,
      workspacePublished: false,
      workspaceAccess: null,
      workspaceExtension: null,
      workspaceType: null,
      workspaceStartDate: null,
      workspaceEndDate: null,
      workspaceSignupStartDate: null,
      workspaceSignupEndDate: null,
      workspaceProducers: null,
      workspaceDescription: "",
      workspaceLicense: "",
      workspaceHasCustomImage: false,
      workspaceChatStatus: null,
      workspacePermissions: [],
      workspaceUsergroupNameFilter: "",
      currentWorkspaceProducerInputValue: "",
      isDeleteImageDialogOpen: false,
      isImageDialogOpen: false,
      locked: false,
    };

    this.updateWorkspaceName = this.updateWorkspaceName.bind(this);
    this.setWorkspacePublishedTo = this.setWorkspacePublishedTo.bind(this);
    this.setWorkspaceAccessTo = this.setWorkspaceAccessTo.bind(this);
    this.updateWorkspaceType = this.updateWorkspaceType.bind(this);
    this.setWorkspaceChatTo = this.setWorkspaceChatTo.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    this.updateSignupStartDate = this.updateSignupStartDate.bind(this);
    this.updateSignupEndDate = this.updateSignupEndDate.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.updateWorkspaceExtension = this.updateWorkspaceExtension.bind(this);
    this.updateLicense = this.updateLicense.bind(this);
    this.removeCustomImage = this.removeCustomImage.bind(this);
    this.readNewImage = this.readNewImage.bind(this);
    this.acceptNewImage = this.acceptNewImage.bind(this);
    this.imageDeleted = this.imageDeleted.bind(this);
    this.editCurrentImage = this.editCurrentImage.bind(this);
    this.updateCurrentWorkspaceProducerInputValue =
      this.updateCurrentWorkspaceProducerInputValue.bind(this);
    this.addProducer = this.addProducer.bind(this);
    this.removeProducer = this.removeProducer.bind(this);
    this.checkIfEnterKeyIsPressedAndAddProducer =
      this.checkIfEnterKeyIsPressedAndAddProducer.bind(this);
    this.togglePermissionIn = this.togglePermissionIn.bind(this);
    this.updateWorkspaceUsergroupNameFilter =
      this.updateWorkspaceUsergroupNameFilter.bind(this);
    this.save = this.save.bind(this);
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: ManagementPanelProps) {
    this.setState({
      workspaceName: nextProps.workspace ? nextProps.workspace.name : null,
      workspacePublished: nextProps.workspace
        ? nextProps.workspace.published
        : null,
      workspaceAccess: nextProps.workspace ? nextProps.workspace.access : null,
      workspaceExtension: nextProps.workspace
        ? nextProps.workspace.nameExtension
        : null,
      workspaceType:
        nextProps.workspace && nextProps.workspace.details
          ? nextProps.workspace.details.typeId
          : null,
      workspaceStartDate:
        nextProps.workspace && nextProps.workspace.details
          ? nextProps.workspace.details.beginDate !== null
            ? moment(nextProps.workspace.details.beginDate).toDate()
            : null
          : null,
      workspaceEndDate:
        nextProps.workspace && nextProps.workspace.details
          ? nextProps.workspace.details.endDate !== null
            ? moment(nextProps.workspace.details.endDate).toDate()
            : null
          : null,
      workspaceSignupStartDate:
        nextProps.workspace && nextProps.workspace.details
          ? nextProps.workspace.details.signupStart !== null
            ? moment(nextProps.workspace.details.signupStart).toDate()
            : null
          : null,
      workspaceSignupEndDate:
        nextProps.workspace && nextProps.workspace.details
          ? nextProps.workspace.details.signupEnd !== null
            ? moment(nextProps.workspace.details.signupEnd).toDate()
            : null
          : null,
      workspaceProducers:
        nextProps.workspace && nextProps.workspace.producers
          ? nextProps.workspace.producers
          : null,
      workspaceLicense: nextProps.workspace
        ? nextProps.workspace.materialDefaultLicense
        : "",
      workspaceDescription: nextProps.workspace
        ? nextProps.workspace.description || ""
        : "",
      workspaceHasCustomImage: nextProps.workspace
        ? nextProps.workspace.hasCustomImage
        : false,
      workspaceChatStatus: nextProps.workspace
        ? nextProps.workspace.chatStatus
        : null,
      workspacePermissions:
        nextProps.workspace && nextProps.workspace.permissions
          ? nextProps.workspace.permissions
          : [],
    });
  }

  /**
   * updateWorkspaceName
   * @param e e
   */
  updateWorkspaceName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      workspaceName: e.target.value,
    });
  }

  /**
   * setWorkspacePublishedTo
   * @param value value
   */
  setWorkspacePublishedTo(value: boolean) {
    this.setState({
      workspacePublished: value,
    });
  }

  /**
   * setWorkspaceChatTo
   * @param value value
   */
  setWorkspaceChatTo(value: WorkspaceChatStatusType) {
    this.setState({
      workspaceChatStatus: value,
    });
  }

  /**
   * setWorkspaceAccessTo
   * @param value value
   */
  setWorkspaceAccessTo(value: WorkspaceAccessType) {
    this.setState({
      workspaceAccess: value,
    });
  }

  /**
   * updateWorkspaceExtension
   * @param e e
   */
  updateWorkspaceExtension(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      workspaceExtension: e.target.value,
    });
  }

  /**
   * updateWorkspaceType
   * @param e e
   */
  updateWorkspaceType(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      workspaceType: e.target.value,
    });
  }

  /**
   * updateStartDate
   * @param newDate newDate
   */
  updateSignupStartDate(newDate: Date) {
    this.setState({
      workspaceSignupStartDate: newDate,
    });
  }

  /**
   * updateEndDate
   * @param newDate newDate
   */
  updateSignupEndDate(newDate: Date) {
    this.setState({
      workspaceSignupEndDate: newDate,
    });
  }

  /**
   * updateStartDate
   * @param newDate newDate
   */
  updateStartDate(newDate: Date) {
    this.setState({
      workspaceStartDate: newDate,
    });
  }

  /**
   * updateEndDate
   * @param newDate newDate
   */
  updateEndDate(newDate: Date) {
    this.setState({
      workspaceEndDate: newDate,
    });
  }

  /**
   * updateCurrentWorkspaceProducerInputValue
   * @param e e
   */
  updateCurrentWorkspaceProducerInputValue(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    this.setState({
      currentWorkspaceProducerInputValue: e.target.value,
    });
  }

  /**
   * updateWorkspaceUsergroupNameFilter
   * @param query query
   */
  updateWorkspaceUsergroupNameFilter(query: string) {
    this.setState({
      workspaceUsergroupNameFilter: query,
    });
  }

  /**
   * checkIfEnterKeyIsPressedAndAddProducer
   * @param e e
   */
  checkIfEnterKeyIsPressedAndAddProducer(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.keyCode == 13) {
      this.addProducer(this.state.currentWorkspaceProducerInputValue);
    }
  }

  /**
   * addProducer
   * @param name name
   */
  addProducer(name: string) {
    this.setState({
      currentWorkspaceProducerInputValue: "",
      workspaceProducers: [
        ...this.state.workspaceProducers,
        {
          name,
        },
      ],
    });
  }

  /**
   * removeProducer
   * @param index index
   */
  removeProducer(index: number) {
    this.setState({
      workspaceProducers: this.state.workspaceProducers.filter(
        (p, i) => i !== index
      ),
    });
  }

  /**
   * onDescriptionChange
   * @param text text
   */
  onDescriptionChange(text: string) {
    this.setState({
      workspaceDescription: text,
    });
  }

  /**
   * updateLicense
   * @param newLicense newLicense
   */
  updateLicense(newLicense: string) {
    this.setState({
      workspaceLicense: newLicense,
    });
  }

  /**
   * removeCustomImage
   */
  removeCustomImage() {
    this.setState({
      isDeleteImageDialogOpen: true,
    });
  }

  /**
   * readNewImage
   * @param e e
   */
  readNewImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files[0];
    const reader = new FileReader();

    e.target.value = "";

    reader.addEventListener(
      "load",
      () => {
        this.setState({
          newWorkspaceImageB64: String(reader.result),
          newWorkspaceImageFile: file,
          isImageDialogOpen: true,
          newWorkspaceImageSrc: null,
        });
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  /**
   * editCurrentImage
   */
  editCurrentImage() {
    // let imageSrc = this.state.newWorkspaceImageCombo && this.state.newWorkspaceImageCombo.originalB64 ? this.state.newWorkspaceImageCombo.originalB64: `/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-original`;

    if (this.state.newWorkspaceImageCombo) {
      this.setState({
        newWorkspaceImageSrc: this.state.newWorkspaceImageCombo.originalB64,
        isImageDialogOpen: true,
        newWorkspaceImageB64: this.state.newWorkspaceImageCombo.originalB64,
        newWorkspaceImageFile: this.state.newWorkspaceImageCombo.file,
      });
    } else if (this.props.workspace.hasCustomImage) {
      this.setState({
        newWorkspaceImageSrc: `/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-original`,
        isImageDialogOpen: true,
        newWorkspaceImageB64: null,
        newWorkspaceImageFile: null,
      });
    }
  }

  /**
   * imageDeleted
   */
  imageDeleted() {
    this.setState({
      newWorkspaceImageCombo: null,
      workspaceHasCustomImage: false,
    });
  }

  /**
   * acceptNewImage
   * @param croppedB64 croppedB64
   * @param originalB64 originalB64
   * @param file file
   */
  acceptNewImage(croppedB64: string, originalB64?: string, file?: File) {
    this.setState({
      workspaceHasCustomImage: true,
      newWorkspaceImageCombo: {
        file,
        originalB64,
        croppedB64,
      },
    });
  }

  /**
   * togglePermissionIn
   * @param permission permission
   */
  togglePermissionIn(permission: WorkspacePermissionsType) {
    this.setState({
      workspacePermissions: this.state.workspacePermissions.map((pte) => {
        if (pte.userGroupEntityId === permission.userGroupEntityId) {
          const newPermission = { ...permission };
          newPermission.canSignup = !newPermission.canSignup;
          return newPermission;
        }
        return pte;
      }),
    });
  }

  /**
   * saveImage
   * @param croppedB64 croppedB64
   * @param originalB64 originalB64
   * @param file file
   */
  saveImage(croppedB64: string, originalB64?: string, file?: File) {
    this.props.updateCurrentWorkspaceImagesB64({
      originalB64: originalB64,
      croppedB64: croppedB64,
      /**
       * success
       */
      success: () => {
        this.props.displayNotification(
          this.props.i18n.text.get(
            "plugin.workspace.management.notification.coverImage.saved"
          ),
          "success"
        );
      },
    });

    this.setState({
      workspaceHasCustomImage: true,
      newWorkspaceImageCombo: {
        file,
        originalB64,
        croppedB64,
      },
    });
  }

  /**
   * save
   */
  save() {
    this.setState({
      locked: true,
    });

    let payload: WorkspaceUpdateType = {};
    const workspaceUpdate: WorkspaceUpdateType = {
      name: this.state.workspaceName,
      published: this.state.workspacePublished,
      access: this.state.workspaceAccess,
      nameExtension: this.state.workspaceExtension,
      materialDefaultLicense: this.state.workspaceLicense,
      description: this.state.workspaceDescription,
      hasCustomImage: this.state.workspaceHasCustomImage,
    };
    const currentWorkspaceAsUpdate: WorkspaceUpdateType = {
      name: this.props.workspace.name,
      published: this.props.workspace.published,
      access: this.props.workspace.access,
      nameExtension: this.props.workspace.nameExtension,
      materialDefaultLicense: this.props.workspace.materialDefaultLicense,
      description: this.props.workspace.description,
      hasCustomImage: this.props.workspace.hasCustomImage,
    };

    if (!equals(workspaceUpdate, currentWorkspaceAsUpdate)) {
      payload = Object.assign(workspaceUpdate, payload);
    }

    const workspaceMaterialProducers = this.state.workspaceProducers;

    if (!equals(workspaceMaterialProducers, this.props.workspace.producers)) {
      payload = Object.assign(
        { producers: workspaceMaterialProducers },
        payload
      );
    }

    // Chat
    const workspaceChatStatus = this.state.workspaceChatStatus;
    const currentWorkspaceChatStatus = this.props.workspace.chatStatus;

    if (!equals(workspaceChatStatus, currentWorkspaceChatStatus)) {
      payload = Object.assign({ chatStatus: workspaceChatStatus }, payload);
    }

    const workspaceDetails: WorkspaceDetailsType = {
      externalViewUrl: this.props.workspace.details.externalViewUrl,
      typeId: this.state.workspaceType,
      beginDate:
        this.state.workspaceStartDate !== null
          ? this.state.workspaceStartDate.toISOString()
          : null,
      endDate:
        this.state.workspaceEndDate !== null
          ? this.state.workspaceEndDate.toISOString()
          : null,
      rootFolderId: this.props.workspace.details.rootFolderId,
      helpFolderId: this.props.workspace.details.helpFolderId,
      indexFolderId: this.props.workspace.details.indexFolderId,
      signupStart:
        this.state.workspaceSignupStartDate !== null
          ? this.state.workspaceSignupStartDate.toISOString()
          : null,
      signupEnd:
        this.state.workspaceSignupEndDate !== null
          ? this.state.workspaceSignupEndDate.toISOString()
          : null,
    };

    const currentWorkspaceAsDetails: WorkspaceDetailsType = {
      externalViewUrl: this.props.workspace.details.externalViewUrl,
      typeId: this.props.workspace.details.typeId,
      beginDate: moment(this.props.workspace.details.beginDate).toISOString(),
      endDate: moment(this.props.workspace.details.endDate).toISOString(),
      rootFolderId: this.props.workspace.details.rootFolderId,
      helpFolderId: this.props.workspace.details.helpFolderId,
      indexFolderId: this.props.workspace.details.indexFolderId,
      signupStart: moment(
        this.props.workspace.details.signupStart
      ).toISOString(),
      signupEnd: moment(this.props.workspace.details.signupEnd).toISOString(),
    };

    if (!equals(workspaceDetails, currentWorkspaceAsDetails)) {
      payload = Object.assign({ details: workspaceDetails }, payload);
    }

    if (
      !equals(this.props.workspace.permissions, this.state.workspacePermissions)
    ) {
      const permissionsArray: WorkspacePermissionsType[] = [];

      this.state.workspacePermissions.forEach((permission) => {
        const originalPermission = this.props.workspace.permissions.find(
          (p) => p.userGroupEntityId === permission.userGroupEntityId
        );
        if (!equals(originalPermission, permission)) {
          permissionsArray.push(permission);
        }
      });
      payload = Object.assign({ permissions: permissionsArray }, payload);
    }

    this.props.updateWorkspace({
      workspace: this.props.workspace,
      update: payload,
      /**
       * success
       */
      success: () => {
        this.props.displayNotification(
          this.props.i18n.text.get(
            "plugin.workspace.management.notification.save.successful"
          ),
          "success"
        );
        this.setState({
          locked: false,
        });
      },
      /**
       * fail
       */
      fail: () => {
        this.setState({
          locked: false,
        });
      },
    });
  }

  /**
   * render
   */
  render() {
    let actualBackgroundSRC = this.state.workspaceHasCustomImage
      ? `/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-cropped`
      : "/gfx/workspace-default-header.jpg";
    if (this.state.newWorkspaceImageCombo) {
      actualBackgroundSRC = this.state.newWorkspaceImageCombo.croppedB64;
    }

    return (
      <>
        <ApplicationPanel
          modifier="workspace-management"
          title={this.props.i18n.text.get(
            "plugin.workspace.management.pageTitle"
          )}
        >
          <section className="application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {this.props.i18n.text.get(
                "plugin.workspace.management.title.basicInfo"
              )}
            </h2>
            <div className="application-sub-panel__body">
              <div className="form__row form__row--split">
                <div className="form__subdivision">
                  <div className="form__row">
                    <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management">
                      <label htmlFor="wokspaceName">
                        {this.props.i18n.text.get(
                          "plugin.workspace.management.title.basicInfo.name"
                        )}
                      </label>
                      <input
                        id="wokspaceName"
                        name="wokspace-name"
                        type="text"
                        className="form-element__input form-element__input--workspace-name"
                        value={this.state.workspaceName || ""}
                        onChange={this.updateWorkspaceName}
                      />
                      <div className="application-sub-panel__item-actions">
                        <Link
                          href={
                            this.props.workspace &&
                            this.props.workspace.details &&
                            this.props.workspace.details.externalViewUrl
                          }
                          openInNewTab="_blank"
                          className="link link--workspace-management"
                        >
                          {this.props.i18n.text.get(
                            "plugin.workspace.management.viewInPyramus"
                          )}
                        </Link>
                        <CopyWizardDialog>
                          <Link className="link link--workspace-management">
                            {this.props.i18n.text.get(
                              "plugin.workspace.management.copyWorkspace"
                            )}
                          </Link>
                        </CopyWizardDialog>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form__subdivision">
                  <div className="form__row">
                    <div className="application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-description form-element">
                      <label>
                        {this.props.i18n.text.get(
                          "plugin.workspace.management.title.basicInfo.description"
                        )}
                      </label>
                      <CKEditor
                        editorTitle={this.props.i18n.text.get(
                          "plugin.wcag.workspaceDescription.label"
                        )}
                        onChange={this.onDescriptionChange}
                      >
                        {this.state.workspaceDescription}
                      </CKEditor>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="application-sub-panel application-sub-panel--workspace-settings application-sub-panel--workspace-image-settings">
            <h2 className="application-sub-panel__header application-sub-panel__header--workspace-image-settings">
              {this.props.i18n.text.get(
                "plugin.workspace.management.imageSectionTitle"
              )}
            </h2>
            <div className="application-sub-panel__body application-sub-panel__body--workspace-settings">
              <div className="form__row">
                <div className="change-image">
                  <div
                    className="change-image__container change-image__container--workspace"
                    style={{
                      backgroundImage: `url("${actualBackgroundSRC}")`,
                      backgroundSize: `cover`,
                    }}
                  >
                    <label className="visually-hidden" htmlFor="workspaceImage">
                      {this.props.i18n.text.get(
                        "plugin.wcag.workspaceImage.label"
                      )}
                    </label>
                    <input
                      id="workspaceImage"
                      name="file"
                      type="file"
                      accept="image/*"
                      onChange={this.readNewImage}
                    />
                    {this.state.workspaceHasCustomImage ? (
                      <div className="change-image__actions">
                        <Button
                          buttonModifiers="change-image-edit button--change-image-workspace"
                          onClick={this.editCurrentImage}
                        >
                          <span className="icon icon-pencil" />
                          {this.props.i18n.text.get("plugin.profile.editImage")}
                        </Button>
                        <Button
                          buttonModifiers="change-image-delete button--change-image-workspace"
                          onClick={this.removeCustomImage}
                        >
                          <span className="icon icon-trash" />
                          {this.props.i18n.text.get(
                            "plugin.profile.deleteImage"
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="change-image__default-content">
                        {this.props.i18n.text.get(
                          "plugin.workspace.management.changeImage.defaultImageInfo"
                        )}
                      </div>
                    )}
                  </div>
                  <DeleteImageDialog
                    isOpen={this.state.isDeleteImageDialogOpen}
                    onDelete={this.imageDeleted}
                    onClose={() =>
                      this.setState({ isDeleteImageDialogOpen: false })
                    }
                  />
                  <UploadImageDialog
                    isOpen={this.state.isImageDialogOpen}
                    b64={this.state.newWorkspaceImageB64}
                    file={this.state.newWorkspaceImageFile}
                    onClose={() => this.setState({ isImageDialogOpen: false })}
                    src={this.state.newWorkspaceImageSrc}
                    onImageChange={this.acceptNewImage}
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {this.props.i18n.text.get(
                "plugin.workspace.management.workspaceVisibilitySectionTitle"
              )}
            </h2>
            <div className="application-sub-panel__body">
              <div className="form__row form__row--split">
                <div className="form__subdivision form__subdivision--auto-width">
                  <div className="form__row">
                    <fieldset className="form__fieldset">
                      <legend className="form__legend">
                        {this.props.i18n.text.get(
                          "plugin.workspace.management.settings.publicity"
                        )}
                      </legend>
                      <div className="form__fieldset-content form__fieldset-content--horizontal">
                        <div className="form-element form-element--checkbox-radiobutton">
                          <input
                            id="workspacePublish"
                            name="publish"
                            type="radio"
                            checked={this.state.workspacePublished === true}
                            onChange={this.setWorkspacePublishedTo.bind(
                              this,
                              true
                            )}
                          />
                          <label htmlFor="workspacePublish">
                            {this.props.i18n.text.get(
                              "plugin.workspace.management.settings.publicity.publish"
                            )}
                          </label>
                        </div>
                        <div className="form-element form-element--checkbox-radiobutton">
                          <input
                            id="workspaceUnpublish"
                            name="unpublish"
                            type="radio"
                            checked={this.state.workspacePublished === false}
                            onChange={this.setWorkspacePublishedTo.bind(
                              this,
                              false
                            )}
                          />
                          <label htmlFor="workspaceUnpublish">
                            {this.props.i18n.text.get(
                              "plugin.workspace.management.settings.publicity.unpublish"
                            )}
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
                        {this.props.i18n.text.get(
                          "plugin.workspace.management.settings.access"
                        )}
                      </legend>
                      <div className="form__fieldset-content form__fieldset-content--horizontal">
                        <div className="form-element form-element--checkbox-radiobutton">
                          <input
                            id="workspaceAccessMembers"
                            name="access-members"
                            type="radio"
                            checked={
                              this.state.workspaceAccess === "MEMBERS_ONLY"
                            }
                            onChange={this.setWorkspaceAccessTo.bind(
                              this,
                              "MEMBERS_ONLY"
                            )}
                          />
                          <label htmlFor="workspaceAccessMembers">
                            {this.props.i18n.text.get(
                              "plugin.workspace.management.settings.access.membersOnly"
                            )}
                          </label>
                        </div>
                        <div className="form-element form-element--checkbox-radiobutton">
                          <input
                            id="workspaceAccessLoggedin"
                            name="access-loggedin"
                            type="radio"
                            checked={this.state.workspaceAccess === "LOGGED_IN"}
                            onChange={this.setWorkspaceAccessTo.bind(
                              this,
                              "LOGGED_IN"
                            )}
                          />
                          <label htmlFor="workspaceAccessLoggedin">
                            {this.props.i18n.text.get(
                              "plugin.workspace.management.settings.access.loggedIn"
                            )}
                          </label>
                        </div>
                        <div className="form-element form-element--checkbox-radiobutton">
                          <input
                            id="workspaceAccessAnyone"
                            name="access-anyone"
                            type="radio"
                            checked={this.state.workspaceAccess === "ANYONE"}
                            onChange={this.setWorkspaceAccessTo.bind(
                              this,
                              "ANYONE"
                            )}
                          />
                          <label htmlFor="workspaceAccessAnyone">
                            {this.props.i18n.text.get(
                              "plugin.workspace.management.settings.access.anyone"
                            )}
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {this.props.i18n.text.get(
                "plugin.workspace.management.workspaceSignupPeriod"
              )}
            </h2>
            <div className="application-sub-panel__body">
              <div className="form__row form__row--split">
                <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-start-date">
                  <label
                    htmlFor="workspaceSignupStartDate"
                    className="application-sub-panel__item-header"
                  >
                    {this.props.i18n.text.get(
                      "plugin.workspace.management.additionalInfo.signupStartDate"
                    )}
                  </label>
                  <DatePicker
                    id="workspaceSignupStartDate"
                    className="form-element__input"
                    onChange={this.updateSignupStartDate}
                    minDate={new Date()}
                    maxDate={
                      this.state.workspaceSignupEndDate !== null
                        ? this.state.workspaceSignupEndDate
                        : undefined
                    }
                    locale={outputCorrectDatePickerLocale(
                      this.props.i18n.time.getLocale()
                    )}
                    selected={this.state.workspaceSignupStartDate}
                    dateFormat="P"
                  />
                </div>
                <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-start-date">
                  <label
                    htmlFor="workspaceSignupEndDate"
                    className="application-sub-panel__item-header"
                  >
                    {this.props.i18n.text.get(
                      "plugin.workspace.management.additionalInfo.signupEndDate"
                    )}
                  </label>
                  <DatePicker
                    id="workspaceSignupEndDate"
                    className="form-element__input"
                    onChange={this.updateSignupEndDate}
                    minDate={
                      this.state.workspaceSignupStartDate !== null
                        ? this.state.workspaceSignupStartDate
                        : new Date()
                    }
                    locale={outputCorrectDatePickerLocale(
                      this.props.i18n.time.getLocale()
                    )}
                    selected={this.state.workspaceSignupEndDate}
                    dateFormat="P"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {this.props.i18n.text.get(
                "plugin.workspace.management.additionalInfoSectionTitle"
              )}
            </h2>
            <div className="application-sub-panel__body">
              <div className="form__row form__row--workspace-management">
                <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-name-extension">
                  <label htmlFor="workspaceNameExtension">
                    {this.props.i18n.text.get(
                      "plugin.workspace.management.additionalInfo.nameExtension"
                    )}
                  </label>
                  <input
                    id="workspaceNameExtension"
                    name="workspace-name-extension"
                    type="text"
                    className="form-element__input form-element__input--workspace-name-extension"
                    value={this.state.workspaceExtension || ""}
                    onChange={this.updateWorkspaceExtension}
                  />
                </div>
                <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-type">
                  <label htmlFor="workspaceType">
                    {this.props.i18n.text.get(
                      "plugin.workspace.management.additionalInfo.courseType"
                    )}
                  </label>
                  <select
                    id="workspaceType"
                    name="workspace-type"
                    className="form-element__select"
                    value={this.state.workspaceType || ""}
                    onChange={this.updateWorkspaceType}
                  >
                    {this.props.workspaceTypes &&
                      this.props.workspaceTypes.map((type) => (
                        <option key={type.identifier} value={type.identifier}>
                          {type.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-start-date">
                  <label
                    htmlFor="workspaceStartDate"
                    className="application-sub-panel__item-header"
                  >
                    {this.props.i18n.text.get(
                      "plugin.workspace.management.additionalInfo.startDate"
                    )}
                  </label>
                  <DatePicker
                    id="workspaceStartDate"
                    className="form-element__input"
                    onChange={this.updateStartDate}
                    maxDate={this.state.workspaceEndDate}
                    locale={outputCorrectDatePickerLocale(
                      this.props.i18n.time.getLocale()
                    )}
                    selected={this.state.workspaceStartDate}
                    dateFormat="P"
                  />
                </div>
                <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-end-date">
                  <label
                    htmlFor="workspaceEndDate"
                    className="application-sub-panel__item-header"
                  >
                    {this.props.i18n.text.get(
                      "plugin.workspace.management.additionalInfo.endDate"
                    )}
                  </label>
                  <DatePicker
                    id="workspaceEndDate"
                    className="form-element__input"
                    onChange={this.updateEndDate}
                    minDate={this.state.workspaceStartDate}
                    locale={outputCorrectDatePickerLocale(
                      this.props.i18n.time.getLocale()
                    )}
                    selected={this.state.workspaceEndDate}
                    dateFormat="P"
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="form-element application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {this.props.i18n.text.get(
                "plugin.workspace.management.workspaceLicenceSectionTitle"
              )}
            </h2>
            <div className="application-sub-panel__body">
              <LicenseSelector
                wcagLabel="workspaceLicense"
                wcagDesc={this.props.i18n.text.get(
                  "plugin.wcag.workspaceLicense.label"
                )}
                modifier="workspace-management"
                value={this.state.workspaceLicense}
                onChange={this.updateLicense}
                i18n={this.props.i18n}
              />
            </div>
          </section>
          <section className="form-element  application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {this.props.i18n.text.get(
                "plugin.workspace.management.workspaceProducersSectionTitle"
              )}
            </h2>
            {this.state.workspaceProducers ? (
              <div className="application-sub-panel__body">
                <AddProducer
                  wcagLabel="workspaceProducer"
                  removeProducer={this.removeProducer}
                  addProducer={this.addProducer}
                  producers={this.state.workspaceProducers}
                  i18n={this.props.i18n}
                />
              </div>
            ) : null}
          </section>
          {this.props.status.permissions.CHAT_AVAILABLE ? (
            <section className="application-sub-panel application-sub-panel--workspace-settings">
              <h2 className="application-sub-panel__header">
                {this.props.i18n.text.get(
                  "plugin.workspace.management.workspaceChatSectionTitle"
                )}
              </h2>
              <div className="application-sub-panel__body">
                <div className="form__row">
                  <fieldset className="form__fieldset">
                    <legend className="form__legend">
                      {this.props.i18n.text.get(
                        "plugin.workspace.management.settings.status"
                      )}
                    </legend>
                    <div className="form__fieldset-content form__fieldset-content--horizontal">
                      <div className="form-element form-element--checkbox-radiobutton">
                        <input
                          id="chatEnabled"
                          name="chat-enabled"
                          type="radio"
                          checked={this.state.workspaceChatStatus === "ENABLED"}
                          onChange={this.setWorkspaceChatTo.bind(
                            this,
                            "ENABLED"
                          )}
                        />
                        <label htmlFor="chatEnabled">
                          {this.props.i18n.text.get(
                            "plugin.workspace.management.settings.chatEnabled"
                          )}
                        </label>
                      </div>
                      <div className="form-element form-element--checkbox-radiobutton">
                        <input
                          id="chatDisabled"
                          name="chat-disabled"
                          type="radio"
                          checked={
                            this.state.workspaceChatStatus === "DISABLED"
                          }
                          onChange={this.setWorkspaceChatTo.bind(
                            this,
                            "DISABLED"
                          )}
                        />
                        <label htmlFor="chatDisabled">
                          {this.props.i18n.text.get(
                            "plugin.workspace.management.settings.chatDisabled"
                          )}
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </section>
          ) : null}
          <section className="application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {this.props.i18n.text.get(
                "plugin.workspace.permissions.viewTitle"
              )}
            </h2>
            <div className="application-sub-panel__body">
              <div className="form__row">
                <SearchFormElement
                  delay={0}
                  id="workspacePermissions"
                  modifiers="subpanel-search"
                  name="workspace-permissions"
                  placeholder={this.props.i18n.text.get(
                    "plugin.workspace.permissions.searchUsergroups"
                  )}
                  value={this.state.workspaceUsergroupNameFilter}
                  updateField={this.updateWorkspaceUsergroupNameFilter}
                />
              </div>

              <div className="form__row">
                <fieldset className="form__fieldset">
                  <legend className="form__legend">
                    {this.props.i18n.text.get(
                      "plugin.workspace.permissions.usergroupsColumn.label"
                    )}
                  </legend>
                  <div className="form__fieldset-content form__fieldset-content--vertical">
                    {/*
                If we ever have multiple permissions to set then we need to use the following code.
                Also input and label elements needs to have htmlFor and id attributes removed if there are more than one checkboxes

                  {PERMISSIONS_TO_EXTRACT.map((pte, index) =>
                  <div className="what" key={pte}>{this.props.i18n.text.get("plugin.workspace.permissions.label." + pte)}</div>
                  )}
                */}

                    {this.state.workspacePermissions
                      .filter((permission) =>
                        filterMatch(
                          permission.userGroupName,
                          this.state.workspaceUsergroupNameFilter
                        )
                      )
                      .map((permission) => (
                        <span
                          className="form-element form-element--checkbox-radiobutton"
                          key={permission.userGroupEntityId}
                        >
                          {PERMISSIONS_TO_EXTRACT.map((pte) => (
                            <input
                              id={`usergroup${permission.userGroupEntityId}`}
                              key={pte}
                              type="checkbox"
                              checked={permission.canSignup}
                              onChange={this.togglePermissionIn.bind(
                                this,
                                permission,
                                pte
                              )}
                            />
                          ))}
                          <label
                            htmlFor={`usergroup${permission.userGroupEntityId}`}
                          >
                            {filterHighlight(
                              permission.userGroupName,
                              this.state.workspaceUsergroupNameFilter
                            )}
                          </label>
                        </span>
                      ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </section>
          <section className="form-element  application-sub-panel application-sub-panel--workspace-settings">
            <div className="form__buttons form__buttons--workspace-management">
              <Button
                className="button--primary-function-save"
                disabled={this.state.locked}
                onClick={this.save}
              >
                {this.props.i18n.text.get(
                  "plugin.workspace.management.workspaceButtons.save"
                )}
              </Button>
            </div>
          </section>
        </ApplicationPanel>
      </>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    workspaceTypes: state.workspaces.types,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      updateWorkspace,
      updateWorkspaceProducersForCurrentWorkspace,
      updateCurrentWorkspaceImagesB64,
      updateWorkspaceDetailsForCurrentWorkspace,
      displayNotification,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagementPanel);
