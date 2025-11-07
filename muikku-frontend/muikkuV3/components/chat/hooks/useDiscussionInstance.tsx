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
 * Handles discussion instance data and state
 * @param props props
 */
function useDiscussionInstance(props: UseMessagesInstanceProps) {
  const { instance } = props;

  const [infoState, setInfoState] = React.useState<ChatDiscussionInstanceState>(
    instance.getCurrentState()
  );

  /**
   * If instance state changes, re-render so changes are reflected
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

export default useDiscussionInstance;
