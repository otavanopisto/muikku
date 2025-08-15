import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { useSelector } from "react-redux";
import { ActionMeta } from "react-select";
import MApi, { isMApiError } from "~/api/api";
import { OptionDefault } from "~/components/general/react-select/types";
import { ExamAttendee, WorkspaceStudent } from "~/generated/client";
import { StateType } from "~/reducers";

const examApi = MApi.getExamApi();
const workspaceApi = MApi.getWorkspaceApi();

/**
 * Custom hook for exam attendees with change tracking
 * @returns Object containing exam attendees data and change tracking functionality
 */
const useExamAttendees = () => {
  const [loading, setLoading] = React.useState(false);
  const [examAttendees, setExamAttendees] = React.useState<ExamAttendee[]>([]);
  const [activeWorkspaceStudents, setActiveWorkspaceStudents] = React.useState<
    WorkspaceStudent[]
  >([]);

  const [willBeAddedExamAttendees, setWillBeAddedExamAttendees] =
    React.useState<number[]>([]);

  const [willBeRemovedExamAttendees, setWillBeRemovedExamAttendees] =
    React.useState<number[]>([]);

  const isMounted = React.useRef(true);

  const workspaceFolderId = useSelector(
    (state: StateType) =>
      state.workspaces.materialEditor.currentNodeValue.workspaceMaterialId
  );

  const workspaceId = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace.id
  );

  // Cleanup function to prevent memory leaks
  React.useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  // Load exam settings when workspace folder id changes
  React.useEffect(() => {
    /**
     * Load exam settings
     */
    const initializeExamAttendees = async () => {
      if (!workspaceFolderId || !workspaceId) {
        return;
      }

      setLoading(true);

      try {
        const newExamAttendees = await examApi.getExamAttendees({
          workspaceFolderId,
        });

        const activeWorkspaceStudents = await workspaceApi.getWorkspaceStudents(
          {
            workspaceEntityId: workspaceId,
            active: true,
            q: "",
          }
        );

        if (isMounted.current) {
          unstable_batchedUpdates(() => {
            setLoading(false);
            setExamAttendees(newExamAttendees);
            setActiveWorkspaceStudents(activeWorkspaceStudents.results);
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    initializeExamAttendees();
  }, [workspaceFolderId, workspaceId]);

  // All students as options
  const studentOptions: OptionDefault<number>[] = React.useMemo(
    () =>
      activeWorkspaceStudents.map((student) => ({
        label: `${student.firstName} ${student.lastName}`,
        value: student.userEntityId,
      })),
    [activeWorkspaceStudents]
  );

  // Selected students as options
  const selectedStudentOptions: OptionDefault<number>[] = React.useMemo(
    () =>
      studentOptions
        .filter(
          (student) =>
            examAttendees.some((attendee) => attendee.id === student.value) ||
            willBeAddedExamAttendees.includes(student.value)
        )
        .filter(
          (student) => !willBeRemovedExamAttendees.includes(student.value)
        ),
    [
      examAttendees,
      studentOptions,
      willBeAddedExamAttendees,
      willBeRemovedExamAttendees,
    ]
  );

  /**
   * Handles exam attendee change
   *
   * @param options options
   * @param actionMeta actionMeta
   */
  const handleExamAttendeeChange = React.useCallback(
    (
      options: readonly OptionDefault<number>[],
      actionMeta: ActionMeta<OptionDefault<number>>
    ) => {
      // Get existing exam attendee IDs
      const existingAttendeeIds = examAttendees.map((attendee) => attendee.id);

      // Simple approach: track additions and removals separately
      if (actionMeta.action === "select-option" && actionMeta.option) {
        const addedId = actionMeta.option.value;
        // Only add if not already in existing attendees
        if (!existingAttendeeIds.includes(addedId)) {
          setWillBeAddedExamAttendees((prev) =>
            prev.includes(addedId) ? prev : [...prev, addedId]
          );
        }
      } else if (
        actionMeta.action === "remove-value" &&
        actionMeta.removedValue
      ) {
        const removedId = actionMeta.removedValue.value;
        // Only remove if it was in existing attendees
        if (existingAttendeeIds.includes(removedId)) {
          setWillBeRemovedExamAttendees((prev) =>
            prev.includes(removedId) ? prev : [...prev, removedId]
          );
        }
      } else if (actionMeta.action === "clear") {
        // Handle clear all - mark all existing attendees for removal
        setWillBeRemovedExamAttendees(existingAttendeeIds);
        setWillBeAddedExamAttendees([]);
      }
    },
    [examAttendees]
  );

  /**
   * Revert changes - useful for cancel operations
   */
  const handleRevert = React.useCallback(() => {
    setWillBeAddedExamAttendees([]);
    setWillBeRemovedExamAttendees([]);
  }, []);

  /**
   * Save changes
   */
  const handleSave = React.useCallback(async () => {
    setLoading(true);

    const promises = [];

    // Add newly added students
    if (willBeAddedExamAttendees.length > 0) {
      for (const studentId of willBeAddedExamAttendees) {
        promises.push(
          examApi.addExamAttendee({
            workspaceFolderId,
            userEntityId: studentId,
          })
        );
      }
    }

    // Remove removed students
    if (willBeRemovedExamAttendees.length > 0) {
      for (const studentId of willBeRemovedExamAttendees) {
        promises.push(
          examApi.removeExamAttendee({
            workspaceFolderId,
            userEntityId: studentId,
          })
        );
      }
    }

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Get updated exam attendees
    const updatedExamAttendees = await examApi.getExamAttendees({
      workspaceFolderId,
    });

    unstable_batchedUpdates(() => {
      if (!isMounted.current) {
        return;
      }

      setExamAttendees(updatedExamAttendees);
      setWillBeAddedExamAttendees([]); // Reset added students
      setWillBeRemovedExamAttendees([]); // Reset removed students
      setLoading(false);
    });
  }, [willBeAddedExamAttendees, willBeRemovedExamAttendees, workspaceFolderId]);

  const hookValues = React.useMemo(
    () => ({
      loading,
      studentOptions,
      selectedStudentOptions,
      handleExamAttendeeChange,
      willBeAddedExamAttendees, // IDs of students to be added as exam attendees
      willBeRemovedExamAttendees, // IDs of students to be removed from exam attendees
      handleRevert, // Function to revert changes (for cancel operations)
      handleSave, // Function to save changes
      // Boolean indicating if there are unsaved changes
      hasChanges:
        willBeAddedExamAttendees.length > 0 ||
        willBeRemovedExamAttendees.length > 0,
    }),
    [
      loading,
      studentOptions,
      selectedStudentOptions,
      handleExamAttendeeChange,
      willBeAddedExamAttendees,
      willBeRemovedExamAttendees,
      handleRevert,
      handleSave,
    ]
  );

  return hookValues;
};

export default useExamAttendees;
