import * as React from "react";
import ProgressList from "./components/progress-list";
import ProgressTable from "./components/progress-table";
import OPSMatrixProblems from "~/components/general/OPS-matrix/OPS-matrix-problems";
import OPSMatrixIndicators from "~/components/general/OPS-matrix/OPS-matrix-indicators";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import {
  filterActivityBySubjects,
  OTHER_SUBJECT_OUTSIDE_HOPS_CS,
  LANGUAGE_SUBJECTS_CS,
  SKILL_AND_ART_SUBJECTS_CS,
  filterActivity,
} from "~/helper-functions/study-matrix";
import { useMemo } from "react";
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

  const courseMatrix = useSelector(
    (state: StateType) => state.guardian.currentDependant.dependantCourseMatrix
  );

  const studyActivityItems = useSelector(
    (state: StateType) =>
      state.guardian.currentDependant.dependantStudyActivity?.items
  );

  const skillAndArtCourses = React.useMemo(() => {
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
          />
        </div>
      </div>
    </>
  );
};

export default StudyProgress;
