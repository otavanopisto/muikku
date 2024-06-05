import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceDataType, WorkspaceUpdateType } from "~/reducers/workspaces";
import Button from "~/components/general/button";
import equals = require("deep-equal");
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/change-image.scss";
import "~/sass/elements/wcag.scss";
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
import moment from "moment";
import { AnyActionType } from "~/actions/index";
import {
  Language,
  WorkspaceAccess,
  WorkspaceDetails,
  WorkspaceMaterialProducer,
  WorkspaceSignupGroup,
  WorkspaceSignupMessage,
  WorkspaceType,
} from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { ManagementSignupGroupsMemoized } from "./management-signup-groups";
import { ManagementSignupMessageMemoized } from "./management-signup-message";
import { ManagementChatSettingsMemoized } from "./management-chat-settings";
import { ManagementLicenseMemoized } from "./management-license";
import { ManagementProducersMemoized } from "./management-producers";
import { ManagementScheduleMemoized } from "./management-schedule";
import { ManagementAdditionalInfoMemoized } from "./management-additional-info";
import { ManagementVisibilityMemoized } from "./management-visibility";
import { ManagementBasicInfoMemoized } from "./management-basic-info";
import { ManagementImageMemoized } from "./management-image";

/**
 * ManagementPanelProps
 */
interface ManagementPanelProps extends WithTranslation {
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
  workspaceChatEnabled: boolean;
  workspaceSignupMessage: WorkspaceSignupMessage;
  locked: boolean;
}

/**
 * ManagementPanel
 * @param props props
 */
const ManagementPanel = (props: ManagementPanelProps) => {
  const { workspace, t, workspaceTypes } = props;

  const [managementState, setManagementState] =
    React.useState<ManagementPanelState>({
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
      workspaceDescription: "",
      workspaceLicense: "",
      workspaceHasCustomImage: false,
      workspaceChatEnabled: false,
      workspacePermissions: [],
      workspaceSignupMessage: {
        caption: "",
        content: "",
        enabled: false,
      },
      locked: false,
    });

  React.useEffect(() => {
    if (!workspace) {
      return;
    }

    setManagementState((prev) => ({
      ...prev,
      workspaceName: workspace ? workspace.name : null,
      workspacePublished: workspace ? workspace.published : null,
      workspaceAccess: workspace ? workspace.access : null,
      workspaceExtension: workspace ? workspace.nameExtension : null,
      workspaceType:
        workspace && workspace.details ? workspace.details.typeId : null,
      workspaceStartDate:
        workspace && workspace.details
          ? workspace.details.beginDate !== null
            ? moment(workspace.details.beginDate).toDate()
            : null
          : null,
      workspaceEndDate:
        workspace && workspace.details
          ? workspace.details.endDate !== null
            ? moment(workspace.details.endDate).toDate()
            : null
          : null,
      workspaceSignupStartDate:
        workspace && workspace.details
          ? workspace.details.signupStart !== null
            ? moment(workspace.details.signupStart).toDate()
            : null
          : null,
      workspaceSignupEndDate:
        workspace && workspace.details
          ? workspace.details.signupEnd !== null
            ? moment(workspace.details.signupEnd).toDate()
            : null
          : null,
      workspaceProducers:
        workspace && workspace.producers ? workspace.producers : null,
      workspaceLicense: workspace ? workspace.materialDefaultLicense : "",
      workspaceDescription: workspace ? workspace.description || "" : "",
      workspaceHasCustomImage: workspace ? workspace.hasCustomImage : false,
      workspacePermissions:
        workspace && workspace.permissions
          ? workspace.permissions.map((pr) => ({
              ...pr,
              signupMessage: pr.signupMessage || {
                caption: "",
                content: "",
                enabled: false,
              },
            }))
          : [],
      workspaceLanguage: workspace ? workspace.language : "fi",
      workspaceSignupMessage:
        workspace && workspace.signupMessage
          ? workspace.signupMessage
          : {
              caption: "",
              content: "",
              enabled: false,
            },
    }));
  }, [workspace]);

  const {
    workspaceName,
    workspaceLanguage,
    workspacePublished,
    workspaceAccess,
    workspaceExtension,
    workspaceType,
    workspaceStartDate,
    workspaceEndDate,
    workspaceSignupStartDate,
    workspaceSignupEndDate,
    workspaceProducers,
    workspaceDescription,
    workspaceLicense,
    workspaceHasCustomImage,
    workspacePermissions,
    workspaceSignupMessage,
    workspaceChatEnabled,
    locked,
  } = managementState;

  /**
   * Handles workspace name change
   */
  const handleWorkspaceNameChange = React.useCallback(
    (workspaceName: string) => {
      setManagementState((prevState) => ({
        ...prevState,
        workspaceName,
      }));
    },
    []
  );

  /**
   * Handles language change
   */
  const handleWorkspaceLanguageChange = React.useCallback(
    (language: string) => {
      setManagementState((prevState) => ({
        ...prevState,
        workspaceLanguage: language as Language,
      }));
    },
    []
  );

  /**
   * Handles description change
   */
  const handleDescriptionChange = React.useCallback((text: string) => {
    setManagementState((prevState) => ({
      ...prevState,
      workspaceDescription: text,
    }));
  }, []);

  /**
   * Handles published change
   */
  const handlePublishedChange = React.useCallback((value: boolean) => {
    setManagementState((prevState) => ({
      ...prevState,
      workspacePublished: value,
    }));
  }, []);

  /**
   * Handles access change
   */
  const handleAccessChange = React.useCallback((value: WorkspaceAccess) => {
    setManagementState((prevState) => ({
      ...prevState,
      workspaceAccess: value,
    }));
  }, []);

  /**
   * Handles image change
   */
  const handleImageChange = React.useCallback((status: boolean) => {
    setManagementState((prevState) => ({
      ...prevState,
      workspaceHasCustomImage: status,
    }));
  }, []);

  /**
   * Handles signup start date change
   */
  const handleSignupStartDateChange = React.useCallback((date: Date) => {
    setManagementState((prevState) => ({
      ...prevState,
      workspaceSignupStartDate: date,
    }));
  }, []);

  /**
   * Handles signup end date change
   */
  const handleSignupEndDateChange = React.useCallback((date: Date) => {
    setManagementState((prevState) => ({
      ...prevState,
      workspaceSignupEndDate: date,
    }));
  }, []);

  /**
   * Handles workspace type change
   * @param type type
   */
  const handleUpdateWorkspaceTypeChange = React.useCallback((type: string) => {
    setManagementState((prevState) => ({
      ...prevState,
      workspaceType: type,
    }));
  }, []);

  /**
   * Handles workspace extension change
   */
  const handleWorkspaceExtensionChange = React.useCallback(
    (extension: string) => {
      setManagementState((prevState) => ({
        ...prevState,
        workspaceExtension: extension,
      }));
    },
    []
  );

  const handleWorkspaceStartDateChange = React.useCallback((date: Date) => {
    setManagementState((prevState) => ({
      ...prevState,
      workspaceStartDate: date,
    }));
  }, []);

  const handleWorkspaceEndDateChange = React.useCallback((date: Date) => {
    setManagementState((prevState) => ({
      ...prevState,
      workspaceEndDate: date,
    }));
  }, []);

  /**
   * Handles workspace license change
   */
  const handleWorkspaceLicenseChange = React.useCallback(
    (newLicense: string) => {
      setManagementState((prevState) => ({
        ...prevState,
        workspaceLicense: newLicense,
      }));
    },
    []
  );

  /**
   * Handles workspace producers change
   */
  const handleWorkspaceProducersChange = React.useCallback(
    (producers: WorkspaceMaterialProducer[]) => {
      setManagementState((prevState) => ({
        ...prevState,
        workspaceProducers: producers,
      }));
    },
    []
  );

  /**
   * Handles workspace chat settings change
   */
  const handleWorkspaceChatSettingsChange = React.useCallback(
    (chatEnabled: boolean) => {
      setManagementState((prevState) => ({
        ...prevState,
        workspaceChatEnabled: chatEnabled,
      }));
    },
    []
  );

  /**
   * Handles signup group message change
   */
  const handleWorkspaceSignupMessageChange = React.useCallback(
    (message: WorkspaceSignupMessage) => {
      setManagementState((prevState) => ({
        ...prevState,
        workspaceSignupMessage: message,
      }));
    },
    []
  );

  /**
   * Handles signup group message change
   */
  const handleWorkspaceSignupGroupChange = React.useCallback(
    (groups: WorkspaceSignupGroup) => {
      setManagementState((prevState) => {
        const newPermissions = prevState.workspacePermissions.map((pr) => {
          if (pr.userGroupEntityId === groups.userGroupEntityId) {
            return groups;
          }
          return pr;
        });

        return {
          ...prevState,
          workspacePermissions: newPermissions,
        };
      });
    },
    []
  );

  /**
   * Handles management settings save click
   */
  const handleSaveClick = () => {
    const { t } = props;

    setManagementState((prevState) => ({
      ...prevState,
      locked: true,
    }));

    let payload: WorkspaceUpdateType = {};
    const workspaceUpdate: WorkspaceUpdateType = {
      name: managementState.workspaceName,
      published: managementState.workspacePublished,
      access: managementState.workspaceAccess,
      nameExtension: managementState.workspaceExtension,
      materialDefaultLicense: managementState.workspaceLicense,
      description: managementState.workspaceDescription,
      hasCustomImage: managementState.workspaceHasCustomImage,
      language: managementState.workspaceLanguage,
    };
    const currentWorkspaceAsUpdate: WorkspaceUpdateType = {
      name: workspace.name,
      published: workspace.published,
      access: workspace.access,
      nameExtension: workspace.nameExtension,
      materialDefaultLicense: workspace.materialDefaultLicense,
      description: workspace.description,
      hasCustomImage: workspace.hasCustomImage,
      language: workspace.language,
    };

    if (!equals(workspaceUpdate, currentWorkspaceAsUpdate)) {
      payload = Object.assign(workspaceUpdate, payload);
    }

    const workspaceMaterialProducers = managementState.workspaceProducers;

    if (!equals(workspaceMaterialProducers, workspace.producers)) {
      payload = Object.assign(
        { producers: workspaceMaterialProducers },
        payload
      );
    }

    const workspaceDetails: WorkspaceDetails = {
      externalViewUrl: workspace.details.externalViewUrl,
      typeId: managementState.workspaceType,
      beginDate:
        managementState.workspaceStartDate !== null
          ? managementState.workspaceStartDate.toISOString()
          : null,
      endDate:
        managementState.workspaceEndDate !== null
          ? managementState.workspaceEndDate.toISOString()
          : null,
      rootFolderId: workspace.details.rootFolderId,
      helpFolderId: workspace.details.helpFolderId,
      indexFolderId: workspace.details.indexFolderId,
      signupStart:
        managementState.workspaceSignupStartDate !== null
          ? managementState.workspaceSignupStartDate.toISOString()
          : null,
      signupEnd:
        managementState.workspaceSignupEndDate !== null
          ? managementState.workspaceSignupEndDate.toISOString()
          : null,
      chatEnabled: managementState.workspaceChatEnabled,
    };

    const currentWorkspaceAsDetails: WorkspaceDetails = {
      externalViewUrl: workspace.details.externalViewUrl,
      typeId: workspace.details.typeId,
      beginDate: moment(workspace.details.beginDate).toISOString(),
      endDate: moment(workspace.details.endDate).toISOString(),
      rootFolderId: workspace.details.rootFolderId,
      helpFolderId: workspace.details.helpFolderId,
      indexFolderId: workspace.details.indexFolderId,
      signupStart: moment(workspace.details.signupStart).toISOString(),
      signupEnd: moment(workspace.details.signupEnd).toISOString(),
      chatEnabled: workspace.details.chatEnabled,
    };

    if (!equals(workspaceDetails, currentWorkspaceAsDetails)) {
      payload = Object.assign({ details: workspaceDetails }, payload);
    }

    let showError = false;

    // Prevent saving if signup message is partly empty
    // and show notification
    showError = managementState.workspacePermissions.some((pr) => {
      if (
        (pr.signupMessage.caption !== "" && pr.signupMessage.content === "") ||
        (pr.signupMessage.caption === "" && pr.signupMessage.content !== "")
      ) {
        return true;
      }
    });

    // Set signup message to null if caption and content is empty
    // Api does not accept empty values, it must be null. Otherwise if one of the fields is empty,
    // Backend will handle it with error nad notifications will be shown
    const realPermissions = managementState.workspacePermissions.map((pr) => ({
      ...pr,
      signupMessage:
        pr.signupMessage.caption === "" && pr.signupMessage.content === ""
          ? null
          : pr.signupMessage,
    }));

    // Check if permissions have changed
    if (!equals(workspace.permissions, realPermissions)) {
      payload = Object.assign(
        {
          permissions: realPermissions,
        },
        payload
      );
    }

    // Prevent saving if signup message is partly empty
    if (
      (managementState.workspaceSignupMessage.caption === "" &&
        managementState.workspaceSignupMessage.content !== "") ||
      (managementState.workspaceSignupMessage.caption !== "" &&
        managementState.workspaceSignupMessage.content === "")
    ) {
      showError = true;
    }

    // Set signup message to null if caption or content either is empty
    // signup message object must be null. Otherwise if one of the fields is empty,
    // Backend will handle it with error nad notifications will be shown
    const realSignupMessage =
      managementState.workspaceSignupMessage.caption === "" &&
      managementState.workspaceSignupMessage.content === ""
        ? null
        : managementState.workspaceSignupMessage;

    // Check if signup message has changed
    if (!equals(workspace.signupMessage, realSignupMessage)) {
      payload = Object.assign(
        { signupMessage: managementState.workspaceSignupMessage },
        payload
      );
    }

    // Show error notification if signup message is partly empty
    // And terminate saving
    if (showError) {
      props.displayNotification(
        t("notifications.updateError", {
          ns: "workspace",
          context: "settings",
        }),
        "error"
      );

      setManagementState((prevState) => ({
        ...prevState,
        locked: false,
      }));
      return;
    }

    props.updateWorkspace({
      workspace: workspace,
      update: payload,
      /**
       * success
       */
      success: () => {
        props.displayNotification(
          t("notifications.saveSuccess", { ns: "workspace", context: "data" }),
          "success"
        );
        setManagementState((prevState) => ({
          ...prevState,
          locked: false,
        }));
      },
      /**
       * fail
       */
      fail: () => {
        setManagementState((prevState) => ({
          ...prevState,
          locked: false,
        }));
      },
    });
  };

  const workspaceSignupStartDateMemoized = React.useMemo(
    () => workspaceSignupStartDate,
    [workspaceSignupStartDate]
  );

  const workspaceSignupEndDateMemoized = React.useMemo(
    () => workspaceSignupEndDate,
    [workspaceSignupEndDate]
  );

  const memoizedWorkspaceTypes = React.useMemo(
    () => workspaceTypes,
    [workspaceTypes]
  );

  const memoizedWorkspaceProducers = React.useMemo(
    () => workspaceProducers,
    [workspaceProducers]
  );

  const memoizedPermissions = React.useMemo(
    () => workspacePermissions,
    [workspacePermissions]
  );

  const memoizedWorkspaceSignupMessage = React.useMemo(
    () => workspaceSignupMessage,
    [workspaceSignupMessage]
  );

  return (
    <>
      <ApplicationPanel
        modifier="workspace-management"
        title={t("labels.settings")}
      >
        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementBasicInfoMemoized
            workspaceName={workspaceName}
            workspaceDescription={workspaceDescription}
            workspaceLanguage={workspaceLanguage}
            externalViewUrl={workspace?.details?.externalViewUrl}
            onWorkspaceNameChange={handleWorkspaceNameChange}
            onWorkspaceDescriptionChange={handleDescriptionChange}
            onWorkspaceLanguageChange={handleWorkspaceLanguageChange}
          />
        </section>
        <section className="application-sub-panel application-sub-panel--workspace-settings application-sub-panel--workspace-image-settings">
          <ManagementImageMemoized
            workspaceEntityId={workspace?.id}
            workspaceHasCustomImage={workspaceHasCustomImage}
            onImageStatusChange={handleImageChange}
          />
        </section>
        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementVisibilityMemoized
            workspacePublished={workspacePublished}
            workspaceAccess={workspaceAccess}
            onWorkspacePublishedChange={handlePublishedChange}
            onWorkspaceAccessChange={handleAccessChange}
          />
        </section>

        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementScheduleMemoized
            workspaceSignupStartDate={workspaceSignupStartDateMemoized}
            workspaceSignupEndDate={workspaceSignupEndDateMemoized}
            onSignupStartDateChange={handleSignupStartDateChange}
            onSignupEndDateChange={handleSignupEndDateChange}
          />
        </section>

        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementAdditionalInfoMemoized
            workspaceNameExtension={workspaceExtension}
            workspaceType={workspaceType}
            workspaceTypes={memoizedWorkspaceTypes}
            workspaceStartDate={workspaceStartDate}
            workspaceEndDate={workspaceEndDate}
            onWorkspaceStartDateChange={handleWorkspaceStartDateChange}
            onWorkspaceEndDateChange={handleWorkspaceEndDateChange}
            onWorkspaceTypeChange={handleUpdateWorkspaceTypeChange}
            onWorkspaceNameExtensionChange={handleWorkspaceExtensionChange}
          />
        </section>
        <section className="form-element application-sub-panel application-sub-panel--workspace-settings">
          <ManagementLicenseMemoized
            workspaceLicense={workspaceLicense}
            onChange={handleWorkspaceLicenseChange}
          />
        </section>
        <section className="form-element  application-sub-panel application-sub-panel--workspace-settings">
          <ManagementProducersMemoized
            workspaceProducers={memoizedWorkspaceProducers}
            onChange={handleWorkspaceProducersChange}
          />
        </section>

        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementChatSettingsMemoized
            chatEnabled={workspaceChatEnabled}
            onChange={handleWorkspaceChatSettingsChange}
          />
        </section>

        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementSignupMessageMemoized
            workspaceName={workspaceName}
            workspaceSignupMessage={memoizedWorkspaceSignupMessage}
            onChange={handleWorkspaceSignupMessageChange}
          />
        </section>

        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementSignupGroupsMemoized
            workspaceName={workspaceName}
            workspaceSignupGroups={memoizedPermissions}
            onChange={handleWorkspaceSignupGroupChange}
          />
        </section>
        <section className="form-element  application-sub-panel application-sub-panel--workspace-settings">
          <div className="form__buttons form__buttons--workspace-management">
            <Button
              className="button--primary-function-save"
              disabled={locked}
              onClick={handleSaveClick}
            >
              {t("actions.save", { ns: "materials" })}
            </Button>
          </div>
        </section>
      </ApplicationPanel>
    </>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    workspace: state.workspaces.currentWorkspace,
    workspaceTypes: state.workspaces.types,
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
