import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { Calendar } from "~/reducers/calendar";
import { StateType } from "~/reducers";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";
import { bindActionCreators } from "redux";
import GuidanceEvent from "./guidance-events/guidance-event";
import {
  changeCalendarAttendanceStatus,
  updateCalendarAttendanceStatusTrigger,
} from "~/actions/main-function/calendar";

/**
 * GuidanceEventsPanelProps
 */
interface GuidanceEventsPanelProps {
  i18n: i18nType; // Localization
  status: StatusType;
  calendar: Calendar;
  changeCalendarAttendanceStatus: updateCalendarAttendanceStatusTrigger;
}

/**
 * GuidanceEventsPanel
 * @param props GuidanceEventsPanelProps
 * @returns JSX.element
 */
const GuidanceEventsPanel: React.FC<GuidanceEventsPanelProps> = (props) => (
  <div className="panel panel--latest-messages">
    <div className="panel__header">
      <div className="panel__header-icon panel__header-icon--latest-messages icon-bubbles"></div>
      <h2 className="panel__header-title">
        {props.i18n.text.get("plugin.frontPage.guidanceEvents.title")}
      </h2>
    </div>
    {props.calendar.guidanceEvents.length > 0 ? (
      <div className="panel__body">
        <div className="item-list item-list--panel-latest-messages">
          {props.calendar.guidanceEvents.map((event) => {
            <GuidanceEvent
              i18n={props.i18n}
              status={props.status}
              event={event}
              key={"guidance-event-" + event.id}
            />;
          })}
        </div>
      </div>
    ) : (
      <div className="panel__body panel__body--empty">
        {props.i18n.text.get("plugin.frontPage.guidanceEvents.noEvents")}
      </div>
    )}
  </div>
);

/**
 * mapStateToProps
 * @param state App state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    i18n: state.i18n,
    calendar: state.calendar,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch Redux dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      changeCalendarAttendanceStatus,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuidanceEventsPanel);
