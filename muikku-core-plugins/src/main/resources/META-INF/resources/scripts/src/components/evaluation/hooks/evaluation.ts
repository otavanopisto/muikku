import { useEffect, useState } from "react";
import { useCallback } from "react";
import { EvaluationState } from "~/reducers/main-function/evaluation";
import {
  EvaluationAssessmentRequest,
  WorkspaceSubject,
} from "~/generated/client";
import { useDispatch } from "react-redux";
import { useMemo } from "react";
import { EvaluationLatestSubjectEvaluationIndex } from "~/@types/evaluation";
import {
  loadEvaluationAssessmentEventsFromServer,
  toggleLockedAssignment,
} from "~/actions/main-function/evaluation/evaluationActions";

/**
 * Custom hook for managing evaluation state
 * @param selectedAssessment selected assessment
 * @returns use evaluation state
 */
export const useEvaluationState = (
  selectedAssessment: EvaluationAssessmentRequest
) => {
  const [state, setState] = useState({
    archiveStudentDialog: false,
    showWorkspaceEvaluationDrawer: false,
    showWorkspaceSupplemenationDrawer: false,
    eventByIdOpened: undefined as string | undefined,
    edit: false,
    subjectToBeEvaluated: undefined as WorkspaceSubject | undefined,
    subjectEvaluationToBeEditedIdentifier: null as string | null,
  });

  // Batch state updates
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    if (selectedAssessment && selectedAssessment.subjects.length === 1) {
      updateState({ subjectToBeEvaluated: selectedAssessment.subjects[0] });
    }
  }, [selectedAssessment, updateState]);

  return {
    state,
    updateState,
  };
};

/**
 * Custom hook for evaluation logic
 * @param selectedAssessment selected assessment
 * @param evaluation evaluation
 * @param state state
 * @param updateState update state
 * @returns use evaluation logic
 */
export const useEvaluationLogic = (
  selectedAssessment: EvaluationAssessmentRequest,
  evaluation: EvaluationState,
  state: ReturnType<typeof useEvaluationState>["state"],
  updateState: ReturnType<typeof useEvaluationState>["updateState"]
) => {
  const dispatch = useDispatch();

  const evaluationsEvents = useMemo(
    () => evaluation.evaluationAssessmentEvents?.data || [],
    [evaluation.evaluationAssessmentEvents]
  );

  const evaluatedAssignments = useMemo(
    () =>
      (
        evaluation.evaluationCurrentStudentAssigments.data?.assigments || []
      ).filter((assignment) => assignment.assignmentType === "EVALUATED"),
    [evaluation.evaluationCurrentStudentAssigments.data]
  );

  const lockedAssignmentIds = useMemo(
    () =>
      evaluation.evaluationCurrentStudentAssigments.data
        ?.idListOfLockedAssigments || [],
    [evaluation.evaluationCurrentStudentAssigments.data]
  );

  // Create list of evaluated assignments that are either evaluated or supplemented
  const evaluatedOrSupplementedAssignmentIds = useMemo(() => {
    const assigmentCompositeReplies =
      evaluation.evaluationCompositeReplies.data || [];

    return evaluatedAssignments.map((assignment) => {
      const assigmentCompositeReply = assigmentCompositeReplies.find(
        (reply) => reply.workspaceMaterialId === assignment.id
      );

      if (
        assigmentCompositeReply &&
        ["PASSED", "FAILED", "INCOMPLETE"].includes(
          assigmentCompositeReply.state
        )
      ) {
        return assignment.id;
      }
    });
  }, [evaluatedAssignments, evaluation.evaluationCompositeReplies.data]);

  // Check if all assignments are locked
  const isAllAssignmentsLocked = useMemo(() => {
    // Filter out assignments that are evaluated ("PASSED", "FAILED", "INCOMPLETE")
    const comparableList = evaluatedAssignments.filter(
      (assignment) =>
        !evaluatedOrSupplementedAssignmentIds.includes(assignment.id)
    );

    return (
      lockedAssignmentIds.length > 0 &&
      lockedAssignmentIds.length === comparableList.length
    );
  }, [
    evaluatedAssignments,
    lockedAssignmentIds,
    evaluatedOrSupplementedAssignmentIds,
  ]);

  /**
   * Get latest evaluated event index
   * @param identifier identifier
   * @returns latest evaluated event index
   */
  const getLatestEvaluatedEventIndex = useCallback(
    (identifier: string): EvaluationLatestSubjectEvaluationIndex => {
      if (evaluationsEvents.length > 0) {
        let indexOfLatestEvaluatedEvent: number = null;

        for (let i = 0; i < evaluationsEvents.length; i++) {
          const event = evaluationsEvents[i];
          if (
            event.workspaceSubjectIdentifier === identifier &&
            event.type !== "EVALUATION_REQUEST"
          ) {
            indexOfLatestEvaluatedEvent = i;
          }
        }

        return (
          indexOfLatestEvaluatedEvent !== null && {
            [identifier]: indexOfLatestEvaluatedEvent,
          }
        );
      }
    },
    [evaluationsEvents]
  );

  /**
   * Check if latest event is supplementation request
   * @returns boolean
   */
  const isLatestEventSupplementationRequest = useCallback((): boolean => {
    if (evaluationsEvents.length > 0) {
      const lastEvent = evaluationsEvents[evaluationsEvents.length - 1];
      return lastEvent.type === "SUPPLEMENTATION_REQUEST";
    }
    return false;
  }, [evaluationsEvents]);

  /**
   * Handle toggle all locked assignment. Toggles locked off only if all assignments are locked,
   * otherwise toggles locked on for all assignments.
   */
  const handleToggleAllLockedAssignment = useCallback(() => {
    // Unlock only if every assignment is locked
    const action = isAllAssignmentsLocked ? "unlock" : "lock";

    dispatch(
      toggleLockedAssignment({
        action,
      })
    );
  }, [dispatch, isAllAssignmentsLocked]);

  /**
   * Handle click edit
   * @param eventId event id
   * @param workspaceSubjectIdentifier workspace subject identifier
   * @param supplementation supplementation
   */
  const handleClickEdit = useCallback(
    (
      eventId: string,
      workspaceSubjectIdentifier: string | null,
      supplementation?: boolean
    ) =>
      () => {
        // Batch state updates
        updateState({
          edit: true,
          showWorkspaceEvaluationDrawer: !supplementation,
          showWorkspaceSupplemenationDrawer: !!supplementation,
          subjectEvaluationToBeEditedIdentifier: workspaceSubjectIdentifier,
          eventByIdOpened: eventId,
        });
      },
    [updateState]
  );

  /**
   * Handle workspace succesful save
   * @param openArchiveDialog open archive dialog
   * @returns handle workspace succesful save
   */
  const handleWorkspaceSuccesfulSave = useCallback(
    (openArchiveDialog: boolean) => () => {
      if (openArchiveDialog) {
        updateState({ archiveStudentDialog: true });
      } else {
        dispatch(
          loadEvaluationAssessmentEventsFromServer({
            assessment: selectedAssessment,
          })
        );
      }
    },
    [dispatch, selectedAssessment, updateState]
  );

  /**
   * Handle open workspace evaluation drawer
   */
  const handleOpenWorkspaceEvaluationDrawer = useCallback(() => {
    updateState({ showWorkspaceEvaluationDrawer: true });
  }, [updateState]);

  /**
   * Handle close workspace evaluation drawer
   */
  const handleCloseWorkspaceEvaluationDrawer = useCallback(() => {
    if (state.edit) {
      updateState({
        eventByIdOpened: undefined,
        edit: false,
        showWorkspaceEvaluationDrawer: false,
        subjectEvaluationToBeEditedIdentifier: null,
      });
    } else {
      updateState({ showWorkspaceEvaluationDrawer: false });
    }
  }, [state.edit, updateState]);

  /**
   * Handle open workspace supplementation evaluation drawer
   */
  const handleOpenWorkspaceSupplementationEvaluationDrawer = useCallback(() => {
    updateState({ showWorkspaceSupplemenationDrawer: true });
  }, [updateState]);

  /**
   * Handle close workspace supplementation evaluation drawer
   */
  const handleCloseWorkspaceSupplementationEvaluationDrawer =
    useCallback(() => {
      if (state.edit) {
        updateState({
          eventByIdOpened: undefined,
          edit: false,
          showWorkspaceSupplemenationDrawer: false,
          subjectEvaluationToBeEditedIdentifier: null,
        });
      } else {
        updateState({ showWorkspaceSupplemenationDrawer: false });
      }
    }, [state.edit, updateState]);

  /**
   * Handle select subject evaluation change
   * @param e event
   */
  const handleSelectSubjectEvaluationChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const subject = selectedAssessment.subjects.find(
        (sItem) => sItem.identifier === e.currentTarget.value
      );
      updateState({ subjectToBeEvaluated: subject });
    },
    [selectedAssessment.subjects, updateState]
  );

  /**
   * Handle close archive student dialog
   */
  const handleCloseArchiveStudentDialog = useCallback(() => {
    updateState({
      archiveStudentDialog: false,
    });
    dispatch(
      loadEvaluationAssessmentEventsFromServer({
        assessment: selectedAssessment,
      })
    );
  }, [dispatch, selectedAssessment, updateState]);

  return {
    isAllAssignmentsLocked,
    getLatestEvaluatedEventIndex,
    isLatestEventSupplementationRequest,
    handleClickEdit,
    handleWorkspaceSuccesfulSave,
    handleOpenWorkspaceEvaluationDrawer,
    handleCloseWorkspaceEvaluationDrawer,
    handleOpenWorkspaceSupplementationEvaluationDrawer,
    handleCloseWorkspaceSupplementationEvaluationDrawer,
    handleSelectSubjectEvaluationChange,
    handleCloseArchiveStudentDialog,
    handleToggleAllLockedAssignment,
  };
};
