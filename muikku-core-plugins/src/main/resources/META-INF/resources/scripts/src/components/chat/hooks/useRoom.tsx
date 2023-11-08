import * as React from "react";
import useMessages from "./useMessages";

function useRoom() {
  const { chatMsgs, loadingChatMsgs } = useMessages();
  const [minimized, setMinimized] = React.useState<boolean>(false);

  // Toggles the control box
  const toggleControlBox = React.useCallback(() => {
    setMinimized(!minimized);
  }, [minimized]);

  return { chatMsgs, loadingChatMsgs };
}

export default useRoom;
