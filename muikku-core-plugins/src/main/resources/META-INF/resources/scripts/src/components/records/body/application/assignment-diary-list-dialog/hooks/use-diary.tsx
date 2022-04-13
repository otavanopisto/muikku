import * as React from "react";
import { EvaluationStudyDiaryEvent } from "../../../../../../@types/evaluation";
import promisify from "../../../../../../util/promisify";
import mApi from "~/lib/mApi";

/**
 * useDiary
 * Fetches and return diary data
 * @param userEntityId
 * @param workspaceEntityId
 * @returns object containing state properties of loading, apiData and error
 */
export const useDiary = (userEntityId: number, workspaceEntityId: number) => {
  const [loadingDiary, setLoadingDiary] = React.useState(false);
  const [diaryData, setDiaryData] = React.useState<EvaluationStudyDiaryEvent[]>(
    []
  );
  const [serverError, setServerError] = React.useState(null);

  React.useEffect(() => {
    setLoadingDiary(true);

    let studyDiaryEvents: EvaluationStudyDiaryEvent[] = [];

    const fetchData = async () => {
      try {
        studyDiaryEvents = (await promisify(
          mApi().workspace.workspaces.journal.read(workspaceEntityId, {
            userEntityId: userEntityId,
            firstResult: 0,
            maxResults: 512,
          }),
          "callback"
        )()) as EvaluationStudyDiaryEvent[] | [];

        setDiaryData(studyDiaryEvents);
        setLoadingDiary(false);
      } catch (error) {
        setServerError(error);
        setLoadingDiary(false);
      }
    };

    fetchData();
  }, [userEntityId]);

  return { loadingDiary, diaryData, serverError };
};
