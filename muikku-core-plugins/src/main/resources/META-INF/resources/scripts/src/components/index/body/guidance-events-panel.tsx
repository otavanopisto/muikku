import Link from "../../general/link";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import {
  Calendar,
} from "~/reducers/calendar";
import { StateType } from "~/reducers";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";
import { bindActionCreators } from "redux";
import moment from "~/lib/moment";
import {
  changeCalendarAttendanceStatus,
  updateCalendarAttendanceStatusTrigger,
} from "~/actions/main-function/calendar";

/**
interface GuidanceEventsPanelProps {
 *
 */
interface GuidanceEventsPanelProps {
  i18n: i18nType; // Localization
  status: StatusType;
  calendar: Calendar;
  changeCalendarAttendanceStatus: updateCalendarAttendanceStatusTrigger;
}

/**
 * GuidanceEventsPanel
 * @param props
 * @returns JSX.element
 */
const GuidanceEventsPanel: React.FC<GuidanceEventsPanelProps> = (props) => {
  const handleEventParticipation = (
    event: number,
    status: "YES" | "NO" | "MAYBE"
  ) => {
    props.changeCalendarAttendanceStatus(event, status)
  };
  return (
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
              const participation = event.participants.filter(
                (participant) =>
                  participant.userEntityId === props.status.userId
              );
              return (
                <div
                  key={event.id}
                  className={`item-list__item item-list__item--guidance-events`}
                >                  <span
                className={`item-list__icon item-list__icon--guidance-events icon-bubbles
                ${props.status.isStudent && participation[0].attendance !== "UNCONFIRMED" ? "state-" + participation[0].attendance : ""}`}
              ></span>
                  {props.status.isStudent &&
                  participation[0].attendance === "UNCONFIRMED" ? (

                    <div className="item-list__text-body item-list__text-body--multiline">
                      <div className={`item-list__item-header ${participation[0].attendance !== "UNCONFIRMED" ? "state-" + participation[0].attendance : ""}`}>
                          {event.title +
                            " " +
                            moment(event.start).format("dddd, MMMM Do hh:mm")}
                      </div>
                      <div className="item-list__item-content">{event.description}</div>
                      <div className="item-list__item-footer">
                          <Link onClick={handleEventParticipation.bind(this, event.id, "YES")}>{props.i18n.text.get("plugin.frontPage.guidanceEvents.state.YES")}</Link>
                          <Link onClick={handleEventParticipation.bind(this, event.id, "NO")}>{props.i18n.text.get("plugin.frontPage.guidanceEvents.state.NO")}</Link>
                          <Link onClick={handleEventParticipation.bind(this, event.id, "MAYBE")}>{props.i18n.text.get("plugin.frontPage.guidanceEvents.state.MAYBE")}</Link>
                      </div>
                    </div>
                  ) : (
                    <div className="item-list__text-body item-list__text-body--multiline">
                      <div className={`item-list__item-header ${props.status.isStudent && participation[0].attendance !== "UNCONFIRMED" ? "state-" + participation[0].attendance : ""}`}>
                          {event.title +
                            " " +
                            moment(event.start).format("dddd, MMMM Do hh:mm")}
                      </div>
                      <div className="item-list__item-content">{event.description}</div>
                      <div className="item-list__item-footer"><Link>Linkki keskusteluun</Link></div>
                      <div>
                      </div>
                    </div>
                  )}
                </div>
              );
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
};
/**
 * mapStateToProps
 * @param state
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
 * @param dispatch
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
