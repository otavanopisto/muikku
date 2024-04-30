import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import {
  WorkspaceDataType,
  WorkspaceUpdateType,
  languageOptions,
} from "~/reducers/workspaces";
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
import LicenseSelector from "~/components/general/license-selector";
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
import moment from "moment";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { AnyActionType } from "~/actions/index";
import {
  Language,
  WorkspaceAccess,
  WorkspaceChatStatus,
  WorkspaceDetails,
  WorkspaceMaterialProducer,
  WorkspaceSignupGroup,
  WorkspaceSignupMessage,
  WorkspaceType,
} from "~/generated/client";
import { localize } from "~/locales/i18n";
import { withTranslation, WithTranslation } from "react-i18next";
import Dropdown from "~/components/general/dropdown";

const PERMISSIONS_TO_EXTRACT = ["WORKSPACE_SIGNUP"];

/**
 * ManagementPanelProps
 */
interface ManagementPanelProps extends WithTranslation {
  status: StatusType;
  workspace: WorkspaceDataType;
  workspaceTypes: WorkspaceType[];
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
  workspaceLanguage: Language;
  workspacePublished: boolean;
  workspaceAccess: WorkspaceAccess;
  workspaceExtension: string;
  workspaceType: string;
  workspaceStartDate: Date | null;
  workspaceEndDate: Date | null;
  workspaceSignupStartDate: Date | null;
  workspaceSignupEndDate: Date | null;
  workspaceProducers: Array<WorkspaceMaterialProducer>;
  workspaceDescription: string;
  workspaceLicense: string;
  workspaceHasCustomImage: boolean;
  workspacePermissions: Array<WorkspaceSignupGroup>;
  workspaceChatStatus: WorkspaceChatStatus;
  workspaceUsergroupNameFilter: string;
  workspaceSignupMessage: WorkspaceSignupMessage;
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
      workspaceLanguage: "fi",
      workspacePublished: false,
      workspaceAccess: null,
      workspaceExtension: null,
      workspaceType: null,
      workspaceStartDate: null,
      workspaceEndDate: null,
      workspaceSignupStartDate: null,
      workspaceSignupEndDate: null,
      workspaceProducers: null,
      workspaceDescription:
        props.workspace && props.workspace.description
          ? props.workspace.description
          : "",
      workspaceLicense: "",
      workspaceHasCustomImage: false,
      workspaceChatStatus: null,
      workspacePermissions: [],
      workspaceSignupMessage: {
        caption: "",
        content: "",
        enabled: false,
      },
      workspaceUsergroupNameFilter: "",
      currentWorkspaceProducerInputValue: "",
      isDeleteImageDialogOpen: false,
      isImageDialogOpen: false,
      locked: false,
    };

    this.updateWorkspaceName = this.updateWorkspaceName.bind(this);
    this.updateWorkspaceLanguage = this.updateWorkspaceLanguage.bind(this);
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
          ? nextProps.workspace.permissions.map((pr) => ({
              ...pr,
              signupMessage: pr.signupMessage || {
                caption: "",
                content: "",
                enabled: false,
              },
            }))
          : [],
      workspaceLanguage: nextProps.workspace
        ? nextProps.workspace.language
        : "fi",
      workspaceSignupMessage:
        nextProps.workspace && nextProps.workspace.signupMessage
          ? nextProps.workspace.signupMessage
          : {
              caption: "",
              content: "",
              enabled: false,
            },
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
   * updateWorkspaceName
   * @param e e
   */
  updateWorkspaceLanguage(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      workspaceLanguage: e.currentTarget.value as Language,
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
  setWorkspaceChatTo(value: WorkspaceChatStatus) {
    this.setState({
      workspaceChatStatus: value,
    });
  }

  /**
   * setWorkspaceAccessTo
   * @param value value
   */
  setWorkspaceAccessTo(value: WorkspaceAccess) {
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
  togglePermissionIn(permission: WorkspaceSignupGroup) {
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
   * Handles signup group message save
   * @param e e
   */
  handleWorkspaceSignupMessageCaptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    this.setState({
      workspaceSignupMessage: {
        ...this.state.workspaceSignupMessage,
        caption: value,
      },
    });
  };

  /**
   * Handles signup group message save
   * @param text text
   */
  handleWorkspaceSignupMessageContentChange = (text: string) => {
    this.setState({
      workspaceSignupMessage: {
        ...this.state.workspaceSignupMessage,
        content: text,
      },
    });
  };

  /**
   * Handles signup group message toggle
   * @param e e
   */
  handleWorkspaceSignupMessageToggle = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    this.setState({
      workspaceSignupMessage: {
        ...this.state.workspaceSignupMessage,
        enabled: !this.state.workspaceSignupMessage.enabled,
      },
    });
  };

  /**
   * Handles signup group message save
   * @param signupGroup signupGroup
   */
  handlePermissionSignupGroupMessageContentChange =
    (signupGroup: WorkspaceSignupGroup) => (text: string) => {
      const permissions = [...this.state.workspacePermissions];

      const updatedSignupGroupIndex = permissions.findIndex(
        (permission) =>
          permission.userGroupEntityId === signupGroup.userGroupEntityId
      );

      if (updatedSignupGroupIndex === -1) {
        return;
      }

      permissions[updatedSignupGroupIndex].signupMessage.content = text;

      // if content is empty, disable the message
      if (text === "") {
        permissions[updatedSignupGroupIndex].signupMessage.enabled = false;
      }

      this.setState({
        workspacePermissions: permissions,
      });
    };

  /**
   * Handles signup group message save
   * @param signupGroup signupGroup
   */
  handlePermissionSignupGroupMessageCaptionChange =
    (signupGroup: WorkspaceSignupGroup) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const permissions = [...this.state.workspacePermissions];

      const updatedSignupGroupIndex = permissions.findIndex(
        (permission) =>
          permission.userGroupEntityId === signupGroup.userGroupEntityId
      );

      if (updatedSignupGroupIndex === -1) {
        return;
      }

      permissions[updatedSignupGroupIndex].signupMessage.caption =
        e.target.value;

      // if caption is empty, disable the message
      if (e.target.value === "") {
        permissions[updatedSignupGroupIndex].signupMessage.enabled = false;
      }

      this.setState({
        workspacePermissions: permissions,
      });
    };

  /**
   * Handles signup group message save
   * @param signupGroup signupGroup
   */
  handlePermissionSignupGroupMessageToggle =
    (signupGroup: WorkspaceSignupGroup) =>
    (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      const permissions = [...this.state.workspacePermissions];

      const updatedSignupGroupIndex = permissions.findIndex(
        (permission) =>
          permission.userGroupEntityId === signupGroup.userGroupEntityId
      );

      if (updatedSignupGroupIndex === -1) {
        return;
      }

      // toggle enabled
      permissions[updatedSignupGroupIndex].signupMessage.enabled =
        !permissions[updatedSignupGroupIndex].signupMessage.enabled;

      this.setState({
        workspacePermissions: permissions,
      });
    };

  /**
   * saveImage
   * @param croppedB64 croppedB64
   * @param originalB64 originalB64
   * @param file file
   */
  saveImage(croppedB64: string, originalB64?: string, file?: File) {
    const { t } = this.props;

    this.props.updateCurrentWorkspaceImagesB64({
      originalB64: originalB64,
      croppedB64: croppedB64,
      /**
       * success
       */
      success: () => {
        this.props.displayNotification(
          t("notifications.saveSuccess", {
            ns: "workspace",
            context: "coverImage",
          }),
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
    const { t } = this.props;

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
      language: this.state.workspaceLanguage,
    };
    const currentWorkspaceAsUpdate: WorkspaceUpdateType = {
      name: this.props.workspace.name,
      published: this.props.workspace.published,
      access: this.props.workspace.access,
      nameExtension: this.props.workspace.nameExtension,
      materialDefaultLicense: this.props.workspace.materialDefaultLicense,
      description: this.props.workspace.description,
      hasCustomImage: this.props.workspace.hasCustomImage,
      language: this.props.workspace.language,
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

    const workspaceDetails: WorkspaceDetails = {
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

    const currentWorkspaceAsDetails: WorkspaceDetails = {
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

    // Set signup message to null if caption or content either is empty
    // Api does not accept empty values, it must be null
    const realPermissions = this.state.workspacePermissions.map((pr) => ({
      ...pr,
      signupMessage:
        pr.signupMessage.caption === "" || pr.signupMessage.content === ""
          ? null
          : pr.signupMessage,
    }));

    // Check if permissions have changed
    if (!equals(this.props.workspace.permissions, realPermissions)) {
      payload = Object.assign(
        {
          permissions: realPermissions,
        },
        payload
      );
    }

    // Set signup message to null if caption or content either is empty
    // Api does not accept empty values, it must be null
    const realSignupMessage =
      this.state.workspaceSignupMessage.caption === "" ||
      this.state.workspaceSignupMessage.content === ""
        ? null
        : this.state.workspaceSignupMessage;

    // Check if signup message has changed
    if (!equals(this.props.workspace.signupMessage, realSignupMessage)) {
      payload = Object.assign(
        { signupMessage: this.state.workspaceSignupMessage },
        payload
      );
    }

    this.props.updateWorkspace({
      workspace: this.props.workspace,
      update: payload,
      /**
       * success
       */
      success: () => {
        this.props.displayNotification(
          t("notifications.saveSuccess", { ns: "workspace", context: "data" }),
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
    const { t } = this.props;

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
          title={t("labels.settings")}
        >
          <section className="application-sub-panel application-sub-panel--workspace-settings">
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
                        value={this.state.workspaceLanguage}
                        onChange={this.updateWorkspaceLanguage}
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
              {t("labels.image", { ns: "workspace" })}
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
                      {t("wcag.workspaceImage", {
                        ns: "workspace",
                      })}
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
                          {t("actions.edit", { ns: "common" })}
                        </Button>
                        <Button
                          buttonModifiers="change-image-delete button--change-image-workspace"
                          onClick={this.removeCustomImage}
                        >
                          <span className="icon icon-trash" />

                          {t("actions.remove")}
                        </Button>
                      </div>
                    ) : (
                      <div className="change-image__default-content">
                        {t("content.changeImage", { ns: "workspace" })}
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
                            checked={this.state.workspacePublished === true}
                            onChange={this.setWorkspacePublishedTo.bind(
                              this,
                              true
                            )}
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
                            checked={this.state.workspacePublished === false}
                            onChange={this.setWorkspacePublishedTo.bind(
                              this,
                              false
                            )}
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
                            checked={
                              this.state.workspaceAccess === "MEMBERS_ONLY"
                            }
                            onChange={this.setWorkspaceAccessTo.bind(
                              this,
                              "MEMBERS_ONLY"
                            )}
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
                            checked={this.state.workspaceAccess === "LOGGED_IN"}
                            onChange={this.setWorkspaceAccessTo.bind(
                              this,
                              "LOGGED_IN"
                            )}
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
                            checked={this.state.workspaceAccess === "ANYONE"}
                            onChange={this.setWorkspaceAccessTo.bind(
                              this,
                              "ANYONE"
                            )}
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
          </section>

          <section className="application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {t("labels.signUpSchedule", { ns: "workspace" })}
            </h2>
            <div className="application-sub-panel__body">
              <div className="form__row form__row--split">
                <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-start-date">
                  <label
                    htmlFor="workspaceSignupStartDate"
                    className="application-sub-panel__item-header"
                  >
                    {t("labels.signUpBeginDate", { ns: "workspace" })}
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
                    locale={outputCorrectDatePickerLocale(localize.language)}
                    selected={this.state.workspaceSignupStartDate}
                    dateFormat="P"
                  />
                </div>
                <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-start-date">
                  <label
                    htmlFor="workspaceSignupEndDate"
                    className="application-sub-panel__item-header"
                  >
                    {t("labels.signUpEndDate", { ns: "workspace" })}
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
                    locale={outputCorrectDatePickerLocale(localize.language)}
                    selected={this.state.workspaceSignupEndDate}
                    dateFormat="P"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {t("labels.additionalInfo", { ns: "workspace" })}
            </h2>
            <div className="application-sub-panel__body">
              <div className="form__row form__row--workspace-management">
                <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-name-extension">
                  <label htmlFor="workspaceNameExtension">
                    {t("labels.nameExtension", { ns: "workspace" })}
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
                  <label htmlFor="workspaceType">{t("labels.type")}</label>
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
                    {t("labels.begingDate", { ns: "workspace" })}
                  </label>
                  <DatePicker
                    id="workspaceStartDate"
                    className="form-element__input"
                    onChange={this.updateStartDate}
                    maxDate={this.state.workspaceEndDate}
                    locale={outputCorrectDatePickerLocale(localize.language)}
                    selected={this.state.workspaceStartDate}
                    dateFormat="P"
                  />
                </div>
                <div className="form-element application-sub-panel__item application-sub-panel__item--workspace-management application-sub-panel__item--workspace-end-date">
                  <label
                    htmlFor="workspaceEndDate"
                    className="application-sub-panel__item-header"
                  >
                    {t("labels.endDate", { ns: "workspace" })}
                  </label>
                  <DatePicker
                    id="workspaceEndDate"
                    className="form-element__input"
                    onChange={this.updateEndDate}
                    minDate={this.state.workspaceStartDate}
                    locale={outputCorrectDatePickerLocale(localize.language)}
                    selected={this.state.workspaceEndDate}
                    dateFormat="P"
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="form-element application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {t("labels.license", { ns: "workspace" })}
            </h2>
            <div className="application-sub-panel__body">
              <LicenseSelector
                wcagLabel="workspaceLicense"
                wcagDesc={t("wcag.workspaceLicense", { ns: "workspace" })}
                modifier="workspace-management"
                value={this.state.workspaceLicense}
                onChange={this.updateLicense}
              />
            </div>
          </section>
          <section className="form-element  application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {t("labels.producers", { ns: "users" })}
            </h2>
            {this.state.workspaceProducers ? (
              <div className="application-sub-panel__body">
                <AddProducer
                  wcagLabel="workspaceProducer"
                  removeProducer={this.removeProducer}
                  addProducer={this.addProducer}
                  producers={this.state.workspaceProducers}
                />
              </div>
            ) : null}
          </section>
          {this.props.status.permissions.CHAT_AVAILABLE ? (
            <section className="application-sub-panel application-sub-panel--workspace-settings">
              <h2 className="application-sub-panel__header">
                {t("labels.chat")}
              </h2>
              <div className="application-sub-panel__body">
                <div className="form__row">
                  <fieldset className="form__fieldset">
                    <legend className="form__legend">
                      {t("labels.chatStatus", { ns: "workspace" })}
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
                          {t("labels.chatEnabled", { ns: "workspace" })}
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
                          {t("labels.chatDisabled", { ns: "workspace" })}
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
              Työtilan ilmoittautumisviesti
              <Dropdown
                openByHover
                alignSelfVertically="top"
                content={
                  <p>
                    Aktivoi ilmoittautumisviesti. Tämä on mahdollista kun
                    viestin otsikko ja sisältö on asetettu
                  </p>
                }
              >
                <span>
                  <label
                    htmlFor="enable-workspace-signup-message"
                    className="visually-hidden"
                  >
                    Aktivoi ilmoittautumisviesti
                  </label>
                  <input
                    id="enable-workspace-signup-message"
                    type="checkbox"
                    className={`button-pill button-pill--autoreply-switch ${
                      this.state.workspaceSignupMessage.enabled
                        ? "button-pill--autoreply-switch-active"
                        : ""
                    }`}
                    checked={this.state.workspaceSignupMessage.enabled}
                    disabled={
                      this.state.workspaceSignupMessage.caption === "" ||
                      this.state.workspaceSignupMessage.content === ""
                    }
                    onClick={this.handleWorkspaceSignupMessageToggle}
                  />
                </span>
              </Dropdown>
            </h2>
            <div className="application-sub-panel__body">
              <div className="form__container">
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="message-caption">Viestin otsikko</label>
                    <input
                      id="message-caption"
                      placeholder={`Tervetuloa kurssille ${this.state.workspaceName}`}
                      className="form-element__input"
                      value={this.state.workspaceSignupMessage.caption}
                      onChange={this.handleWorkspaceSignupMessageCaptionChange}
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
                <div className="form__row">
                  <div className="form-element">
                    <label>Viestin sisältö</label>
                    <CKEditor
                      editorTitle="Ilmoittautumisviestin sisältö"
                      ancestorHeight={200}
                      onChange={this.handleWorkspaceSignupMessageContentChange}
                    >
                      {this.state.workspaceSignupMessage.content}
                    </CKEditor>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="application-sub-panel application-sub-panel--workspace-settings">
            <h2 className="application-sub-panel__header">
              {t("labels.signUpRights", { ns: "workspace" })}
            </h2>
            <div className="application-sub-panel__body">
              <div className="form__row">
                <SearchFormElement
                  delay={0}
                  id="workspacePermissions"
                  modifiers="subpanel-search"
                  name="workspace-permissions"
                  placeholder={t("labels.search", {
                    ns: "users",
                    context: "userGroups",
                  })}
                  value={this.state.workspaceUsergroupNameFilter}
                  updateField={this.updateWorkspaceUsergroupNameFilter}
                />
              </div>

              <div className="form__row">
                <fieldset className="form__fieldset">
                  <legend className="form__legend">
                    {t("labels.userGroups", { ns: "users" })}
                  </legend>
                  <div className="form__fieldset-content form__fieldset-content--vertical">
                    {/*
                If we ever have multiple permissions to set then we need to use the following code.
                Also input and label elements needs to have htmlFor and id attributes removed if there are more than one checkboxes

                  {PERMISSIONS_TO_EXTRACT.map((pte, index) =>
                  <div className="what" key={pte}>{this.props.t("plugin.workspace.permissions.label." + pte)}</div>
                  )}
                */}

                    {this.state.workspacePermissions
                      .filter((permission) =>
                        filterMatch(
                          permission.userGroupName,
                          this.state.workspaceUsergroupNameFilter
                        )
                      )
                      .map((permission) => {
                        const signupGroupEditModifiers: string[] = [];
                        const signupGroupToggleModifiers: string[] = [];

                        if (permission.signupMessage) {
                          if (permission.signupMessage.content !== "") {
                            signupGroupEditModifiers.push("active");
                          }

                          if (permission.signupMessage.enabled) {
                            signupGroupToggleModifiers.push("active");
                          }
                        }

                        return (
                          <details
                            key={permission.userGroupEntityId}
                            style={{
                              width: "100%",
                            }}
                          >
                            <summary>
                              <span className="form-element form-element--checkbox-radiobutton-inside-summary">
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

                              <Dropdown
                                openByHover
                                alignSelfVertically="top"
                                content={
                                  <p>
                                    Aktivoi ryhmäkohtainen ilmoittautumisviesti.
                                    Tämä on mahdollista kun viestin otsikko ja
                                    sisältö on asetettu
                                  </p>
                                }
                              >
                                <span>
                                  <label
                                    htmlFor="enable-signup-message"
                                    className="visually-hidden"
                                  >
                                    Aktivoi ilmoittautumisviesti
                                  </label>
                                  <input
                                    id="enable-signup-message"
                                    type="checkbox"
                                    className={`button-pill button-pill--autoreply-switch ${
                                      permission.signupMessage.enabled
                                        ? "button-pill--autoreply-switch-active"
                                        : ""
                                    }`}
                                    checked={permission.signupMessage.enabled}
                                    disabled={
                                      permission.signupMessage.caption === "" ||
                                      permission.signupMessage.content === ""
                                    }
                                    onClick={this.handlePermissionSignupGroupMessageToggle(
                                      permission
                                    )}
                                  />
                                </span>
                              </Dropdown>
                            </summary>

                            <div className="details__content">
                              <div className="form__container">
                                <div className="form__row">
                                  <div className="form-element">
                                    <label htmlFor="message-caption">
                                      Viestin otsikko
                                    </label>
                                    <input
                                      id="message-caption"
                                      placeholder={`Tervetuloa kurssille ${this.state.workspaceName}`}
                                      className="form-element__input"
                                      value={permission.signupMessage.caption}
                                      onChange={this.handlePermissionSignupGroupMessageCaptionChange(
                                        permission
                                      )}
                                      style={{
                                        width: "100%",
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="form__row">
                                  <div className="form-element">
                                    <label>Viestin sisältö</label>
                                    <CKEditor
                                      editorTitle="Ilmoittautumisviestin sisältö"
                                      ancestorHeight={200}
                                      onChange={this.handlePermissionSignupGroupMessageContentChange(
                                        permission
                                      )}
                                    >
                                      {permission.signupMessage.content}
                                    </CKEditor>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </details>
                        );
                      })}
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
                {t("actions.save", { ns: "materials" })}
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

export default withTranslation(["workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(ManagementPanel)
);
