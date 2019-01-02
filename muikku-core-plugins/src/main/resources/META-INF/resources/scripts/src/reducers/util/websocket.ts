import {ActionType} from '~/actions';

export interface WebsocketStateType {
  connected: boolean,
  synchronized: boolean
}

export default function websocket(state: WebsocketStateType={
  connected: false,
  synchronized: true
}, action: ActionType): WebsocketStateType{
  if (action.type === "WEBSOCKET_EVENT" && action.payload.event === "webSocketConnected" && !state.connected){
    return Object.assign({}, state, {connected: true});
  } else if (action.type === "WEBSOCKET_EVENT" && action.payload.event === "webSocketDisconnected" && state.connected){
    return Object.assign({}, state, {connected: false});
  } else if (action.type === "WEBSOCKET_EVENT" && action.payload.event === "webSocketDesync" && state.synchronized){
    return Object.assign({}, state, {synchronized: false});
  } else if (action.type === "WEBSOCKET_EVENT" && action.payload.event === "webSocketSync" && !state.synchronized){
    return Object.assign({}, state, {synchronized: true});
  }
  return state;
}