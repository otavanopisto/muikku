import Link from "../../general/link";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import {
  Calendar,
  CalendarEvent,
  CalendarEventUpdate,
} from "~/reducers/calendar";
import { StateType } from "~/reducers";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";
import { bindActionCreators } from "redux";
import moment from "~/lib/moment";
import {
  updateCalendarEvent,
  createCalendarEventTriggerType,
} from "~/actions/main-function/calendar";
interface GuidanceEventsPanelProps {
  i18n: i18nType;
  status: StatusType;
  calendar: Calendar;
  updateCalendarEvent: createCalendarEventTriggerType;
}

const GuidanceEventsPanel: React.FC<GuidanceEventsPanelProps> = (props) => {
  const handleEventParticipation = (
    event: CalendarEvent,
    state: "YES" | "NO" | "MAYBE"
  ) => {
    const eventUpdatePayload: CalendarEventUpdate = {
      id: event.id,
    };
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
                  className={`item-list__item item-list__item--latest-messages`}
                >
                  <span
                    className={`item-list__icon item-list__icon--latest-messages icon-bubbles`}
                  ></span>
                  {props.status.isStudent &&
                  participation[0].attendance === "UNCONFIRMED" ? (
                    <div className="item-list__text-body item-list__text-body--multiline">
                      <div>
                        <span className="item-list__latest-message-caption">
                          {event.title +
                            " " +
                            moment(event.start).format("dddd, MMMM Do hh:mm")}
                        </span>
                      </div>
                      <div>{event.description}</div>
                      <div>
                        <span className="item-list__latest-message-caption">
                          <Link>Yes</Link>
                          <Link>No</Link>
                          <Link>Maybe</Link>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="item-list__text-body item-list__text-body--multiline">
                      <span className="item-list__latest-message-caption">
                        {event.title}
                      </span>
                    </span>
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

function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    i18n: state.i18n,
    calendar: state.calendar,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      updateCalendarEvent,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuidanceEventsPanel);
