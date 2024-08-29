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
  updateWorkspaceSettings,
  UpdateWorkspaceSettingsTriggerType,
  UpdateSettingsPayload,
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
  WorkspaceSettings,
  WorkspaceSignupGroup,
  WorkspaceSettingsSignupGroup,
  WorkspaceSignupMessage,
  WorkspaceType,
} from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { ManagementSignupGroupsMemoized } from "./management-signup-groups";
import { ManagementSignupMessageMemoized } from "./management-signup-message";
import { ManagementCustomSignupMessageMemoized } from "./management-custom-signup-message";
import { ManagementChatSettingsMemoized } from "./management-chat-settings";
import { ManagementLicenseMemoized } from "./management-license";
import { ManagementProducersMemoized } from "./management-producers";
import { ManagementScheduleMemoized } from "./management-schedule";
import { ManagementAdditionalInfoMemoized } from "./management-additional-info";
import { ManagementVisibilityMemoized } from "./management-visibility";
import { ManagementBasicInfoMemoized } from "./management-basic-info";
import { ManagementImageMemoized } from "./management-image";
import license from "../../workspaceHome/license";

/**
 * ManagementPanelProps
 */
interface ManagementPanelProps extends WithTranslation {
  workspace: WorkspaceDataType;
  workspaceTypes: WorkspaceType[];
  updateWorkspaceSettings: UpdateWorkspaceSettingsTriggerType;
  updateWorkspaceProducersForCurrentWorkspace: UpdateWorkspaceProducersForCurrentWorkspaceTriggerType;
  updateCurrentWorkspaceImagesB64: UpdateCurrentWorkspaceImagesB64TriggerType;
  updateWorkspaceDetailsForCurrentWorkspace: UpdateWorkspaceDetailsForCurrentWorkspaceTriggerType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * ManagementPanelState
 */
interface ManagementPanelState extends WorkspaceSettings {
  producers: Array<WorkspaceMaterialProducer>;
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
      id: 0,
      curriculumIdentifiers: [],
      organizationEntityId: 0,
      urlName: "",
      name: "",
      language: "fi",
      published: false,
      access: "ANYONE",
      nameExtension: "",
      workspaceTypeIdentifier: "",
      beginDate: null,
      endDate: null,
      signupStart: null,
      signupEnd: null,
      description: "",
      materialDefaultLicense: "",
      hasCustomImage: false,
      signupGroups: [],
      defaultSignupMessage: {
        caption: "",
        content: "",
        enabled: false,
      },
      signupMessages: [],
      producers: [],
      chatEnabled: false,
      locked: false,
    });

  React.useEffect(() => {
    if (!workspace || !workspace.settings) {
      return;
    }
    const { settings } = workspace;

    // Cannot be null for the component
    if (!settings.defaultSignupMessage) {
      settings.defaultSignupMessage = {
        caption: "",
        content: "",
        enabled: false,
      };
    }

    setManagementState({
      ...settings,
      producers: [],
      locked: false,
    });
  }, [workspace]);

  const {
    name,
    language,
    published,
    access,
    nameExtension,
    workspaceTypeIdentifier,
    beginDate,
    endDate,
    signupStart,
    signupEnd,
    description,
    materialDefaultLicense,
    hasCustomImage,
    signupGroups,
    defaultSignupMessage,
    signupMessages,
    producers,
    chatEnabled,
    locked,
  } = managementState;

  /**
   * Handles workspace name change
   */
  const handleWorkspaceNameChange = React.useCallback((name: string) => {
    setManagementState((prevState) => ({
      ...prevState,
      name,
    }));
  }, []);

  /**
   * Handles language change
   */
  const handleWorkspaceLanguageChange = React.useCallback(
    (language: Language) => {
      setManagementState((prevState) => ({
        ...prevState,
        language,
      }));
    },
    []
  );

  /**
   * Handles description change
   */
  const handleDescriptionChange = React.useCallback((description: string) => {
    setManagementState((prevState) => ({
      ...prevState,
      description,
    }));
  }, []);

  /**
   * Handles published change
   */
  const handlePublishedChange = React.useCallback((published: boolean) => {
    setManagementState((prevState) => ({
      ...prevState,
      published,
    }));
  }, []);

  /**
   * Handles access change
   */
  const handleAccessChange = React.useCallback((access: WorkspaceAccess) => {
    setManagementState((prevState) => ({
      ...prevState,
      access,
    }));
  }, []);

  /**
   * Handles image change
   */
  const handleImageChange = React.useCallback((hasCustomImage: boolean) => {
    setManagementState((prevState) => ({
      ...prevState,
      hasCustomImage,
    }));
  }, []);

  /**
   * Handles signup start date change
   */
  const handleSignupStartDateChange = React.useCallback((signupStart: Date) => {
    setManagementState((prevState) => ({
      ...prevState,
      signupStart,
    }));
  }, []);

  /**
   * Handles signup end date change
   */
  const handleSignupEndDateChange = React.useCallback((signupEnd: Date) => {
    setManagementState((prevState) => ({
      ...prevState,
      signupEnd,
    }));
  }, []);

  /**
   * Handles workspace type change
   * @param type type
   */
  const handleUpdateWorkspaceTypeChange = React.useCallback(
    (workspaceTypeIdentifier: string) => {
      setManagementState((prevState) => ({
        ...prevState,
        workspaceTypeIdentifier,
      }));
    },
    []
  );

  /**
   * Handles workspace extension change
   */
  const handleWorkspaceExtensionChange = React.useCallback(
    (nameExtension: string) => {
      setManagementState((prevState) => ({
        ...prevState,
        nameExtension,
      }));
    },
    []
  );

  const handleWorkspaceStartDateChange = React.useCallback(
    (beginDate: Date) => {
      setManagementState((prevState) => ({
        ...prevState,
        beginDate,
      }));
    },
    []
  );

  const handleWorkspaceEndDateChange = React.useCallback((endDate: Date) => {
    setManagementState((prevState) => ({
      ...prevState,
      endDate,
    }));
  }, []);

  /**
   * Handles workspace license change
   */
  const handleWorkspaceLicenseChange = React.useCallback(
    (materialDefaultLicense: string) => {
      setManagementState((prevState) => ({
        ...prevState,
        materialDefaultLicense,
      }));
    },
    []
  );

  /**
   * Handles signup group message change
   */
  const handleWorkspaceSignupMessageChange = React.useCallback(
    (defaultSignupMessage: WorkspaceSignupMessage) => {
      setManagementState((prevState) => ({
        ...prevState,
        defaultSignupMessage,
      }));
    },
    []
  );

  /**
   * Handles custom signup group message change
   */
  const handleWorkspaceCustomSignupMessageChange = React.useCallback(
    (signupMessages: WorkspaceSignupMessage[]) => {
      setManagementState((prevState) => ({
        ...prevState,
        signupMessages,
      }));
    },
    []
  );

  /**
   * Handles signup group message change
   */
  const handleWorkspaceSignupGroupChange = React.useCallback(
    (group: WorkspaceSignupGroup) => {
      setManagementState((prevState) => {
        const signupGroups = prevState.signupGroups.map((pr) => {
          if (pr.userGroupEntityId === group.userGroupEntityId) {
            return group;
          }
          return pr;
        });

        return {
          ...prevState,
          signupGroups,
        };
      });
    },
    []
  );

  // Outside of the settings object

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
   * Handles management settings save click
   */
  const handleSaveClick = () => {
    const { t } = props;
    setManagementState((prevState) => ({
      ...prevState,
      locked: true,
    }));

    const payload: UpdateSettingsPayload = managementState;
    delete payload["signupGroups"];

    // const workspaceUpdate: WorkspaceUpdateType = {
    //   name: managementState.workspaceName,
    //   published: managementState.workspacePublished,
    //   access: managementState.workspaceAccess,
    //   nameExtension: managementState.workspaceExtension,
    //   materialDefaultLicense: managementState.workspaceLicense,
    //   description: managementState.workspaceDescription,
    //   hasCustomImage: managementState.workspaceHasCustomImage,
    //   language: managementState.workspaceLanguage,
    // };
    // const currentWorkspaceAsUpdate: WorkspaceUpdateType = {
    //   name: name,
    //   published: published,
    //   access: access,
    //   nameExtension: nameExtension,
    //   materialDefaultLicense: materialDefaultLicense,
    //   description: description,
    //   hasCustomImage: hasCustomImage,
    //   language: language,
    // };

    // if (!equals(workspaceUpdate, currentWorkspaceAsUpdate)) {
    //   payload = Object.assign(workspaceUpdate, payload);
    // }

    // const workspaceMaterialProducers = managementState.workspaceProducers;

    // if (!equals(workspaceMaterialProducers, workspace.producers)) {
    //   payload = Object.assign(
    //     { producers: workspaceMaterialProducers },
    //     payload
    //   );
    // }

    // const workspaceDetails: WorkspaceDetails = {
    //   externalViewUrl: workspace.details.externalViewUrl,
    //   typeId: managementState.workspaceType,
    //   beginDate:
    //     managementState.workspaceStartDate !== null
    //       ? managementState.workspaceStartDate.toISOString()
    //       : null,
    //   endDate:
    //     managementState.workspaceEndDate !== null
    //       ? managementState.workspaceEndDate.toISOString()
    //       : null,
    //   rootFolderId: workspace.details.rootFolderId,
    //   helpFolderId: workspace.details.helpFolderId,
    //   indexFolderId: workspace.details.indexFolderId,
    //   signupStart:
    //     managementState.workspaceSignupStartDate !== null
    //       ? managementState.workspaceSignupStartDate.toISOString()
    //       : null,
    //   signupEnd:
    //     managementState.workspaceSignupEndDate !== null
    //       ? managementState.workspaceSignupEndDate.toISOString()
    //       : null,
    //   chatEnabled: managementState.workspaceChatEnabled,
    // };

    // const currentWorkspaceAsDetails: WorkspaceDetails = {
    //   externalViewUrl: workspace.details.externalViewUrl,
    //   typeId: workspace.details.typeId,
    //   beginDate: moment(workspace.details.beginDate).toISOString(),
    //   endDate: moment(workspace.details.endDate).toISOString(),
    //   rootFolderId: workspace.details.rootFolderId,
    //   helpFolderId: workspace.details.helpFolderId,
    //   indexFolderId: workspace.details.indexFolderId,
    //   signupStart: moment(workspace.details.signupStart).toISOString(),
    //   signupEnd: moment(workspace.details.signupEnd).toISOString(),
    //   chatEnabled: workspace.details.chatEnabled,
    // };

    // if (!equals(workspaceDetails, currentWorkspaceAsDetails)) {
    //   payload = Object.assign({ details: workspaceDetails }, payload);
    // }

    // let showError = false;

    // Set signup message to null if caption and content is empty
    // Api does not accept empty values, it must be null. Otherwise if one of the fields is empty,
    // Backend will handle it with error nad notifications will be shown
    // const realPermissions = managementState.workspacePermissions.map((pr) => ({
    //   ...pr,
    // }));

    // Check if permissions have changed
    // if (!equals(workspace.permissions, realPermissions)) {
    //   payload = Object.assign(
    //     {
    //       permissions: realPermissions,
    //     },
    //     payload
    //   );
    // }

    // Prevent saving if signup message is partly empty
    // if (
    //   (managementState.workspaceSignupMessage.caption === "" &&
    //     managementState.workspaceSignupMessage.content !== "") ||
    //   (managementState.workspaceSignupMessage.caption !== "" &&
    //     managementState.workspaceSignupMessage.content === "")
    // ) {
    //   showError = true;
    // }

    // Set signup message to null if caption or content either is empty
    // signup message object must be null. Otherwise if one of the fields is empty,
    // Backend will handle it with error nad notifications will be shown
    // const realSignupMessage =
    //   managementState.workspaceSignupMessage.caption === "" &&
    //   managementState.workspaceSignupMessage.content === ""
    //     ? null
    //     : managementState.workspaceSignupMessage;

    // Check if signup message has changed
    // if (
    //   !equals(
    //     workspace.settings && workspace.settings.defaultSignupMessage,
    //     realSignupMessage
    //   )
    // ) {
    //   payload = Object.assign(
    //     { defaultSignupMessage: managementState.workspaceSignupMessage },
    //     payload
    //   );
    // }

    // Show error notification if signup message is partly empty
    // And terminate saving
    // if (showError) {
    //   props.displayNotification(
    //     t("notifications.updateError", {
    //       ns: "workspace",
    //       context: "settings",
    //     }),
    //     "error"
    //   );

    //   setManagementState((prevState) => ({
    //     ...prevState,
    //     locked: false,
    //   }));
    //   return;
    // }

    props.updateWorkspaceSettings({
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
    () => signupStart,
    [signupStart]
  );

  const workspaceSignupEndDateMemoized = React.useMemo(
    () => signupEnd,
    [signupEnd]
  );

  const memoizedWorkspaceTypes = React.useMemo(
    () => workspaceTypes,
    [workspaceTypes]
  );

  const memoizedWorkspaceProducers = React.useMemo(
    () => producers,
    [producers]
  );

  const memoizedSignupGroups = React.useMemo(
    () => signupGroups,
    [signupGroups]
  );

  const memoizedWorkspaceSignupMessage = React.useMemo(
    () => defaultSignupMessage,
    [defaultSignupMessage]
  );
  const memoizedCustomWorkspaceSignupMessage = React.useMemo(
    () => signupMessages,
    [signupMessages]
  );

  return (
    <>
      <ApplicationPanel
        modifier="workspace-management"
        title={t("labels.settings")}
      >
        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementBasicInfoMemoized
            workspaceName={name}
            workspaceDescription={description}
            workspaceLanguage={language}
            externalViewUrl={workspace?.details?.externalViewUrl}
            onWorkspaceNameChange={handleWorkspaceNameChange}
            onWorkspaceDescriptionChange={handleDescriptionChange}
            onWorkspaceLanguageChange={handleWorkspaceLanguageChange}
          />
        </section>
        <section className="application-sub-panel application-sub-panel--workspace-settings application-sub-panel--workspace-image-settings">
          <ManagementImageMemoized
            workspaceEntityId={workspace?.id}
            workspaceHasCustomImage={hasCustomImage}
            onImageStatusChange={handleImageChange}
          />
        </section>
        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementVisibilityMemoized
            workspacePublished={published}
            workspaceAccess={access}
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
            workspaceNameExtension={nameExtension}
            workspaceType={workspaceTypeIdentifier}
            workspaceTypes={memoizedWorkspaceTypes}
            workspaceStartDate={beginDate}
            workspaceEndDate={endDate}
            onWorkspaceStartDateChange={handleWorkspaceStartDateChange}
            onWorkspaceEndDateChange={handleWorkspaceEndDateChange}
            onWorkspaceTypeChange={handleUpdateWorkspaceTypeChange}
            onWorkspaceNameExtensionChange={handleWorkspaceExtensionChange}
          />
        </section>
        <section className="form-element application-sub-panel application-sub-panel--workspace-settings">
          <ManagementLicenseMemoized
            workspaceLicense={materialDefaultLicense}
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
            chatEnabled={chatEnabled}
            onChange={handleWorkspaceChatSettingsChange}
          />
        </section>
        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementSignupMessageMemoized
            workspaceName={name}
            workspaceSignupMessage={memoizedWorkspaceSignupMessage}
            onChange={handleWorkspaceSignupMessageChange}
          />
        </section>
        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementCustomSignupMessageMemoized
            signupGroups={signupGroups}
            workspaceCustomSignupMessages={memoizedCustomWorkspaceSignupMessage}
            onChange={handleWorkspaceCustomSignupMessageChange}
          />
        </section>
        {/* <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementSignupGroupsMemoized
            workspaceName={workspaceName}
            workspaceSignupGroups={memoizedPermissions}
            onChange={handleWorkspaceSignupGroupChange}
          />
        </section> */}
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
      updateWorkspaceSettings,
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
