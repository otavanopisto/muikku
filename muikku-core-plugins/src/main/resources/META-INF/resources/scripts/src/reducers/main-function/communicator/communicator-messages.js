export default function communicatorMessages(state={
  state: "LOADING",
  messages: [],
  selected: [],
  selectedIds: [],
  pages: 1,
  hasMore: false,
  location: "",
  toolbarLock: false
}, action){
  if (action.type === "UPDATE_MESSAGES_STATE"){
    return Object.assign({}, state, {state: action.payload});
  } else if (action.type === "UPDATE_PAGES"){
    return Object.assign({}, state, {pages: action.payload});
  } else if (action.type === "UPDATE_HAS_MORE"){
    return Object.assign({}, state, {hasMore: action.payload});
  } else if (action.type === "UPDATE_MESSAGES_ALL_PROPERTIES"){
    return Object.assign({}, state, action.payload);
  } else if (action.type === "UPDATE_MESSAGES"){
    return Object.assign({}, state, {messages: action.payload});
  } else if (action.type === "UPDATE_SELECTED_MESSAGES"){
    return Object.assign({}, state, {selected: action.payload, selectedIds: action.payload.map(s=>s.communicatorMessageId)});
  } else if (action.type === "ADD_TO_COMMUNICATOR_SELECTED_MESSAGES"){
    return Object.assign({}, state, {selected: state.selected.concat([action.payload]), selectedIds: state.selectedIds.concat([action.payload.communicatorMessageId])});
  } else if (action.type === "REMOVE_FROM_COMMUNICATOR_SELECTED_MESSAGES"){
    return Object.assign({}, state, {selected: state.selected.filter((selected)=>{
      return selected.communicatorMessageId !== action.payload.communicatorMessageId
    }), selectedIds: state.selectedIds.filter((id)=>{return id !== action.payload.communicatorMessageId})});
  } else if (action.type === "UPDATE_ONE_MESSAGE"){
    let newMessage = Object.assign({}, action.payload.message, action.payload.update);
    return Object.assign({}, state, {selected: state.selected.map((selected)=>{
      if (selected.communicatorMessageId === action.payload.message.communicatorMessageId){
        return newMessage
      }
      return selected;
    }), messages: state.messages.map((message)=>{
      if (message.communicatorMessageId === action.payload.message.communicatorMessageId){
        return newMessage
      }
      return message;
    })});
  } else if (action.type === "LOCK_TOOLBAR"){
    return Object.assign({}, state, {toolbarLock: true});
  } else if (action.type === "UNLOCK_TOOLBAR"){
    return Object.assign({}, state, {toolbarLock: false});
  } else if (action.type === "UPDATE_MESSAGE_ADD_LABEL"){
    let newMessage = action.payload.message;
    if (!newMessage.labels.find(label=>label.labelId === action.payload.label.labelId)){
      newMessage = Object.assign({}, newMessage, {
        labels: newMessage.labels.concat([action.payload.label])
      });
    }
    return Object.assign({}, state, {selected: state.selected.map((selected)=>{
      if (selected.communicatorMessageId === action.payload.message.communicatorMessageId){
        return newMessage
      }
      return selected;
    }), messages: state.messages.map((message)=>{
      if (message.communicatorMessageId === action.payload.message.communicatorMessageId){
        return newMessage
      }
      return message;
    })});
  } else if (action.type === "UPDATE_MESSAGE_DROP_LABEL"){
    let newMessage = Object.assign({}, action.payload.message, {
      labels: action.payload.message.labels.filter(label=>label.labelId !== action.payload.label.labelId)
    });
    return Object.assign({}, state, {selected: state.selected.map((selected)=>{
      if (selected.communicatorMessageId === action.payload.message.communicatorMessageId){
        return newMessage
      }
      return selected;
    }), messages: state.messages.map((message)=>{
      if (message.communicatorMessageId === action.payload.message.communicatorMessageId){
        return newMessage
      }
      return message;
    })});
  }
  return state;
}