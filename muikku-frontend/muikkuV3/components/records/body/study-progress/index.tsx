import * as React from "react";
import WorkspaceSignup from "~/components/coursepicker/dialogs/workspace-signup";
import { WorkspaceSuggestion } from "~/generated/client";
import ProgressList from "./components/progress-list";
import ProgressTable from "./components/progress-table";
import OPSMatrixProblems from "~/components/general/OPS-matrix/OPS-matrix-problems";
import OPSMatrixIndicators from "~/components/general/OPS-matrix/OPS-matrix-indicators";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { useMemo } from "react";
import {
  filterActivity,
  filterActivityBySubjects,
  LANGUAGE_SUBJECTS_CS,
  OTHER_SUBJECT_OUTSIDE_HOPS_CS,
  SKILL_AND_ART_SUBJECTS_CS,
} from "~/helper-functions/study-matrix";
/**
 * StudyProgressProps
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
    React.useState<WorkspaceSuggestion | null>(null);

  const courseMatrix = useSelector(
    (state: StateType) => state.studyActivity.courseMatrix
  );

  const studyActivityItems = useSelector(
    (state: StateType) => state.studyActivity.userStudyActivity?.items
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
   * Handles open sign up dialog
   * @param workspaceToSignUp workspaceToSignUp
   */
  const handleOpenSignUpDialog = (workspaceToSignUp: WorkspaceSuggestion) => {
    setWorkspaceToSignUp(workspaceToSignUp);
  };

  return (
    <>
      <OPSMatrixProblems
        matrixType={courseMatrix?.type}
        matrixProblems={courseMatrix?.problems}
      />

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
