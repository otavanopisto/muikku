export default function websocket(state={
  connected: false
}, action){
  if (action.type === "WEBSOCKET_EVENT" && action.payload.event === "webSocketConnected"){
    return Object.assign({}, state, {connected: true});
  } else if (action.type === "WEBSOCKET_EVENT" && action.payload.event === "webSocketDisconnected"){
    return Object.assign({}, state, {connected: false});
  }
  return state;
}