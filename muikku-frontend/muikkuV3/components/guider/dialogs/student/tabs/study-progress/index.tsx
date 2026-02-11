import * as React from "react";
import ProgressList from "./components/progress-list";
import SignUpBehalfStudentDialog from "./dialogs/sign-up-behalf-student";
import ProgressTable from "./components/progress-table";
import { useMemo, useState } from "react";
import { WorkspaceSuggestion } from "~/generated/client";
import OPSMatrixProblems from "~/components/general/OPS-matrix/OPS-matrix-problems";
import OPSMatrixIndicators from "~/components/general/OPS-matrix/OPS-matrix-indicators";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import {
  filterActivity,
  filterActivityBySubjects,
  LANGUAGE_SUBJECTS_CS,
  OTHER_SUBJECT_OUTSIDE_HOPS_CS,
  SKILL_AND_ART_SUBJECTS_CS,
} from "~/helper-functions/study-matrix";

/**
 * ProgressHopsPlanningProps
 */
interface StudyProgressProps {
  studentIdentifier: string;
  studentUserEntityId: number;
  studyProgrammeName: string;
  curriculumName: string;
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
  } = props;

  const [workspaceToSignUp, setWorkspaceToSignUp] =
    useState<WorkspaceSuggestion | null>(null);

  const courseMatrix = useSelector(
    (state: StateType) => state.guider.currentStudent?.courseMatrix ?? null
  );

  const studyActivityItems = useSelector(
    (state: StateType) => state.guider.currentStudent?.studyActivity?.items
  );

  const skillAndArtCourses = useMemo(() => {
    if (!studyActivityItems) return {};
    return filterActivityBySubjects(
      SKILL_AND_ART_SUBJECTS_CS,
      studyActivityItems
    );
  }, [studyActivityItems]);

  const otherLanguageSubjects = useMemo(() => {
    if (!studyActivityItems) return {};
    return filterActivityBySubjects(LANGUAGE_SUBJECTS_CS, studyActivityItems);
  }, [studyActivityItems]);

  const otherSubjects = useMemo(() => {
    if (!studyActivityItems) return {};
    return filterActivityBySubjects(
      OTHER_SUBJECT_OUTSIDE_HOPS_CS,
      studyActivityItems
    );
  }, [studyActivityItems]);

  const studentActivityByStatus = useMemo(() => {
    if (!studyActivityItems)
      return {
        needSupplementationList: [],
        onGoingList: [],
        suggestedNextList: [],
        transferedList: [],
        gradedList: [],
      };
    return filterActivity(studyActivityItems);
  }, [studyActivityItems]);

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
          matrixType={courseMatrix?.type}
          matrixProblems={courseMatrix?.problems}
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
            suggestedNextList={studentActivityByStatus.suggestedNextList}
            onGoingList={studentActivityByStatus.onGoingList}
            transferedList={studentActivityByStatus.transferedList}
            gradedList={studentActivityByStatus.gradedList}
            needSupplementationList={
              studentActivityByStatus.needSupplementationList
            }
            skillsAndArt={skillAndArtCourses}
            otherLanguageSubjects={otherLanguageSubjects}
            otherSubjects={otherSubjects}
            matrix={courseMatrix}
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
            suggestedNextList={studentActivityByStatus.suggestedNextList}
            onGoingList={studentActivityByStatus.onGoingList}
            transferedList={studentActivityByStatus.transferedList}
            gradedList={studentActivityByStatus.gradedList}
            needSupplementationList={
              studentActivityByStatus.needSupplementationList
            }
            skillsAndArt={skillAndArtCourses}
            otherLanguageSubjects={otherLanguageSubjects}
            otherSubjects={otherSubjects}
            matrix={courseMatrix}
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
