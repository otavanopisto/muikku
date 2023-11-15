import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi from "~/api/api";

/**
 * useWorkspaces
 * @param displayNotification displayNotification
 */
export const useWorkspaces = (
  displayNotification: DisplayNotificationTriggerType
) => {
  const [textInput, setTextInput] = React.useState<string>("");
  const [workspaces, setWorkspaces] = React.useState<WorkspaceDataType[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] =
    React.useState<boolean>(true);

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    /**
     * loadWorkspaces
     */
    const loadWorkspaces = async () => {
      setLoadingWorkspaces(true);

      const coursepickerApi = MApi.getCoursepickerApi();

      try {
        const workspaces = (await coursepickerApi.getCoursepickerWorkspaces({
          q: textInput,
          maxResults: 20,
          myWorkspaces: true,
        })) as WorkspaceDataType[];

        if (componentMounted.current) {
          unstable_batchedUpdates(() => {
            setWorkspaces(workspaces);
            setLoadingWorkspaces(false);
          });
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(err.message, "error");
        }
      }
    };

    loadWorkspaces();
  }, [textInput, displayNotification]);

  /**
   * handleTextInput
   * @param text text
   */
  const handleTextInput = (text: string) => {
    setTextInput(text);
  };

  return {
    workspaces,
    loadingWorkspaces,
    handleTextInput,
  };
};
