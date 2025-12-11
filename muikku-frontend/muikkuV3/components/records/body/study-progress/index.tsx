import * as React from "react";
import WorkspaceSignup from "~/components/coursepicker/dialogs/workspace-signup";
import { WorkspaceSuggestion } from "~/generated/client";
import { SummaryStudyProgress } from "~/reducers/main-function/records/summary";
import ProgressList from "./components/progress-list";
import ProgressTable from "./components/progress-table";
import OPSMatrixProblems from "~/components/general/OPS-matrix/OPS-matrix-problems";
import OPSMatrixIndicators from "~/components/general/OPS-matrix/OPS-matrix-indicators";
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

  /**
   * Handles open sign up dialog
   * @param workspaceToSignUp workspaceToSignUp
   */
  const handleOpenSignUpDialog = (workspaceToSignUp: WorkspaceSuggestion) => {
    setWorkspaceToSignUp(workspaceToSignUp);
  };

  return (
    <>
      <OPSMatrixProblems
        matrixType={studyProgress.courseMatrix.type}
        matrixProblems={studyProgress.courseMatrix.problems}
      />

      <OPSMatrixIndicators />

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
            matrix={studyProgress.courseMatrix}
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
            matrix={studyProgress.courseMatrix}
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
