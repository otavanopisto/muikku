import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { GuiderType } from "~/reducers/main-function/guider";
import { StateType } from "~/reducers";
import { AnyActionType } from "~/actions/index";
import { connect, Dispatch } from "react-redux";
import FileDeleteDialog from "../../../dialogs/file-delete";
import FileUploader from "~/components/general/file-uploader";
import { bindActionCreators } from "redux";
import { UserFileType } from "~/reducers/user-index";
import Workspaces from "../workspaces";
import MainChart from "~/components/general/graph/main-chart";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";
import Navigation, { NavigationElement } from "~/components/general/navigation";
import {
  AddFileToCurrentStudentTriggerType,
  addFileToCurrentStudent,
} from "~/actions/main-function/guider";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import variables from "~/sass/_exports.scss";

type studyHistoryAside = "history" | "library";

/**
 * StudyHistory props
 */
interface StudyHistoryProps {
  i18n: i18nType;
  guider: GuiderType;
  addFileToCurrentStudent: AddFileToCurrentStudentTriggerType;
}

/**
 *StudyHistory component
 * @param props StudyHistoryProps
 * @returns JSX.Element
 */
const StudyHistory: React.FC<StudyHistoryProps> = (props) => {
  const mobileBreakpoint = parseInt(variables.mobilebreakpoint); //Parse a breakpoint from scss to a number
  const isAtMobileWidth = useIsAtBreakpoint(mobileBreakpoint);
  const [navigationActive, setNavigationActive] =
    React.useState<studyHistoryAside>("history");

  if (
    !props.guider.currentStudent ||
    !props.guider.currentStudent.pastWorkspaces ||
    !props.guider.currentStudent.activityLogs
  ) {
    return null;
  }

  const { i18n, addFileToCurrentStudent } = props;
  const {
    activityLogs,
    activityLogState,
    pastWorkspaces,
    pastWorkspacesState,
    currentWorkspaces,
    basic,
    files,
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
        {i18n.text.get("plugin.guider.user.tabs.studyHistory.aside.history")}
      </NavigationElement>
      <NavigationElement
        id={"studyLibrary"}
        onClick={() => handleNavigationClick("library")}
        isActive={navigationActive === "library" ? true : false}
      >
        {i18n.text.get("plugin.guider.user.tabs.studyHistory.aside.library")}
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
        hintText={i18n.text.get("plugin.guider.user.details.files.hint")}
        fileTooLargeErrorText={i18n.text.get(
          "plugin.guider.user.details.files.fileFieldUpload.fileSizeTooLarge"
        )}
        files={files}
        fileIdKey="id"
        fileNameKey="title"
        fileUrlGenerator={(f) => `/rest/guider/files/${f.id}/content`}
        deleteDialogElement={FileDeleteDialog}
        modifier="guider"
        emptyText={i18n.text.get("plugin.guider.user.details.files.empty")}
        uploadingTextProcesser={(percent: number) =>
          i18n.text.get("plugin.guider.user.details.files.uploading", percent)
        }
        notificationOfSuccessText={i18n.text.get(
          "plugin.guider.fileUpload.successful"
        )}
        displayNotificationOnSuccess
      />
    </div>
  );

  const historyComponent = (
    <React.Fragment key="history-component">
      <ApplicationSubPanel>
        <ApplicationSubPanel.Header>
          {i18n.text.get("plugin.guider.user.details.workspaces")}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body>
          {pastWorkspacesState === "READY" ? (
            <Workspaces workspaces={pastWorkspaces} />
          ) : (
            <div className="loader-empty" />
          )}
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>
      <ApplicationSubPanel>
        <ApplicationSubPanel.Header>
          {i18n.text.get("plugin.guider.user.details.statistics")}
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
        {i18n.text.get("plugin.guider.user.details.files")}
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
    <ApplicationPanelBody modifier="guider-student" asideBefore={aside}>
      {studyHistoryContent()}
    </ApplicationPanelBody>
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
    i18n: state.i18n,
    guider: state.guider,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudyHistory);
