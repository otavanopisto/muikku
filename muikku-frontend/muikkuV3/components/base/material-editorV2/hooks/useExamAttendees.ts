// components/base/material-editorV2/hooks/useExamAttendees.ts
import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi, { isMApiError } from "~/api/api";
import { OptionDefault } from "~/components/general/react-select/types";
import { ExamAttendee, WorkspaceStudent } from "~/generated/client";

const examApi = MApi.getExamApi();
const workspaceApi = MApi.getWorkspaceApi();

/**
 * Props for the useExamAttendees hook
 */
interface UseExamAttendeesProps {
  workspaceFolderId: number;
  workspaceId: number;
}

/**
 * Custom hook for exam attendees with immediate API operations
 * Completely self-contained - no Redux dependency
 * @param props - Workspace IDs needed for API calls
 * @returns Object containing exam attendees data and change functionality
 */
const useExamAttendees = (props: UseExamAttendeesProps) => {
  const { workspaceFolderId, workspaceId } = props;

  const [loading, setLoading] = React.useState(false);
  const [examAttendees, setExamAttendees] = React.useState<ExamAttendee[]>([]);
  const [activeWorkspaceStudents, setActiveWorkspaceStudents] = React.useState<
    WorkspaceStudent[]
  >([]);
  const [error, setError] = React.useState<string | null>(null);

  const isMounted = React.useRef(true);

  // Cleanup function to prevent memory leaks
  React.useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  // Load initial data when workspace IDs change
  React.useEffect(() => {
    /**
     * Initialize active workspace students
     */
    const initializeActiveWorkspaceStudents = async () => {
      if (!workspaceFolderId || !workspaceId) {
        return;
      }

      unstable_batchedUpdates(() => {
        setLoading(true);
        setError(null);
      });

      try {
        const [examAttendeesData, studentsData] = await Promise.all([
          examApi.getExamAttendees({ workspaceFolderId }),
          workspaceApi.getWorkspaceStudents({
            workspaceEntityId: workspaceId,
            active: true,
            maxResults: 999,
            q: "",
          }),
        ]);

        if (isMounted.current) {
          unstable_batchedUpdates(() => {
            setLoading(false);
            setExamAttendees(examAttendeesData);
            setActiveWorkspaceStudents(studentsData.results);
          });
        }
      } catch (err) {
        if (isMounted.current) {
          setLoading(false);

          if (!isMApiError(err)) {
            throw err;
          }

          setError(err.message || "Failed to load exam attendees");
        }
      }
    };

    initializeActiveWorkspaceStudents();
  }, [workspaceFolderId, workspaceId]);

  // All students as options for the select (excluding already selected ones)
  const availableStudentOptions: OptionDefault<number>[] = React.useMemo(() => {
    const selectedIds = examAttendees.map((attendee) => attendee.id);
    return activeWorkspaceStudents
      .filter((student) => !selectedIds.includes(student.userEntityId))
      .map((student) => ({
        label: `${student.firstName} ${student.lastName}`,
        value: student.userEntityId,
      }));
  }, [activeWorkspaceStudents, examAttendees]);

  /**
   * Add a student as exam attendee
   */
  const addExamAttendee = React.useCallback(
    async (userEntityId: number) => {
      if (!workspaceFolderId) return;

      unstable_batchedUpdates(() => {
        setLoading(true);
        setError(null);
      });

      try {
        const addedExamAttendee = await examApi.addExamAttendee({
          workspaceFolderId,
          userEntityId,
        });

        if (isMounted.current) {
          setExamAttendees((prev) => [...prev, addedExamAttendee]);
        }
      } catch (err) {
        if (isMounted.current) {
          if (!isMApiError(err)) {
            throw err;
          }

          setError(err.message || "Failed to add exam attendee");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [workspaceFolderId]
  );

  /**
   * Remove a student from exam attendees
   */
  const removeExamAttendee = React.useCallback(
    async (userEntityId: number, permanent: boolean = false) => {
      if (!workspaceFolderId) return;

      unstable_batchedUpdates(() => {
        setLoading(true);
        setError(null);
      });

      try {
        await examApi.removeExamAttendee({
          workspaceFolderId,
          userEntityId,
          permanent,
        });

        if (isMounted.current) {
          setExamAttendees((prev) =>
            prev.filter((attendee) => attendee.id !== userEntityId)
          );
        }
      } catch (err) {
        if (isMounted.current) {
          if (!isMApiError(err)) {
            throw err;
          }

          setError(err.message || "Failed to remove exam attendee");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [workspaceFolderId]
  );

  /**
   * Update attendee settings (like extra time)
   * @param updatedAttendee - The updated exam attendee
   */
  const updateAttendeeSettings = React.useCallback(
    async (updatedAttendee: ExamAttendee) => {
      if (!workspaceFolderId) return;

      try {
        const updatedExamAttendee = await examApi.updateExamAttendee({
          userEntityId: updatedAttendee.id,
          workspaceFolderId: workspaceFolderId,
          examAttendee: {
            extraMinutes: updatedAttendee.extraMinutes,
          },
        });

        if (isMounted.current) {
          setExamAttendees((prev) =>
            prev.map((attendee) =>
              attendee.id === updatedExamAttendee.id
                ? updatedExamAttendee
                : attendee
            )
          );
        }
      } catch (err) {
        if (isMounted.current) {
          if (!isMApiError(err)) {
            throw err;
          }
        }
      }
    },
    [workspaceFolderId]
  );

  const hookValues = React.useMemo(
    () => ({
      // Data
      loading,
      error,
      examAttendees,
      availableStudentOptions,

      // Actions
      addExamAttendee,
      removeExamAttendee,
      updateAttendeeSettings,

      // Computed values
      hasAttendees: examAttendees.length > 0,
      attendeeCount: examAttendees.length,
    }),
    [
      loading,
      error,
      examAttendees,
      availableStudentOptions,
      addExamAttendee,
      removeExamAttendee,
      updateAttendeeSettings,
    ]
  );

  return hookValues;
};

export default useExamAttendees;
