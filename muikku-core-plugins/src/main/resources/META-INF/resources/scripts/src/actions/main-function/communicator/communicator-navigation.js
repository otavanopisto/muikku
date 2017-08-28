import actions from '~/actions/base/notifications';
import {colorIntToHex} from '~/util/modifiers';

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
  }
}