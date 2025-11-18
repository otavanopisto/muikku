import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HopsForm } from "~/@types/hops";
import {
  updateMatriculationPlan,
  updateHopsLocked,
  updateHopsForm,
  updateHopsHistory,
  updateHopsStudyPlanGoals,
  updateHopsStudyPlanPlannedCourses,
  updateHopsStudyPlanPlanNotes,
} from "~/actions/main-function/hops/";
import {
  HopsGoals,
  HopsHistoryEntry,
  HopsLocked,
  MatriculationPlan,
  PlannedCourse,
  StudyPlannerNote,
} from "~/generated/client";
import { StateType } from "~/reducers";
import {
  PlannedCourseWithIdentifier,
  StudyPlannerNoteWithIdentifier,
} from "~/reducers/hops";

/**
 * Props for the HopsWebsocketWatcher component
 */
interface HopsWebsocketWatcherProps {
  /** Student identifier */
  studentIdentifier: string;
  children: ReactNode;
}

/**
 * Component for watching websocket events
 * @param props props
 *
 * @example
 * ```tsx
 * <HopsWebsocketWatcher>
 *   <App />
 * </HopsWebsocketWatcher>
 * ```
 */
export function HopsWebsocketWatcher(props: HopsWebsocketWatcherProps) {
  const { children } = props;

  const dispatch = useDispatch();
  const websocketState = useSelector((state: StateType) => state.websocket);

  // Matriculation plan watcher
  useEffect(() => {
    /**
     * Callback function to handle matriculation plan updates
     * @param data - MatriculationPlan and studentIdentifier
     */
    const onMatriculationPlanUpdated = (
      data: MatriculationPlan & { studentIdentifier: string }
    ) => {
      const { studentIdentifier, ...plan } = data;

      // If the student identifier does not match, do nothing
      if (studentIdentifier !== props.studentIdentifier) {
        return;
      }

      dispatch(
        updateMatriculationPlan({
          plan,
          studentIdentifier,
        })
      );
    };

    websocketState.websocket.addEventCallback(
      "hops:matriculationplan-updated",
      onMatriculationPlanUpdated
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:matriculationplan-updated",
        onMatriculationPlanUpdated
      );
    };
  }, [dispatch, props.studentIdentifier, websocketState.websocket]);

  // Hops locked watcher
  useEffect(() => {
    /**
     * Callback function to handle Hops locked updates
     * @param data - HopsLocked and studentIdentifier
     */
    const onHopsLockedUpdated = (
      data: HopsLocked & { studentIdentifier: string }
    ) => {
      const { studentIdentifier, ...locked } = data;

      if (studentIdentifier !== props.studentIdentifier) {
        return;
      }

      dispatch(updateHopsLocked({ locked }));
    };

    websocketState.websocket.addEventCallback(
      "hops:lock-updated",
      onHopsLockedUpdated
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:lock-updated",
        onHopsLockedUpdated
      );
    };
  }, [dispatch, props.studentIdentifier, websocketState.websocket]);

  // Hops form watcher
  useEffect(() => {
    /**
     * Callback function to handle Hops form updates
     * @param data - HopsForm
     * @param data.formData - Hops form data
     * @param data.latestChange - Latest changes to the Hops form
     * @param data.studentIdentifier - Student identifier
     */
    const onHopsFormUpdated = (data: {
      formData: string;
      latestChange: HopsHistoryEntry;
      studentIdentifier: string;
    }) => {
      const { studentIdentifier } = data;

      // If the student identifier does not match, do nothing
      if (studentIdentifier !== props.studentIdentifier) {
        return;
      }

      dispatch(
        updateHopsForm({
          form: JSON.parse(data.formData) as HopsForm,
        })
      );

      dispatch(
        updateHopsHistory({
          history: data.latestChange,
        })
      );
    };

    websocketState.websocket.addEventCallback(
      "hops:updated",
      onHopsFormUpdated
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:updated",
        onHopsFormUpdated
      );
    };
  }, [dispatch, props.studentIdentifier, websocketState.websocket]);

  // Hops history watcher
  useEffect(() => {
    /**
     * Callback function to handle Hops history updates
     * @param data - HopsHistory
     */
    const onHopsHistoryUpdated = (
      data: HopsHistoryEntry & { studentIdentifier: string }
    ) => {
      const { studentIdentifier, ...history } = data;

      // If the student identifier does not match, do nothing
      if (studentIdentifier !== props.studentIdentifier) {
        return;
      }

      dispatch(updateHopsHistory({ history }));
    };

    websocketState.websocket.addEventCallback(
      "hops:history-item-updated",
      onHopsHistoryUpdated
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:history-item-updated",
        onHopsHistoryUpdated
      );
    };
  }, [dispatch, props.studentIdentifier, websocketState.websocket]);

  // Hops study plan watcher
  useEffect(() => {
    /**
     * Callback function to handle Hops study plan updates
     * @param data - HopsStudyPlan
     */
    const onHopsStudyPlanUpdated = (
      data: {
        plannedCourses: PlannedCourse[];
      } & { studentIdentifier: string }
    ) => {
      const { studentIdentifier, plannedCourses } = data;

      if (studentIdentifier !== props.studentIdentifier) {
        return;
      }

      const plannedCoursesWithIdentifiers =
        plannedCourses.map<PlannedCourseWithIdentifier>((course) => ({
          ...course,
          identifier: "planned-course-" + course.id,
        }));

      dispatch(
        updateHopsStudyPlanPlannedCourses({
          plannedCourses: plannedCoursesWithIdentifiers,
        })
      );
    };

    websocketState.websocket.addEventCallback(
      "hops:planned-courses-updated",
      onHopsStudyPlanUpdated
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:planned-courses-updated",
        onHopsStudyPlanUpdated
      );
    };
  }, [dispatch, props.studentIdentifier, websocketState.websocket]);

  // Hops study plan plan notes watcher
  useEffect(() => {
    /**
     * Callback function to handle Hops study plan plan notes updates
     * @param data - HopsStudyPlanPlanNotes
     */
    const onHopsStudyPlanPlanNotesUpdated = (
      data: { notes: StudyPlannerNote[] } & { studentIdentifier: string }
    ) => {
      const { studentIdentifier, notes } = data;

      if (studentIdentifier !== props.studentIdentifier) {
        return;
      }

      const planNotesWithIdentifiers =
        notes.map<StudyPlannerNoteWithIdentifier>((note) => ({
          ...note,
          identifier: "plan-note-" + note.id,
        }));

      dispatch(
        updateHopsStudyPlanPlanNotes({ planNotes: planNotesWithIdentifiers })
      );
    };

    websocketState.websocket.addEventCallback(
      "hops:study-planner-notes-updated",
      onHopsStudyPlanPlanNotesUpdated
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:study-planner-notes-updated",
        onHopsStudyPlanPlanNotesUpdated
      );
    };
  }, [dispatch, props.studentIdentifier, websocketState.websocket]);

  // Hops goals watcher
  useEffect(() => {
    /**
     * Callback function to handle Hops goals updates
     * @param data - HopsGoals
     */
    const onHopsGoalsUpdated = (
      data: HopsGoals & { studentIdentifier: string }
    ) => {
      const { studentIdentifier, ...goals } = data;

      if (studentIdentifier !== props.studentIdentifier) {
        return;
      }

      // Convert graduationGoal to Date object
      // as websocket sends it as string
      const updatedGoals = {
        ...goals,
        graduationGoal: goals.graduationGoal
          ? new Date(goals.graduationGoal)
          : null,
      };

      dispatch(updateHopsStudyPlanGoals({ goals: updatedGoals }));
    };

    websocketState.websocket.addEventCallback(
      "hops:goals-updated",
      onHopsGoalsUpdated
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:goals-updated",
        onHopsGoalsUpdated
      );
    };
  }, [dispatch, props.studentIdentifier, websocketState.websocket]);

  return <>{children}</>;
}

export default HopsWebsocketWatcher;
