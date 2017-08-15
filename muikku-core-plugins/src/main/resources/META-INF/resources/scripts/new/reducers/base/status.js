//This one also uses a hack to access the data in the dom
//please replace it with the following procedure
//1. Create a rest endpoint to get the permissions list
//2. in the main file gather those permissions... etc..., eg. index.js make a call
//3. dispatch the action to this same reducer and gather the action here
//4. it works :D

export default function status(state={
  loggedIn: !!MUIKKU_LOGGED_USER_ID,
  userId: MUIKKU_LOGGED_USER_ID,
  permissions: MUIKKU_PERMISSIONS
}, action){
  if (action.type === "LOGOUT"){
    $('#logout').click();
    return state;
  }
  return state;
}