import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi from "~/api/api";
import { PedagogyWorkspace } from "~/generated/client";

const pedagogyApi = MApi.getPedagogyApi();

/**
 * useWorkspaces
 * @param studentIdentifier studentIdentifier
 * @param displayNotification displayNotification
 */
export const useWorkspaces = (
  studentIdentifier: string,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [textInput, setTextInput] = React.useState<string>("");
  const [workspaces, setWorkspaces] = React.useState<PedagogyWorkspace[]>([]);
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
        const workspaces = (await pedagogyApi.getPedagogyFormWorkspaces({
          studentIdentifier,
          q: textInput,
          maxResults: 20,
        })) as PedagogyWorkspace[];

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
  }, [textInput, displayNotification, studentIdentifier]);

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
