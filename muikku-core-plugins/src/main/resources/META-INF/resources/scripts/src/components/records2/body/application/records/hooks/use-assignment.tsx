import * as React from "react";
import promisify from "../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import { MaterialAssignmentType } from "~/reducers/workspaces";

/**
 * useDiary
 * Fetches and return diary data
 * @param userEntityId
 * @param workspaceEntityId
 * @returns object containing state properties of loading, apiData and error
 */
export const useAssignments = (workspaceEntityId: number) => {
  const [loadingAssignments, setLoadingAssignments] = React.useState(false);
  const [assignmentsData, setAssignmentsData] = React.useState<
    MaterialAssignmentType[]
  >([]);
  const [serverError, setServerError] = React.useState(null);

  React.useEffect(() => {
    setLoadingAssignments(true);

    const fetchData = async () => {
      try {
        let [assigments] = await Promise.all([
          (async () => {
            let assignmentsExcercise =
              ((await promisify(
                mApi().workspace.workspaces.materials.read(4, {
                  assignmentType: "EXERCISE",
                }),
                "callback"
              )()) as MaterialAssignmentType[]) || [];

            let assignmentsEvaluated =
              ((await promisify(
                mApi().workspace.workspaces.materials.read(4, {
                  assignmentType: "EVALUATED",
                }),
                "callback"
              )()) as MaterialAssignmentType[]) || [];

            let assignments = [
              ...assignmentsEvaluated,
              ...assignmentsExcercise,
            ];

            return assignments;
          })(),
        ]);

        setAssignmentsData(assigments);
        setLoadingAssignments(false);
      } catch (error) {
        setServerError(error);
        setLoadingAssignments(false);
      }
    };

    fetchData();
  }, [workspaceEntityId]);

  return { loadingAssignments, assignmentsData, serverError };
};
