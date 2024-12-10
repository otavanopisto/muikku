import * as React from "react";
import { useTranslation } from "react-i18next";
import WorkspaceSignup from "~/components/coursepicker/dialogs/workspace-signup";
import { WorkspaceSuggestion } from "~/generated/client";
import { SummaryStudyProgress } from "~/reducers/main-function/records/summary";
import ProgressList from "./components/progress-list";
import ProgressTable from "./components/progress-table";
/**
 * StudyProgressProps
 */
interface StudyProgressProps {
  studentIdentifier: string;
  studentUserEntityId: number;
  studyProgrammeName: string;
  curriculumName: string;
  studyProgress: SummaryStudyProgress;
}

/**
 * StudyProgress
 * @param props props
 * @returns JSX.Element
 */
const StudyProgress: React.FC<StudyProgressProps> = (props) => {
  const {
    studentIdentifier,
    studentUserEntityId,
    studyProgrammeName,
    curriculumName,
    studyProgress,
  } = props;

  const [workspaceToSignUp, setWorkspaceToSignUp] =
    React.useState<WorkspaceSuggestion | null>(null);

  const { t } = useTranslation(["studyMatrix"]);

  /**
   * Handles open sign up dialog
   * @param workspaceToSignUp workspaceToSignUp
   */
  const handleOpenSignUpDialog = (workspaceToSignUp: WorkspaceSuggestion) => {
    setWorkspaceToSignUp(workspaceToSignUp);
  };

  return (
    <>
      <div className="hops-container__study-tool-indicators">
        <div className="hops-container__study-tool-indicator-container--legend-title">
          {t("labels.colorDescriptions", { ns: "studyMatrix" })}
        </div>
        <div className="hops-container__study-tool-indicator-container">
          <div className="hops-container__indicator-item hops-container__indicator-item--mandatory"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.mandatory", { ns: "studyMatrix" })}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--optional"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.optional", { ns: "studyMatrix" })}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--approval"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.transferred", { ns: "studyMatrix" })}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--completed"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.completed", { ns: "studyMatrix" })}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--inprogress"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.inProgress", { ns: "studyMatrix" })}
          </div>
        </div>

        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--next"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.guidanceCouncelorSuggestionNext", { ns: "studyMatrix" })}
          </div>
        </div>
      </div>

      <div className="hops__form-element-container hops__form-element-container--pad-upforwards swiper-no-swiping">
        <div className="list">
          <ProgressTable
            studentIdentifier={studentIdentifier}
            studentUserEntityId={studentUserEntityId}
            studyProgrammeName={studyProgrammeName}
            curriculumName={curriculumName}
            suggestedNextList={studyProgress.suggestedNextList}
            onGoingList={studyProgress.onGoingList}
            transferedList={studyProgress.transferedList}
            gradedList={studyProgress.gradedList}
            needSupplementationList={studyProgress.needSupplementationList}
            skillsAndArt={studyProgress.skillsAndArt}
            otherLanguageSubjects={studyProgress.otherLanguageSubjects}
            otherSubjects={studyProgress.otherSubjects}
            studentOptions={studyProgress.options}
            onSignUp={handleOpenSignUpDialog}
          />
        </div>
      </div>

      <div className="hops__form-element-container hops__form-element-container--mobile swiper-no-swiping">
        <div className="table">
          <ProgressList
            studentIdentifier={studentIdentifier}
            studentUserEntityId={studentUserEntityId}
            curriculumName={curriculumName}
            studyProgrammeName={studyProgrammeName}
            suggestedNextList={studyProgress.suggestedNextList}
            onGoingList={studyProgress.onGoingList}
            transferedList={studyProgress.transferedList}
            gradedList={studyProgress.gradedList}
            needSupplementationList={studyProgress.needSupplementationList}
            skillsAndArt={studyProgress.skillsAndArt}
            otherLanguageSubjects={studyProgress.otherLanguageSubjects}
            otherSubjects={studyProgress.otherSubjects}
            studentOptions={studyProgress.options}
            onSignUp={handleOpenSignUpDialog}
          />
        </div>
      </div>

      <WorkspaceSignup
        isOpen={!!workspaceToSignUp}
        workspaceSignUpDetails={
          workspaceToSignUp && {
            id: workspaceToSignUp.id,
            name: workspaceToSignUp.name,
            nameExtension: workspaceToSignUp.nameExtension,
            urlName: workspaceToSignUp.urlName,
          }
        }
        onClose={() => setWorkspaceToSignUp(null)}
        redirectOnSuccess
      />
    </>
  );
};

export default StudyProgress;
