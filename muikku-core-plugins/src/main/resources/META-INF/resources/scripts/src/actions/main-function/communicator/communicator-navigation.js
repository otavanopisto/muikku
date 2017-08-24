import actions from '~/actions/base/notifications';
import {colorIntToHex} from '~/util/modifiers';

export default {
  updateCommunicatorNavigationLabels(){
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
        }
      });
    }
  }
}