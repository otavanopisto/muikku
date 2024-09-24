import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import Button from "~/components/general/button";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/change-image.scss";
import "~/sass/elements/wcag.scss";
import {
  updateWorkspaceSettings,
  UpdateWorkspaceSettingsTriggerType,
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
import { AnyActionType } from "~/actions/index";
import {
  Language,
  WorkspaceAccess,
  WorkspaceMaterialProducer,
  WorkspaceSettings,
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
  workspaceType: string;
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
      workspaceType: "",
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
      externalViewLink: "",
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
      workspaceType:
        workspaceTypes.find(
          (type) => type.identifier === settings.workspaceTypeIdentifier
        )?.name || "",
      producers: workspace.producers,
      locked: false,
    });
  }, [workspace, workspaceTypes]);

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
    externalViewLink,
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
   */
  const handleUpdateWorkspaceTypeChange = React.useCallback(
    (workspaceType: WorkspaceType) => {
      setManagementState((prevState) => ({
        ...prevState,
        workspaceTypeIdentifier: workspaceType.identifier,
        workspaceType: workspaceType.name,
      }));
    },
    []
  );

  /**
   * Handles workspace extension change
   *
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
    (group: WorkspaceSettingsSignupGroup) => {
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
        producers,
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
        chatEnabled,
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

    const payload = managementState;

    const settingsPayload: WorkspaceSettings = {
      ...managementState,
    };

    props.updateWorkspaceSettings({
      workspace: workspace,
      update: {
        producers: payload.producers,
        workspaceType: payload.workspaceType,
        settings: settingsPayload,
      },
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

  const memoizedCustomWorkspaceSignupMessages = React.useMemo(
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
            externalViewUrl={externalViewLink}
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
            workspaceCustomSignupMessages={
              memoizedCustomWorkspaceSignupMessages
            }
            onChange={handleWorkspaceCustomSignupMessageChange}
          />
        </section>
        <section className="application-sub-panel application-sub-panel--workspace-settings">
          <ManagementSignupGroupsMemoized
            workspaceName={name}
            workspaceSignupGroups={memoizedSignupGroups}
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
