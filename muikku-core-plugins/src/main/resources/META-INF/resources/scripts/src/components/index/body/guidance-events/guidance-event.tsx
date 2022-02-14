import Link from "../../../general/link";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { CalendarEvent } from "~/reducers/calendar";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";
import { bindActionCreators } from "redux";
import moment from "~/lib/moment";
import {
  changeCalendarAttendanceStatus,
  updateCalendarAttendanceStatusTrigger,
} from "~/actions/main-function/calendar";

/**
interface GuidanceEventProps {
 *
 */
interface GuidanceEventProps {
  i18n: i18nType; // Localization
  status: StatusType;
  event: CalendarEvent;
  changeCalendarAttendanceStatus: updateCalendarAttendanceStatusTrigger;
}

/**
 * GuidanceEvent
 * @param props GuidaceEventProps
 * @returns JSX.element
 */
const GuidanceEvent: React.FC<GuidanceEventProps> = (props) => {
  const { i18n, status, event, changeCalendarAttendanceStatus } = props;
  /**
   * handleEventParticipation changes the attencance status
   * @param eventId id of the event_id
   * @param status attendance status
   */
  const handleEventAttendance = (
    eventId: number,
    status: "YES" | "NO" | "MAYBE"
  ) => {
    changeCalendarAttendanceStatus(eventId, status);
  };
  const participation = event.participants.filter(
    (participant) => participant.userEntityId === status.userId
  );
  const studentParticipation =
    status.isStudent && participation[0].attendance !== "UNCONFIRMED";

  return (
    <div
      key={event.id}
      className={`item-list__item item-list__item--guidance-events`}
    >
      {studentParticipation ? (
        <>
          <span
            className={`item-list__icon item-list__icon--guidance-events icon-bubbles ${
              studentParticipation ? "state-" + participation[0].attendance : ""
            }`}
          />

          <div className="item-list__text-body item-list__text-body--multiline">
            <div
              className={`item-list__item-header ${
                participation[0].attendance !== "UNCONFIRMED"
                  ? "state-" + participation[0].attendance
                  : ""
              }`}
            >
              {event.title +
                " " +
                moment(event.start).format("dddd, MMMM Do hh:mm")}
            </div>
            <div className="item-list__item-content">{event.description}</div>
            <div className="item-list__item-footer">
              <Link onClick={handleEventAttendance.bind(this, event.id, "YES")}>
                {i18n.text.get("plugin.frontPage.guidanceEvents.state.YES")}
              </Link>
              <Link onClick={handleEventAttendance.bind(this, event.id, "NO")}>
                {i18n.text.get("plugin.frontPage.guidanceEvents.state.NO")}
              </Link>
              <Link
                onClick={handleEventAttendance.bind(this, event.id, "MAYBE")}
              >
                {i18n.text.get("plugin.frontPage.guidanceEvents.state.MAYBE")}
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <span
            className={`item-list__icon item-list__icon--guidance-events icon-bubbles ${
              studentParticipation ? "state-" + participation[0].attendance : ""
            }`}
          />
          <div className="item-list__text-body item-list__text-body--multiline">
            <div
              className={`item-list__item-header ${
                status.isStudent &&
                participation[0].attendance !== "UNCONFIRMED"
                  ? "state-" + participation[0].attendance
                  : ""
              }`}
            >
              {event.title +
                " " +
                moment(event.start).format("dddd, MMMM Do hh:mm")}
            </div>
            <div className="item-list__item-content">
              <div>{event.description}</div>
              <div>
                {event.participants.map((participant) => (
                  <span key={``}>{participant.name}</span>
                ))}
              </div>
            </div>
            <div className="item-list__item-footer">
              <Link>Linkki keskusteluun</Link>
            </div>
            <div></div>
          </div>
        </>
      )}
    </div>
  );
};

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

export default connect(null, mapDispatchToProps)(GuidanceEvent);
