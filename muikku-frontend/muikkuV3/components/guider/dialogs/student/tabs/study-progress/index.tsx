import * as React from "react";
import { GuiderStudentStudyProgress } from "~/reducers/main-function/guider";
import ProgressList from "./components/progress-list";
import SignUpBehalfStudentDialog from "./dialogs/sign-up-behalf-student";
import ProgressTable from "./components/progress-table";
import { useState } from "react";
import { WorkspaceSuggestion } from "~/generated/client";
import OPSMatrixProblems from "~/components/general/OPS-matrix/OPS-matrix-problems";
import OPSMatrixIndicators from "~/components/general/OPS-matrix/OPS-matrix-indicators";

/**
 * ProgressHopsPlanningProps
 */
interface StudyProgressProps {
  studentIdentifier: string;
  studentUserEntityId: number;
  studyProgrammeName: string;
  curriculumName: string;
  studyProgress: GuiderStudentStudyProgress;
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
    useState<WorkspaceSuggestion | null>(null);

  /**
   * Handles sign up behalf
   * @param workspaceToSignUp workspaceToSignUp
   */
  const handleSignUpBehalf = (workspaceToSignUp: WorkspaceSuggestion) => {
    setWorkspaceToSignUp(workspaceToSignUp);
  };

  return (
    <>
      <div className="hops__form-element-container  swiper-no-swiping">
        <OPSMatrixProblems
          matrixType={studyProgress.courseMatrix.type}
          matrixProblems={studyProgress.courseMatrix.problems}
        />
      </div>

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
            matrix={studyProgress.courseMatrix}
            onSignUpBehalf={handleSignUpBehalf}
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
            matrix={studyProgress.courseMatrix}
            onSignUpBehalf={handleSignUpBehalf}
          />
        </div>
      </div>

      <SignUpBehalfStudentDialog
        isOpen={!!workspaceToSignUp}
        studentEntityId={studentUserEntityId}
        workspaceSuggestion={workspaceToSignUp}
        onClose={() => setWorkspaceToSignUp(null)}
      />
    </>
  );
};

export default StudyProgress;
