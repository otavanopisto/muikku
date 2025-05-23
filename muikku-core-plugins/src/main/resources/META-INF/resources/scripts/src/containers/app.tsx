import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import Websocket from "~/util/websocket";
import { WindowContextProvider } from "~/context/window-context";
import { ChatWebsocketContextProvider } from "~/components/chat/context/chat-websocket-context";
import Chat from "~/components/chat";
import Notifications from "~/components/base/notifications";
import DisconnectedWarningDialog from "~/components/base/disconnect-warning";
import EasyToUseFunctions from "~/components/easy-to-use-reading-functions/easy-to-use-functions";
import AppRoutes from "~/routes/app-routes";
import { Provider } from "react-redux";
import { StateType } from "~/reducers";
import { Store } from "redux";
import { HelmetProvider } from "react-helmet-async";
import TitleProvider from "./titleProvider";

/**
 * AppProps
 */
interface AppProps {
  websocket: Websocket;
  store: Store<StateType>;
}

/**
 * App
 * @param props props
 * @returns JSX.Element
 */
function App(props: AppProps) {
  const { websocket, store } = props;

  return (
    <HelmetProvider>
      <Provider store={store}>
        <div id="root">
          <WindowContextProvider>
            <ChatWebsocketContextProvider websocket={websocket}>
              <Chat />
            </ChatWebsocketContextProvider>
            <Notifications />
            <DisconnectedWarningDialog />
            <EasyToUseFunctions />
            <BrowserRouter>
              <TitleProvider>
                <AppRoutes store={store} websocket={websocket} />
              </TitleProvider>
            </BrowserRouter>
          </WindowContextProvider>
        </div>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
