import * as React from "react";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import {
  UpdateStudyProgressTriggerType,
  updateStudyProgress,
} from "~/actions/main-function/records/summary";
import { StudentStudyActivity } from "~/generated/client";
import {
  filterActivity,
  LANGUAGE_SUBJECTS_CS,
  OTHER_SUBJECT_OUTSIDE_HOPS_CS,
  SKILL_AND_ART_SUBJECTS_CS,
} from "~/helper-functions/study-matrix";
import { filterActivityBySubjects } from "~/helper-functions/study-matrix";
import { StateType } from "~/reducers";
import { SummaryDataType } from "~/reducers/main-function/records/summary";
import { WebsocketStateType } from "~/reducers/util/websocket";

/**
 * StudyProgressWatcherContextProviderProps
 */
interface StudyProgressWatcherProps {
  children: React.ReactNode;
  summaryData: SummaryDataType;
  websocketState: WebsocketStateType;
  updateStudyProgress: UpdateStudyProgressTriggerType;
}

/**
 * ProgressWebsocketWatcherContextProvider
 * @param props props
 * @returns JSX.Element
 */
const StudyProgressWatcher = (props: StudyProgressWatcherProps) => {
  const { children, summaryData, websocketState, updateStudyProgress } = props;

  // hops:workspace-suggested watcher
  React.useEffect(() => {
    /**
     * onAnswerSavedAtServer
     * Websocket event callback to handle answer from server when
     * something is saved/changed
     * @param data Websocket data
     */
    const onAnswerSavedAtServer = (data: StudentStudyActivity) => {
      const { suggestedNextList, onGoingList, gradedList, transferedList } =
        summaryData.studyProgress;

      let arrayOfStudentActivityCourses: StudentStudyActivity[] = [].concat(
        suggestedNextList
      );

      // If course id is null, meaning that delete existing activity course by
      // finding that specific course with subject code and course number and splice it out

      const indexOfCourse = arrayOfStudentActivityCourses.findIndex(
        (item) =>
          item.courseId === data.courseId && data.subject === item.subject
      );

      if (indexOfCourse !== -1) {
        arrayOfStudentActivityCourses.splice(indexOfCourse, 1);
      } else {
        // Add new
        arrayOfStudentActivityCourses.push(data);
      }

      // After possible suggestion checking is done, then concat other lists also
      arrayOfStudentActivityCourses = arrayOfStudentActivityCourses.concat(
        onGoingList,
        gradedList,
        transferedList
      );

      const skillAndArtCourses = filterActivityBySubjects(
        SKILL_AND_ART_SUBJECTS_CS,
        arrayOfStudentActivityCourses
      );

      const otherLanguageSubjects = filterActivityBySubjects(
        LANGUAGE_SUBJECTS_CS,
        arrayOfStudentActivityCourses
      );

      const otherSubjects = filterActivityBySubjects(
        OTHER_SUBJECT_OUTSIDE_HOPS_CS,
        arrayOfStudentActivityCourses
      );

      // Filtered activity courses by status
      const studentActivityByStatus = filterActivity(
        arrayOfStudentActivityCourses
      );

      updateStudyProgress({
        studyProgress: {
          ...summaryData.studyProgress,
          suggestedNextList: studentActivityByStatus.suggestedNextList,
          onGoingList: studentActivityByStatus.onGoingList,
          gradedList: studentActivityByStatus.gradedList,
          transferedList: studentActivityByStatus.transferedList,
          skillsAndArt: { ...skillAndArtCourses },
          otherLanguageSubjects: { ...otherLanguageSubjects },
          otherSubjects: { ...otherSubjects },
        },
      });
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocketState.websocket.addEventCallback(
      "hops:workspace-suggested",
      onAnswerSavedAtServer
    );

    return () => {
      // Remove callback when unmounting
      websocketState.websocket.removeEventCallback(
        "hops:workspace-suggested",
        onAnswerSavedAtServer
      );
    };
  }, [
    summaryData.studyProgress,
    updateStudyProgress,
    websocketState.websocket,
  ]);

  // hops:workspace-signup watcher
  React.useEffect(() => {
    /**
     * onAnswerSavedAtServer
     * Websocket event callback to handle answer from server when
     * something is saved/changed
     * @param data Websocket data
     */
    const onAnswerSavedAtServer = (
      data: StudentStudyActivity | StudentStudyActivity[]
    ) => {
      const { suggestedNextList, onGoingList, gradedList, transferedList } =
        summaryData.studyProgress;

      // Concated list of different suggestions
      let arrayOfStudentActivityCourses: StudentStudyActivity[] = [].concat(
        onGoingList,
        gradedList,
        transferedList,
        suggestedNextList
      );

      const isArray = Array.isArray(data);

      if (isArray) {
        arrayOfStudentActivityCourses = arrayOfStudentActivityCourses.filter(
          (item) => item.courseId !== data[0].courseId
        );
      } else {
        arrayOfStudentActivityCourses = arrayOfStudentActivityCourses.filter(
          (item) => item.courseId !== data.courseId
        );
      }

      arrayOfStudentActivityCourses =
        arrayOfStudentActivityCourses.concat(data);

      const skillAndArtCourses = filterActivityBySubjects(
        SKILL_AND_ART_SUBJECTS_CS,
        arrayOfStudentActivityCourses
      );

      const otherLanguageSubjects = filterActivityBySubjects(
        LANGUAGE_SUBJECTS_CS,
        arrayOfStudentActivityCourses
      );

      const otherSubjects = filterActivityBySubjects(
        OTHER_SUBJECT_OUTSIDE_HOPS_CS,
        arrayOfStudentActivityCourses
      );

      // Filtered activity courses by status
      const studentActivityByStatus = filterActivity(
        arrayOfStudentActivityCourses
      );

      updateStudyProgress({
        studyProgress: {
          ...summaryData.studyProgress,
          suggestedNextList: studentActivityByStatus.suggestedNextList,
          onGoingList: studentActivityByStatus.onGoingList,
          gradedList: studentActivityByStatus.gradedList,
          transferedList: studentActivityByStatus.transferedList,
          skillsAndArt: { ...skillAndArtCourses },
          otherLanguageSubjects: { ...otherLanguageSubjects },
          otherSubjects: { ...otherSubjects },
        },
      });
    };

    websocketState.websocket.addEventCallback(
      "hops:workspace-signup",
      onAnswerSavedAtServer
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:workspace-signup",
        onAnswerSavedAtServer
      );
    };
  }, [summaryData.studyProgress, updateStudyProgress, websocketState]);

  return <>{children}</>;
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    websocketState: state.websocket,
    summaryData: state.summary.data,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      updateStudyProgress,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudyProgressWatcher);
