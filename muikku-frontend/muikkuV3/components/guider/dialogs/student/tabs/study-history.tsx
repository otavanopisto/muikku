import * as React from "react";
import { GuiderState } from "~/reducers/main-function/guider";
import { StateType } from "~/reducers";
import { AnyActionType } from "~/actions/index";
import { connect } from "react-redux";
import FileDeleteDialog from "../../../dialogs/file-delete";
import FileUploader from "~/components/general/file-uploader";
import { Action, bindActionCreators, Dispatch } from "redux";
import { UserFileType } from "~/reducers/user-index";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import Navigation, { NavigationElement } from "~/components/general/navigation";
import {
  AddFileToCurrentStudentTriggerType,
  UpdateSelectedEducationTypeCodeTriggerType,
  addFileToCurrentStudent,
  updateSelectedEducationTypeCode,
} from "~/actions/main-function/guider";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import { useTranslation } from "react-i18next";
import MainChart from "~/components/general/graph/main-chart";
import { breakpoints } from "~/util/breakpoints";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import RecordsListing from "~/components/general/records-history/records";
import RecordsEducationTypeSelector from "~/components/general/records-history/records-education-type-selector";

type studyHistoryAside = "history" | "library";

/**
 * StudyHistory props
 */
interface StudyHistoryProps {
  guider: GuiderState;
  addFileToCurrentStudent: AddFileToCurrentStudentTriggerType;
  updateSelectedEducationTypeCode: UpdateSelectedEducationTypeCodeTriggerType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 *StudyHistory component
 * @param props StudyHistoryProps
 * @returns JSX.Element
 */
const StudyHistory: React.FC<StudyHistoryProps> = (props) => {
  const isAtMobileWidth = useIsAtBreakpoint(breakpoints.breakpointPad);
  const [navigationActive, setNavigationActive] =
    React.useState<studyHistoryAside>("history");
  const { t } = useTranslation(["guider", "materials"]);

  if (
    !props.guider.currentStudent ||
    !props.guider.currentStudent.pastWorkspaces ||
    !props.guider.currentStudent.activityLogs
  ) {
    return null;
  }

  const {
    addFileToCurrentStudent,
    displayNotification,
    updateSelectedEducationTypeCode,
  } = props;
  const {
    activityLogs,
    basic,
    files,
    currentWorkspaces,
    pastWorkspaces,
    activityLogState,
    studyDataByEducationTypeCode,
    educationTypes,
    selectedEducationTypeCode,
  } = props.guider.currentStudent;

  const studyActivity =
    studyDataByEducationTypeCode[selectedEducationTypeCode]?.studyActivity;
  const courseMatrix =
    studyDataByEducationTypeCode[selectedEducationTypeCode]?.courseMatrix;
  const curriculumConfig =
    studyDataByEducationTypeCode[selectedEducationTypeCode]?.curriculumConfig;

  if (!studyActivity || !courseMatrix) {
    return null;
  }

  /**
   * Switches the active navigaton state
   * @param id study history aside id
   */
  const handleNavigationClick = (id: studyHistoryAside) => {
    switch (id) {
      case "history": {
        setNavigationActive("history");
        break;
      }
      case "library": {
        setNavigationActive("library");
        break;
      }
    }
  };

  /**
   * Handles the selection of an education type code
   * @param educationTypeCode education type code
   */
  const handleSelectEducationTypeCode = (educationTypeCode: string) => {
    updateSelectedEducationTypeCode({ educationTypeCode });
  };

  const combinedWorkspaces = [...currentWorkspaces, ...pastWorkspaces];

  /**
   * Aside navigation for the study-history
   */
  const aside = (
    <Navigation>
      <NavigationElement
        id={"studyHistory"}
        onClick={() => handleNavigationClick("history")}
        isActive={navigationActive === "history" ? true : false}
      >
        {t("labels.history")}
      </NavigationElement>
      <NavigationElement
        id={"studyLibrary"}
        onClick={() => handleNavigationClick("library")}
        isActive={navigationActive === "library" ? true : false}
      >
        {t("labels.library", { ns: "guider" })}
      </NavigationElement>
    </Navigation>
  );

  /**
   * formDataGenerator
   * @param file file
   * @param formData formData
   */
  const formDataGenerator = (file: File, formData: FormData) => {
    formData.append("upload", file);
    formData.append("title", file.name);
    formData.append("description", "");
    formData.append("userIdentifier", basic.id);
  };

  const userFiles = basic && (
    <div className="application-sub-panel__body">
      <FileUploader
        url="/transcriptofrecordsfileupload/"
        formDataGenerator={formDataGenerator}
        displayNotificationOnError
        onFileSuccess={(file: File, data: UserFileType) => {
          addFileToCurrentStudent(data);
        }}
        hintText={t("content.addAttachmentInstruction", { ns: "guider" })}
        fileTooLargeErrorText={t("notifications.sizeTooLarge", { ns: "files" })}
        files={files}
        fileIdKey="id"
        fileNameKey="title"
        fileUrlGenerator={(f) => `/rest/guider/files/${f.id}/content`}
        deleteDialogElement={FileDeleteDialog}
        modifier="guider"
        emptyText={t("content.empty", { ns: "files" })}
        uploadingTextProcesser={(percent: number) =>
          t("content.statusUploading", { ns: "materials", progress: percent })
        }
        notificationOfSuccessText={t("notifications.uploadSuccess", {
          ns: "files",
        })}
        displayNotificationOnSuccess
      />
    </div>
  );

  const studentRecords = (
    <ApplicationSubPanel>
      <ApplicationSubPanel.Body>
        <RecordsListing
          recordsInfo={{
            identifier: basic.id,
            userEntityId: basic.userEntityId,
            displayNotification,
            curriculumConfig: curriculumConfig,
            studyActivity: studyActivity,
            courseMatrix: courseMatrix,
          }}
          emptyMessage={t("content.notInWorkspaces", {
            ns: "guider",
          })}
          educationTypeSelector={
            <RecordsEducationTypeSelector
              options={educationTypes.map((educationTypeCode) => ({
                educationTypeCode,
                label: educationTypeCode,
              }))}
              selectedEducationTypeCode={selectedEducationTypeCode}
              onSelect={handleSelectEducationTypeCode}
            />
          }
        />
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );

  const historyComponent = (
    <React.Fragment key="history-component">
      <ApplicationSubPanel>{studentRecords}</ApplicationSubPanel>
      <ApplicationSubPanel>
        <ApplicationSubPanel.Header>
          {t("labels.stats", { ns: "common" })}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body>
          {activityLogState === "READY" ? (
            <MainChart
              workspaces={combinedWorkspaces}
              activityLogs={activityLogs}
            />
          ) : (
            <div className="loader-empty" />
          )}
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>
    </React.Fragment>
  );

  const libraryComponent = (
    <ApplicationSubPanel key="library-component">
      <ApplicationSubPanel.Header>
        {t("labels.files", { ns: "common" })}
      </ApplicationSubPanel.Header>
      <ApplicationSubPanel.Body>{userFiles}</ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );

  /**
   * studyHistoryContent switches the corrent component
   * @returns JSX.element
   */
  const studyHistoryContent = () => {
    if (!isAtMobileWidth) {
      switch (navigationActive) {
        case "history": {
          return historyComponent;
        }
        case "library": {
          return libraryComponent;
        }
      }
    } else {
      return [historyComponent, libraryComponent];
    }
  };

  return (
    <ApplicationPanel modifier="tabs-with-dialog" asideBefore={aside}>
      {studyHistoryContent()}
    </ApplicationPanel>
  );
};

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      addFileToCurrentStudent,
      displayNotification,
      updateSelectedEducationTypeCode,
    },
    dispatch
  );
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    guider: state.guider,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudyHistory);
