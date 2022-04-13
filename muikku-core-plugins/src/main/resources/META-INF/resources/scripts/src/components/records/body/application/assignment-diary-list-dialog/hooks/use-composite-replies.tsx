import * as React from "react";
import { EvaluationStudyDiaryEvent } from "../../../../../../@types/evaluation";
import promisify from "../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import { MaterialCompositeRepliesType } from "../../../../../../reducers/workspaces/index";

/**
 * useDiary
 * Fetches and return diary data
 * @param userEntityId
 * @returns object containing state properties of loading, apiData and error
 */
export const useCompositeReplies = (
  userEntityId: number,
  workspaceId: number
) => {
  const [loadingCompositeReplies, setLoadingCompositeReplies] =
    React.useState(false);
  const [compositeRepliesData, setCompositeRepliesData] = React.useState<
    MaterialCompositeRepliesType[]
  >([]);
  const [serverErrorCompositeReplies, setServerErrorCompositeReplies] =
    React.useState(null);

  React.useEffect(() => {
    setLoadingCompositeReplies(true);

    let evaluationCompositeReplies: MaterialCompositeRepliesType[] = [];

    const fetchData = async () => {
      try {
        evaluationCompositeReplies = (await promisify(
          mApi().workspace.workspaces.compositeReplies.read(workspaceId, {
            userEntityId,
          }),
          "callback"
        )()) as MaterialCompositeRepliesType[];

        setCompositeRepliesData(evaluationCompositeReplies || []);
        setLoadingCompositeReplies(false);
      } catch (error) {
        setServerErrorCompositeReplies(error);
        setLoadingCompositeReplies(false);
      }
    };

    fetchData();
  }, [userEntityId]);

  return {
    loadingCompositeReplies,
    compositeRepliesData,
    serverErrorCompositeReplies,
  };
};
