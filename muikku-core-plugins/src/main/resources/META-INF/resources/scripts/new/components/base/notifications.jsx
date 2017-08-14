import actions from '../../actions/base/notifications';

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
  return Redux.bindActionCreators(actions, dispatch);
};

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);