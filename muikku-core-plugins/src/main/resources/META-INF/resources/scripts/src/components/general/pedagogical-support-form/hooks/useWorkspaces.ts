import * as React from "react";
import mApi from "~/lib/mApi";
import { WorkspaceType } from "~/reducers/workspaces";
import promisify from "~/util/promisify";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";

/**
 * useWorkspaces
 * @param displayNotification displayNotification
 */
export const useWorkspaces = (
  displayNotification: DisplayNotificationTriggerType
) => {
  const [textInput, setTextInput] = React.useState<string>("");
  const [workspaces, setWorkspaces] = React.useState<WorkspaceType[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] =
    React.useState<boolean>(true);

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    /**
     * loadWorkspaces
     */
    const loadWorkspaces = async () => {
      setLoadingWorkspaces(true);

      try {
        const workspace = (await promisify(
          mApi().coursepicker.workspaces.read({
            q: textInput,
            maxResults: 20,
            myWorkspaces: true,
          }),
          "callback"
        )()) as WorkspaceType[];

        if (componentMounted.current) {
          unstable_batchedUpdates(() => {
            setWorkspaces(workspace);
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
