import * as React from "react";
import {
  ChatDiscussionInstanceState,
  ChatDiscussionInstance,
} from "../utility/chat-discussion-instance";

/**
 * UseMessagesInstanceProps
 */
interface UseMessagesInstanceProps {
  instance: ChatDiscussionInstance;
}

/**
 * useMessagesInstance
 * @param props props
 */
function useMessagesInstance(props: UseMessagesInstanceProps) {
  const { instance } = props;

  const [infoState, setInfoState] = React.useState<ChatDiscussionInstanceState>(
    instance.getCurrentState()
  );

  /**
   * reRenderCallback
   */
  const reRenderCallback = React.useCallback(() => {
    setInfoState(instance.getCurrentState());
  }, [instance]);

  React.useEffect(() => {
    instance.addChangeListener(reRenderCallback);

    return () => {
      instance.removeChangeListener();
    };
  }, [instance, reRenderCallback]);

  return {
    instance,
    infoState,
  };
}

export default useMessagesInstance;
