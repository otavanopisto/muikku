import {
  DisplayNotificationTriggerType,
  HideNotificationTriggerType,
  displayNotification,
  hideNotification,
} from "~/actions/base/notifications";
import * as React from "react";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  NotificationListType,
  NotificationType,
} from "~/reducers/base/notifications";
import { StateType } from "~/reducers";
import Portal from "~/components/general/portal";

import "~/sass/elements/notification-queue.scss";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * NotificationsProps
 */
interface NotificationsProps {
  notifications: NotificationListType;
  hideNotification: HideNotificationTriggerType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * NotificationsState
 */
interface NotificationsState {}

/**
 * Notifications
 */
class Notifications extends React.Component<
  NotificationsProps,
  NotificationsState
> {
  /**
   * render
   */
  render() {
    return (
      <Portal isOpen>
        <div className="notification-queue">
          <div className="notification-queue__items">
            {this.props.notifications.map((notification: NotificationType) => (
              <div
                role={
                  notification.severity === "error" ||
                  notification.severity === "warning"
                    ? "alertdialog"
                    : null
                }
                key={notification.id}
                className={
                  "notification-queue__item notification-queue__item--" +
                  notification.severity
                }
              >
                <span
                  dangerouslySetInnerHTML={{ __html: notification.message }}
                />

                <a
                  className="notification-queue__close"
                  onClick={this.props.hideNotification.bind(this, notification)}
                ></a>
              </div>
            ))}
          </div>
        </div>
      </Portal>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    notifications: state.notifications.notifications,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { hideNotification, displayNotification },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
