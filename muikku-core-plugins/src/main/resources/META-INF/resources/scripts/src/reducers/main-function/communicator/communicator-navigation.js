const defaultNavigation = [
  {
    location: "inbox",
    type: "folder",
    id: "inbox",
    icon: "new-section",
    text(i18n){return i18n.text.get("plugin.communicator.category.title.inbox")}
  },
  {
    location: "unread",
    type: "folder",
    id: "unread",
    icon: "new-section",
    text(i18n){return i18n.text.get("plugin.communicator.category.title.unread")}
  },
  {
    location: "sent",
    type: "folder",
    id: "sent",
    icon: "new-section",
    text(i18n){return i18n.text.get("plugin.communicator.category.title.sent")}
  },
  {
    location: "trash",
    type: "folder",
    id: "trash",
    icon: "new-section",
    text(i18n){return i18n.text.get("plugin.communicator.category.title.trash")}
  }
]

export default function communicatorNavigation(state=defaultNavigation, action){
  if (action.type === 'UPDATE_COMMUNICATOR_NAVIGATION_LABELS'){
    return defaultNavigation.concat(action.payload);
  } else if (action.type === 'ADD_COMMUNICATOR_NAVIGATION_LABEL'){
    return state.concat(action.payload);
  } else if (action.type === 'DELETE_COMMUNICATOR_NAVIGATION_LABEL'){
    return state.filter((item)=>{return item.location !== action.payload.location});
  } else if (action.type === 'UPDATE_COMMUNICATOR_NAVIGATION_LABEL'){
    return state.map((item)=>{
      if (item.location !== action.payload.location){
        return item;
      }
      return action.payload;
    });
  }
  return state;
}