import actions from '~/actions/base/notifications';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class Notifications extends React.Component {
  render(){
    return (
      <div className="notification-queue">
        <div className="notification-queue-items">
          {this.props.notifications.map((notification)=>{
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
  
function mapStateToProps(state){
  return {
    notifications: state.notifications
  }
};

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators(actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);