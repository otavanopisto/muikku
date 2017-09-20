import {ActionType} from '~/actions';
import {WebsocketStateType} from '~/reducers';

export default function websocket(state: WebsocketStateType={
  connected: false
}, action: ActionType<any>): WebsocketStateType{
  if (action.type === "WEBSOCKET_EVENT" && action.payload.event === "webSocketConnected"){
    return Object.assign({}, state, {connected: true});
  } else if (action.type === "WEBSOCKET_EVENT" && action.payload.event === "webSocketDisconnected"){
    return Object.assign({}, state, {connected: false});
  }
  return state;
}