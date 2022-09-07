import { ActionType, SpecificActionType } from "~/actions";
import MuikkuWebsocket from "~/util/websocket";

export type WebsocketEventType =
  | "webSocketConnected"
  | "webSocketDisconnected"
  | "webSocketDesync"
  | "webSocketSync";

export type WEBSOCKET_EVENT = SpecificActionType<
  "WEBSOCKET_EVENT",
  { event: WebsocketEventType }
>;
export type INITIALIZE_WEBSOCKET = SpecificActionType<
  "INITIALIZE_WEBSOCKET",
  MuikkuWebsocket
>;

/**
 * WebsocketStateType
 */
export interface WebsocketStateType {
  connected: boolean;
  synchronized: boolean;
  websocket: MuikkuWebsocket;
}

/**
 * initialWebsocketState
 */
const initialWebsocketState: WebsocketStateType = {
  connected: false,
  synchronized: true,
  websocket: null,
};

// Is using old if else way to handle actions, just cause its here way more simple that switch case

/**
 * websocket
 * @param state state
 * @param action action
 */
export default function websocket(
  state: WebsocketStateType = initialWebsocketState,
  action: ActionType
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
