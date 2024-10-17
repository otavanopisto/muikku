import * as React from "react";
import MApi from "~/api/api";

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
     * @returns Boolean whether user can signUp or not
     */
    const checkSignUpStatus = () => {
      const coursepickerApi = MApi.getCoursepickerApi();

      return coursepickerApi.workspaceCanSignUp({
        workspaceId,
      });
    };

    /**
     * fetchData
     */
    const fetchData = async () => {
      try {
        const canSignUp = await checkSignUpStatus();

        setCanSignUp(canSignUp.canSignup);
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
