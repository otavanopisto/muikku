import { ActionType, SpecificActionType } from "~/actions";
import MuikkuWebsocket from "~/util/websocket";

export type WEBSOCKET_EVENT = SpecificActionType<
  "WEBSOCKET_EVENT",
  { event: string }
>;
export type INITIALIZE_WEBSOCKET = SpecificActionType<
  "INITIALIZE_WEBSOCKET",
  MuikkuWebsocket
>;

export interface WebsocketStateType {
  connected: boolean;
  synchronized: boolean;
  websocket: MuikkuWebsocket;
}

export default function websocket(
  state: WebsocketStateType = {
    connected: false,
    synchronized: true,
    websocket: null,
  },
  action: ActionType,
): WebsocketStateType {
  if (
    action.type === "WEBSOCKET_EVENT" &&
    action.payload.event === "webSocketConnected" &&
    !state.connected
  ) {
    return Object.assign({}, state, { connected: true });
  } else if (
    action.type === "WEBSOCKET_EVENT" &&
    action.payload.event === "webSocketDisconnected" &&
    state.connected
  ) {
    return Object.assign({}, state, { connected: false });
  } else if (
    action.type === "WEBSOCKET_EVENT" &&
    action.payload.event === "webSocketDesync" &&
    state.synchronized
  ) {
    return Object.assign({}, state, { synchronized: false });
  } else if (
    action.type === "WEBSOCKET_EVENT" &&
    action.payload.event === "webSocketSync" &&
    !state.synchronized
  ) {
    return Object.assign({}, state, { synchronized: true });
  } else if (action.type === "INITIALIZE_WEBSOCKET") {
    return Object.assign({}, state, { websocket: action.payload });
  }
  return state;
}
