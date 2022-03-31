import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { GuiderType } from "~/reducers/main-function/guider";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import FileDeleteDialog from "../../dialogs/file-delete";
import FileUploader from "~/components/general/file-uploader";
import { bindActionCreators } from "redux";
import { UserFileType } from "~/reducers/user-index";
import Workspaces from "./workspaces";
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
  const { i18n, guider, addFileToCurrentStudent } = props;

  const [navigationActive, setNavigationActive] =
    React.useState<studyHistoryAside>("history");

  const studentWorkspaces = (
    <Workspaces workspaces={guider.currentStudent.pastWorkspaces} />
  );

  const mobileBreakpoint = parseInt(variables.mobileBreakpoint); //Parse a breakpoint from scss to a number

  const isAtMobileWidth = useIsAtBreakpoint(mobileBreakpoint);

  if (
    !props.guider.currentStudent.pastWorkspaces ||
    !props.guider.currentStudent.activityLogs
  ) {
    return null;
  }

  /**
   * Switches the active navigaton state
   * @param id
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
   * Aside navigation for the study-history
   */
  const aside = (
    <Navigation>
      <NavigationElement
        id={"studyHistory"}
        onClick={handleNavigationClick.bind(this, "history")}
        isActive={navigationActive === "history" ? true : false}
      >
        {i18n.text.get("plugin.guider.user.tabs.studyHistory.aside.history")}
      </NavigationElement>
      <NavigationElement
        id={"studyLibrary"}
        onClick={handleNavigationClick.bind(this, "library")}
        isActive={navigationActive === "library" ? true : false}
      >
        {i18n.text.get("plugin.guider.user.tabs.studyHistory.aside.library")}
      </NavigationElement>
    </Navigation>
  );
  /**
   * historyDataLoaded
   */
  const historyDataLoaded =
    guider.currentStudent.activityLogs && guider.currentStudent.pastWorkspaces
      ? true
      : false;
  /**
   * formDataGenerator
   * @param file file
   * @param formData formData
   */
  const formDataGenerator = (file: File, formData: FormData) => {
    formData.append("upload", file);
    formData.append("title", file.name);
    formData.append("description", "");
    formData.append("userIdentifier", guider.currentStudent.basic.id);
  };

  const files = guider.currentStudent.basic && (
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
        files={guider.currentStudent.files}
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

  /**
   * studyHisrtoryContent switches the corrent component
   * @returns JSX.element
   */
  const studyHistoryContent = () => {
    if (!isAtMobileWidth) {
      switch (navigationActive) {
        case "history": {
          return (
            <>
              <ApplicationSubPanel>
                <ApplicationSubPanel.Header>
                  {i18n.text.get("plugin.guider.user.details.workspaces")}
                </ApplicationSubPanel.Header>
                <ApplicationSubPanel.Body>
                  {studentWorkspaces}
                </ApplicationSubPanel.Body>
              </ApplicationSubPanel>
              <ApplicationSubPanel>
                <ApplicationSubPanel.Header>
                  {i18n.text.get("plugin.guider.user.details.statistics")}
                </ApplicationSubPanel.Header>
                <ApplicationSubPanel.Body>
                  <MainChart
                    workspaces={guider.currentStudent.pastWorkspaces}
                    activityLogs={guider.currentStudent.activityLogs}
                  />
                </ApplicationSubPanel.Body>
              </ApplicationSubPanel>
            </>
          );
        }
        case "library": {
          return (
            <ApplicationSubPanel>
              <ApplicationSubPanel.Header>
                {i18n.text.get("plugin.guider.user.details.files")}
              </ApplicationSubPanel.Header>
              <ApplicationSubPanel.Body>{files}</ApplicationSubPanel.Body>
            </ApplicationSubPanel>
          );
        }
      }
    } else {
      return (
        <>
          <ApplicationSubPanel>
            <ApplicationSubPanel.Header>
              {i18n.text.get("plugin.guider.user.details.workspaces")}
            </ApplicationSubPanel.Header>
            <ApplicationSubPanel.Body>
              {studentWorkspaces}
            </ApplicationSubPanel.Body>
          </ApplicationSubPanel>
          <ApplicationSubPanel>
            <ApplicationSubPanel.Header>
              {i18n.text.get("plugin.guider.user.details.statistics")}
            </ApplicationSubPanel.Header>
            <ApplicationSubPanel.Body>
              <MainChart
                workspaces={guider.currentStudent.pastWorkspaces}
                activityLogs={guider.currentStudent.activityLogs}
              />
            </ApplicationSubPanel.Body>
          </ApplicationSubPanel>

          <ApplicationSubPanel>
            <ApplicationSubPanel.Header>
              {i18n.text.get("plugin.guider.user.details.files")}
            </ApplicationSubPanel.Header>
            <ApplicationSubPanel.Body>{files}</ApplicationSubPanel.Body>
          </ApplicationSubPanel>
        </>
      );
    }
  };

  return (
    <ApplicationPanelBody modifier="guider-student" asideBefore={aside}>
      {historyDataLoaded ? studyHistoryContent() : null}
    </ApplicationPanelBody>
  );
};

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
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
