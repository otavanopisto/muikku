import actions from '~/actions/base/notifications';
import {colorIntToHex, hexToColorInt} from '~/util/modifiers';

export default {
  updateCommunicatorNavigationLabels(callback){
    return (dispatch, getState)=>{
      mApi().communicator.userLabels.read().callback(function (err, labels) {
        if (err){
          dispatch(actions.displayNotification(err.message, 'error'));
        } else {
          dispatch({
            type: 'UPDATE_COMMUNICATOR_NAVIGATION_LABELS',
            payload: labels.map((label)=>{
              return {
                location: "label-" + label.id,
                id: label.id,
                type: "label",
                icon: "tag",
                text(){return label.name},
                color: colorIntToHex(label.color)
              }
            })
          });
          
          callback && callback();
        }
      });
    }
  },
  addCommunicatorLabel(name){
    return (dispatch, getState)=>{
      let color = Math.round(Math.random() * 16777215);
      let label = {
        name,
        color
      };
        
      mApi().communicator.userLabels.create(label).callback(function (err, label) {
        if (err) {
          dispatch(actions.displayNotification(err.message, 'error'));
        } else {
          dispatch({
            type: "ADD_COMMUNICATOR_NAVIGATION_LABEL",
            payload: {
              location: "label-" + label.id,
              id: label.id,
              type: "label",
              icon: "tag",
              text(){return label.name},
              color: colorIntToHex(label.color)
            }
          });
        }
      });
    }
  },
  updateCommunicatorLabel(label, newName, newColor){
    return (dispatch, getState)=>{
      let newLabelData = {
        name: newName,
        color: hexToColorInt(newColor),
        id: label.id
      };
        
      mApi().communicator.userLabels.update(label.id, newLabelData).callback(function (err, label) {
        if (err) {
          dispatch(actions.displayNotification(err.message, 'error'));
        }
        
        dispatch({
          type: "UPDATE_ONE_LABEL_FROM_ALL_MESSAGES",
          payload: {
            labelId: label.id,
            update: {
              labelName: newLabelData.name,
              labelColor: newLabelData.color
            }
          }
        });
        dispatch({
          type: "UPDATE_COMMUNICATOR_NAVIGATION_LABEL",
          payload: {
            labelId: label.id,
            update: {
              text: ()=>newLabelData.name,
              color: newColor
            }
          }
        });
      });
    }
  },
  removeLabel(label){
    return (dispatch, getState)=>{
      mApi().communicator.userLabels.del(label.id).callback(function (err) {
        if (err) {
          return dispatch(actions.displayNotification(err.message, 'error'));
        }
        let {communicatorMessages} = getState();
        
        //Notice this is an external trigger, not the nicest thing, but as long as we use hash navigation, meh
        if (communicatorMessages.location === label.location){
          location.hash = "#inbox";
        }
        
        dispatch({
          type: "DELETE_COMMUNICATOR_NAVIGATION_LABEL",
          payload: label
        });
        dispatch({
          type: "REMOVE_ONE_LABEL_FROM_ALL_MESSAGES",
          payload: {
            labelId: label.id
          }
        });
      });
    }
  }
}