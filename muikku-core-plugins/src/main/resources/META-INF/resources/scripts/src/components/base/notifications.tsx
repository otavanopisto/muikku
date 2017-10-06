import {DisplayNotificationTriggerType, HideNotificationTriggerType, displayNotification, hideNotification} from '~/actions/base/notifications';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {AnyActionType} from '~/actions';
import {bindActionCreators} from 'redux';
import {NotificationListType, NotificationType} from '~/reducers/base/notifications';

import '~/sass/elements/notification-queue.scss';

interface NotificationsProps {
  notifications: NotificationListType,
  hideNotification: HideNotificationTriggerType,
  displayNotification: DisplayNotificationTriggerType
}

interface NotificationsState {
}

class Notifications extends React.Component<NotificationsProps, NotificationsState> {
  render(){
    return (
      <div className="notification-queue">
        <div className="notification-queue__items">
          {this.props.notifications.map((notification: NotificationType)=>{
            return (
              <div key={notification.id} className={"notification-queue__items__item notification-queue__items__item--" + notification.severity}>
                <span>{notification.message}</span>
                <a className="notification-queue__items__item__close" onClick={this.props.hideNotification.bind(this, notification)}></a>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
  
function mapStateToProps(state:any){
  return {
    notifications: state.notifications
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({hideNotification, displayNotification}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);