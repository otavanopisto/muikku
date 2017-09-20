import {displayNotificationType, hideNotificationType, displayNotification, hideNotification} from '~/actions/base/notifications';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {AnyActionType} from '~/actions';
import {bindActionCreators} from 'redux';
import {NotificationListType, NotificationType} from '~/reducers/index.d';

interface NotificationsProps {
  notifications: NotificationListType,
  hideNotification: hideNotificationType,
  displayNotification: displayNotificationType
}

interface NotificationsState {
}

class Notifications extends React.Component<NotificationsProps, NotificationsState> {
  render(){
    return (
      <div className="notification-queue">
        <div className="notification-queue-items">
          {this.props.notifications.map((notification: NotificationType)=>{
            return (
              <div key={notification.id} className={"notification-queue-item notification-queue-item-" + notification.severity}>
                <span>{notification.message}</span>
                <a className="notification-queue-item-close" onClick={this.props.hideNotification.bind(this, notification)}></a>
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
  mapStateToProps
)(Notifications);