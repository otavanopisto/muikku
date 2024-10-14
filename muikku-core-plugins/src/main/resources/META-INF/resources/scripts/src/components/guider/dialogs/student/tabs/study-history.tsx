import * as React from "react";
import { GuiderState } from "~/reducers/main-function/guider";
import { StateType } from "~/reducers";
import { AnyActionType } from "~/actions/index";
import { connect, Dispatch } from "react-redux";
import FileDeleteDialog from "../../../dialogs/file-delete";
import FileUploader from "~/components/general/file-uploader";
import { bindActionCreators } from "redux";
import { UserFileType } from "~/reducers/user-index";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import Navigation, { NavigationElement } from "~/components/general/navigation";
import {
  AddFileToCurrentStudentTriggerType,
  addFileToCurrentStudent,
} from "~/actions/main-function/guider";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import { useTranslation } from "react-i18next";
import RecordsGroup from "~/components/general/records-history/records-group";
import { breakpoints } from "~/util/breakpoints";
import { RecordsInfoProvider } from "~/components/general/records-history/context/records-info-context";
import MainChart from "~/components/general/graph2/main-chart";

type studyHistoryAside = "history" | "library";

/**
 * StudyHistory props
 */
interface StudyHistoryProps {
  guider: GuiderState;
  addFileToCurrentStudent: AddFileToCurrentStudentTriggerType;
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
  const { t } = useTranslation("guider");

  if (
    !props.guider.currentStudent ||
    !props.guider.currentStudent.pastWorkspaces ||
    !props.guider.currentStudent.pastStudies ||
    !props.guider.currentStudent.activityLogs
  ) {
    return null;
  }

  const { addFileToCurrentStudent } = props;
  const {
    activityLogs,
    pastStudies,
    basic,
    files,
    currentWorkspaces,
    pastWorkspaces,
    activityLogState,
  } = props.guider.currentStudent;

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
        {t("labels.library")}
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
        hintText={t("content.addAttachmentInstruction")}
        fileTooLargeErrorText={t("notifications.sizeTooLarge", { ns: "files" })}
        files={files}
        fileIdKey="id"
        fileNameKey="title"
        fileUrlGenerator={(f) => `/rest/guider/files/${f.id}/content`}
        deleteDialogElement={FileDeleteDialog}
        modifier="guider"
        emptyText={t("content.empty", { ns: "files" })}
        uploadingTextProcesser={(percent: number) =>
          t("notifications.uploading", { ns: "files", progress: percent })
        }
        notificationOfSuccessText={t("notifications.uploadSuccess", {
          ns: "files",
        })}
        displayNotificationOnSuccess
      />
    </div>
  );

  /**
   * studentRecords
   */
  const studentRecords = (
    <RecordsInfoProvider
      value={{
        identifier: basic.id,
        userEntityId: basic.userEntityId,
      }}
    >
      <ApplicationSubPanel>
        {pastStudies.map((lineCategoryData, i) => (
          <ApplicationSubPanel.Body key={lineCategoryData.lineCategory}>
            {lineCategoryData.credits.length +
              lineCategoryData.transferCredits.length >
            0 ? (
              <RecordsGroup
                key={`credit-category-${i}`}
                recordGroup={lineCategoryData}
              />
            ) : (
              <div className="application-sub-panel__item">
                <div className="empty">
                  <span>
                    {t("content.notInWorkspaces", {
                      ns: "guider",
                    })}
                  </span>
                </div>
              </div>
            )}
          </ApplicationSubPanel.Body>
        ))}
      </ApplicationSubPanel>
    </RecordsInfoProvider>
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ addFileToCurrentStudent }, dispatch);
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
