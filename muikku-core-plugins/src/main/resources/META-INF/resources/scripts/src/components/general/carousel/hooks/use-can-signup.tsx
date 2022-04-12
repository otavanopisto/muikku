import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";

/**
 * UseCourseCarousel
 */
export interface UseCourseCarousel {
  isLoading: boolean;
  canSignUp: boolean;
}

/**
 * useCanSignUp
 * Fetches and return diary data
 * @param workspaceId workspaceEntityId
 * @returns object containing state properties of loading, apiData and error
 */
export const useCanSignUp = (workspaceId: number) => {
  const [loadingCanSignUp, setLoadingCanSignUp] = React.useState(false);
  const [canSignUp, setCanSignUp] = React.useState(false);
  const [serverError, setServerError] = React.useState(null);

  React.useEffect(() => {
    setLoadingCanSignUp(true);

    /**
     * Sends api request to Api which returns data if
     * user can signUp for course or is already member of
     * the course
     * @returns Requirements object
     */
    const checkSignUpStatus = async (): Promise<boolean> =>
      (await promisify(
        mApi().coursepicker.workspaces.canSignup.read(workspaceId),
        "callback"
      )()) as boolean;

    /**
     * fetchData
     */
    const fetchData = async () => {
      try {
        const canSignUp = await checkSignUpStatus();

        setCanSignUp(canSignUp);
        setLoadingCanSignUp(false);
      } catch (error) {
        setServerError(error);
        setLoadingCanSignUp(false);
      }
    };

    fetchData();
  }, [workspaceId]);

  return { loadingCanSignUp, canSignUp, serverError };
};
