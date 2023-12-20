import * as React from "react";
import { ChatInstanceInfo, ChatMessages } from "../types/chat-instance";

/**
 * UseMessagesInstanceProps
 */
interface UseMessagesInstanceProps {
  instance: ChatMessages;
}

/**
 * useMessagesInstance
 * @param props props
 */
function useMessagesInstance(props: UseMessagesInstanceProps) {
  const { instance } = props;

  const [infoState, setInfoState] = React.useState<ChatInstanceInfo>(
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
      instance.removeChangeListener(reRenderCallback);
    };
  }, [instance, reRenderCallback]);

  return {
    instance,
    infoState,
  };
}

export default useMessagesInstance;
