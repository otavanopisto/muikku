export default function communicatorMessages(state={
  state: "WAIT",
  messages: [],
  selected: [],
  selectedIds: []
}, action){
  if (action.type === "UPDATE_MESSAGES_STATE"){
    return Object.assign({}, state, {state: action.payload});
  } else if (action.type === "UPDATE_MESSAGES"){
    return Object.assign({}, state, {messages: action.payload});
  } else if (action.type === "UPDATE_SELECTED_MESSAGES"){
    return Object.assign({}, state, {selected: action.payload, selectedIds: action.payload.map(s=>s.id)});
  } else if (action.type === "ADD_TO_COMMUNICATOR_SELECTED_MESSAGES"){
    return Object.assign({}, state, {selected: state.selected.concat([action.payload]), selectedIds: state.selectedIds.concat([action.payload.id])});
  } else if (action.type === "REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES"){
    return Object.assign({}, state, {selected: state.selected.filter((selected)=>{
      return selected.id !== action.payload.id
    }), selectedIds: state.selectedIds.filter((id)=>{return id !== action.payload.id})});
  }
  return state;
}