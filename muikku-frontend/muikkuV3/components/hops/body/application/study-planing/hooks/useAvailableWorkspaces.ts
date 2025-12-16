import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi from "~/api/api";
import { HopsAvailableCourse } from "~/generated/client";

const hopsApi = MApi.getHopsApi();

/**
 * UseAvailableWorkspacesProps
 */
interface UseAvailableWorkspacesProps {
  parameters: {
    subjectCode: string;
    courseNumber: number;
    ops?: string;
  };
  displayNotification?: DisplayNotificationTriggerType;
}

/**
 * useWorkspaces
 * @param props props
 */
export const useAvailableWorkspaces = (props: UseAvailableWorkspacesProps) => {
  const { parameters, displayNotification } = props;
  const [availableCourses, setAvailableCourses] = React.useState<
    HopsAvailableCourse[]
  >([]);

  const [loadingAvailableCourses, setLoadingAvailableCourses] =
    React.useState<boolean>(true);

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    /**
     * loadAvailableCourses
     */
    const loadAvailableCourses = async () => {
      setLoadingAvailableCourses(true);

      try {
        const availableCourses = await hopsApi.getAvailableCourses({
          subject: parameters.subjectCode,
          courseNumber: parameters.courseNumber,
          ops: parameters.ops,
        });

        if (componentMounted.current) {
          unstable_batchedUpdates(() => {
            setAvailableCourses(availableCourses);
            setLoadingAvailableCourses(false);
          });
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification && displayNotification(err.message, "error");
        }
      }
    };

    loadAvailableCourses();
  }, [
    displayNotification,
    parameters.courseNumber,
    parameters.subjectCode,
    parameters.ops,
  ]);

  return {
    availableCourses,
    loadingAvailableCourses,
  };
};
