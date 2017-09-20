import actions from '~/actions/base/notifications';
import {colorIntToHex, hexToColorInt} from '~/util/modifiers';
import promisify from '~/util/promisify';

export default {
  updateCommunicatorNavigationLabels(callback){
    return async (dispatch, getState)=>{
      try {
        let labels = await promisify(mApi().communicator.userLabels.read(), 'callback')();
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
      } catch (err) {
        dispatch(actions.displayNotification(err.message, 'error'));
      }
    }
  },
  addCommunicatorLabel(name){
    return async (dispatch, getState)=>{
      let color = Math.round(Math.random() * 16777215);
      let label = {
        name,
        color
      };
      
      try {
        let newLabel = await promisify(mApi().communicator.userLabels.create(label), 'callback')();
        dispatch({
          type: "ADD_COMMUNICATOR_NAVIGATION_LABEL",
          payload: {
            location: "label-" + newLabel.id,
            id: newLabel.id,
            type: "label",
            icon: "tag",
            text(){return newLabel.name},
            color: colorIntToHex(newLabel.color)
          }
        });
      } catch (err){
        dispatch(actions.displayNotification(err.message, 'error'));
      }
    }
  },
  updateCommunicatorLabel(label, newName, newColor){
    return async (dispatch, getState)=>{
      let newLabelData = {
        name: newName,
        color: hexToColorInt(newColor),
        id: label.id
      };
      
      try {
        await promisify(mApi().communicator.userLabels.update(label.id, newLabelData), 'callback')();
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
      } catch(err){
        dispatch(actions.displayNotification(err.message, 'error'));
      }
    }
  },
  removeLabel(label){
    return async (dispatch, getState)=>{
      try {
        await promisify(mApi().communicator.userLabels.del(label.id), 'callback')();
        let {communicatorMessages} = getState();
        
        //Notice this is an external trigger, not the nicest thing, but as long as we use hash navigation, meh
        if (communicatorMessages.location === label.location){
          location.hash = "#inbox";
        }
        
        dispatch({
          type: "DELETE_COMMUNICATOR_NAVIGATION_LABEL",
          payload: {
            labelId: label.id
          }
        });
        dispatch({
          type: "REMOVE_ONE_LABEL_FROM_ALL_MESSAGES",
          payload: {
            labelId: label.id
          }
        });
      } catch (err){
        dispatch(actions.displayNotification(err.message, 'error'));
      }
    }
  }
}