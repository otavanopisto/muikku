import * as React from "react";
import { EvaluationStudyDiaryEvent } from "../../../../../../@types/evaluation";
import promisify from "../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import { MaterialCompositeRepliesType } from "../../../../../../reducers/workspaces/index";
import { EvaluationWorkspace } from "~/@types/evaluation";

/**
 * useWorkspace
 * Fetches and return diary data
 * @param userEntityId
 * @returns object containing state properties of loading, apiData and error
 */
export const useWorkspace = (workspaceId: number) => {
  const [loadingWorkspace, setLoadingWorkspace] = React.useState(false);
  const [workspaceData, setWorkspaceData] =
    React.useState<EvaluationWorkspace>(undefined);
  const [serverErrorWorkspace, setServerErrorWorkspace] = React.useState(null);

  React.useEffect(() => {
    setLoadingWorkspace(true);

    let evaluationWorkspaces: EvaluationWorkspace;

    const fetchData = async () => {
      try {
        evaluationWorkspaces = (await promisify(
          mApi().workspace.workspaces.read(workspaceId),
          "callback"
        )()) as EvaluationWorkspace;

        setWorkspaceData(evaluationWorkspaces);
        setLoadingWorkspace(false);
      } catch (error) {
        setServerErrorWorkspace(error);
        setLoadingWorkspace(false);
      }
    };

    fetchData();
  }, [workspaceId]);

  return {
    loadingWorkspace,
    workspaceData,
    serverErrorWorkspace,
  };
};
