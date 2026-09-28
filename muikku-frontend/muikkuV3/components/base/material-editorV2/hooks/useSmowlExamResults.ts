import * as React from "react";
import {
  getSmowlApi,
  isSmowlApiError,
  ResultsStatusResponse,
} from "~/api_smowl/index";

const smowlApi = getSmowlApi({});

/**
 * Props for the useExamResults hook
 */
interface UseSmowlExamResultsProps {
  examId: number | string | null | undefined;
}

/**
 * Hook for getting the results of an exam
 * @param props - Props for the hook
 * @returns The results of the exam
 */
export const useSmowlExamResults = (props: UseSmowlExamResultsProps) => {
  const { examId } = props;

  const [state, setState] = React.useState<{
    loadingExamResults: boolean;
    error: Error | null;
    results: ResultsStatusResponse | null;
  }>({
    loadingExamResults: false,
    error: null,
    results: null,
  });

  React.useEffect(() => {
    let cancelled = false;

    /**
     * Runs the hook to get the results of an exam
     * @returns Promise resolving to the IP Analysis results status response
     */
    const run = async () => {
      if (examId === null || examId === undefined || examId === "") {
        setState({ loadingExamResults: false, error: null, results: null });
        return;
      }

      try {
        setState({ loadingExamResults: true, error: null, results: null });

        const results = await smowlApi.getResultsStatus({
          activityType: "exam",
          activityId: examId,
        });

        if (!cancelled) {
          setState({ loadingExamResults: false, error: null, results });
        }
      } catch (e) {
        // For this endpoint, "no data yet" should mean "no proctoring data exists".
        if (isSmowlApiError(e) && e.status === 400) {
          if (!cancelled) {
            setState({ loadingExamResults: false, error: null, results: null });
          }
          return;
        }
        const err = e instanceof Error ? e : new Error(String(e));
        if (!cancelled) {
          setState({ loadingExamResults: false, error: err, results: null });
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [examId]);

  const hasProctoredData = (state.results?.users?.length ?? 0) > 0;

  return {
    ...state,
    hasProctoredData,
  };
};
