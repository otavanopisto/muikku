import { type LoaderFunction } from "react-router";
import { currentStudentIdAtom } from "~/src/atoms/guider";
import { setAtomValue } from "~/src/jotaiStore";

export const routeLoaders: Record<string, LoaderFunction> = {
  environmentLoader: () => null,
  homeLoader: () => null,
  dashboardLoader: () => null,
  communicatorLoader: () => null,
  guiderLoader: () => null,
  guiderStudentLoader: ({ params }) => {
    const { studentId } = params;

    if (!studentId) {
      throw new Error("Student ID is required");
    }

    setAtomValue(currentStudentIdAtom, studentId);

    return null;
  },
  workspaceLoader: () => null,
  workspaceHomeLoader: () => null,
  workspaceSettingsLoader: () => null,
};
