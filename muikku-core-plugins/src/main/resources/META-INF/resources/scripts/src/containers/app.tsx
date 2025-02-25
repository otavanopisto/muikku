import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { Store } from "redux";
import { StateType } from "~/reducers";
import Websocket from "~/util/websocket";
import { WindowContextProvider } from "~/context/window-context";
import { ChatWebsocketContextProvider } from "~/components/chat/context/chat-websocket-context";
import Chat from "~/components/chat";
import Notifications from "~/components/base/notifications";
import DisconnectedWarningDialog from "~/components/base/disconnect-warning";
import EasyToUseFunctions from "~/components/easy-to-use-reading-functions/easy-to-use-functions";
import AppRoutes from "~/routes/AppRoutes";

/**
 * AppProps
 */
interface AppProps {
  store: Store<StateType>;
  websocket: Websocket;
}

/**
 * App
 * @param props props
 * @returns JSX.Element
 */
export default function App(props: AppProps) {
  const { store, websocket } = props;

  return (
    <div id="root">
      <WindowContextProvider>
        <ChatWebsocketContextProvider websocket={websocket}>
          <Chat />
          <Notifications />
          <DisconnectedWarningDialog />
          <EasyToUseFunctions />
        </ChatWebsocketContextProvider>
        <BrowserRouter>
          <AppRoutes store={store} websocket={websocket} />
        </BrowserRouter>
      </WindowContextProvider>
    </div>
  );
}
