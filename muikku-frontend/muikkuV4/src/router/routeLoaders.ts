import { type LoaderFunction } from "react-router";
import {
  currentStudentIdAtom,
  guiderStudentsQueryAtom,
} from "src/atoms/guider";
import { executeAtomAction, setAtomValue } from "src/jotaiStore";
import { loadMaterialContentNodesAtom } from "../atoms/materials";

export const routeLoaders: Record<string, LoaderFunction> = {
  environmentLoader: () => null,
  homeLoader: () => null,
  dashboardLoader: () => {
    void executeAtomAction(loadMaterialContentNodesAtom, 158);

    return null;
  },
  communicatorLoader: () => null,
  guiderLoader: ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";

    // Initialize the query atom with URL parameter
    setAtomValue(guiderStudentsQueryAtom, query);

    return null;
  },
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
