import Link from "../../../general/link";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { CalendarEvent } from "~/reducers/main-function/calendar";
import "~/sass/elements/panel.scss";
import "~/sass/elements/guidance-event.scss";
import { bindActionCreators } from "redux";
import moment from "~/lib/moment";
import {
  deleteCalendarEvent,
  deleteCalendarEventTrigger,
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
  deleteCalendarEvent: deleteCalendarEventTrigger;
}

/**
 * GuidanceEvent
 * @param props GuidaceEventProps
 * @returns JSX.element
 */
const GuidanceEvent: React.FC<GuidanceEventProps> = (props) => {
  const {
    i18n,
    status,
    event,
    changeCalendarAttendanceStatus,
    deleteCalendarEvent,
  } = props;
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

  // TODO: implement some kind of "are you sure"-confirmation dialog
  /**
   * handleEventCancel cancels (deletes) the event
   * @param eventId event's id
   */
  const handleEventCancel = (eventId: number): void => {
    deleteCalendarEvent(eventId);
  };
  const participation = event.participants.filter(
    (participant) => participant.userEntityId === status.userId
  );
  const studentParticipation =
    participation.length !== 0 && participation[0].attendance === "UNCONFIRMED";

  /**
   * GetParticipants handling for event participants
   * @param event calendar event
   * @returns JSX.element
   */
  const getParticipants = (event: CalendarEvent) => {
    if (event.participants.length > 0) {
      return event.participants.map((participant) => (
        <span
          className={`state-${participant.attendance}`}
          key={"participant-" + participant.userEntityId}
        >
          {participant.name}
        </span>
      ));
    } else {
      return (
        <span className="state-UNCONFIRMED">
          {i18n.text.get("plugin.frontPage.guidanceEvents.participants.empty")}
        </span>
      );
    }
  };

  return (
    <div key={event.id} className={`guidance-event`}>
      {status.isStudent ? (
        <div className={`guidance-event__item`}>
          <span
            className={`guidance-event__icon icon-bubbles ${
              !studentParticipation
                ? "state-" + participation[0].attendance
                : ""
            }`}
          />
          <div className="guidance-event__body">
            <div
              className={`guidance-event__body-header ${
                participation[0].attendance !== "UNCONFIRMED"
                  ? "state-" + participation[0].attendance
                  : ""
              }`}
            >
              {event.title + " " + moment(event.start).format("MMMM Do hh:mm")}
            </div>
            <div className="guidance-event__body-content">
              {event.description}
            </div>
            {studentParticipation ? (
              <div className="guidance-event__body-footer">
                <Link onClick={() => handleEventAttendance(event.id, "YES")}>
                  {i18n.text.get("plugin.frontPage.guidanceEvents.state.YES")}
                </Link>
                <Link onClick={() => handleEventAttendance(event.id, "NO")}>
                  {i18n.text.get("plugin.frontPage.guidanceEvents.state.NO")}
                </Link>
                <Link onClick={() => handleEventAttendance(event.id, "MAYBE")}>
                  {i18n.text.get("plugin.frontPage.guidanceEvents.state.MAYBE")}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className={`guidance-event__item`}>
          <span className={`guidance-event__icon icon-bubbles`} />
          <div className="guidance-event__body">
            <div className={`guidance-event__body-header`}>
              {event.title +
                " " +
                moment(event.start).format("dddd, MMMM Do hh:mm")}
            </div>
            <div className="guidance-event__body-content">
              <div className="guidance-event__body-description">
                {event.description}
              </div>
              <div className="guidance-event__body-participants">
                {getParticipants(event)}
              </div>
            </div>
            <div className="guidance-event__body-footer">
              <Link onClick={handleEventCancel.bind(this, event.id)}>
                Peruuta tapahtuma
              </Link>
            </div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * mapDispatchToProps
 * @param dispatch redux dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      changeCalendarAttendanceStatus,
      deleteCalendarEvent,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(GuidanceEvent);
