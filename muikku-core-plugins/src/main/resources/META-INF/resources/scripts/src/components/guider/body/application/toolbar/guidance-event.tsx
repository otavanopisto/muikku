import * as React from "react";
import EnvironmentDialog from "~/components/general/environment-dialog";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/link.scss";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers";
import { GuiderType, GuiderStudentType } from "~/reducers/main-function/guider";
import { Calendar } from "~/reducers/calendar";
import FullCalendar, {
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  EventResizeStopArg,
} from "@fullcalendar/interaction";
import Button from "~/components/general/button";
import { getName } from "~/util/modifiers";
import moment from "~/lib/moment";
import { Event } from "~/reducers/calendar";

import {
  loadCalendarEvents,
  LoadCalendarEventsTriggerType,
  createCalendarEvent,
  createCalendarEventTriggerType,
  EventVisibility,
  Participants,
} from "~/actions/main-function/calendar";
import { StatusType } from "~/reducers/base/status";

interface GuidanceEventProps {
  i18n: i18nType;
  guider: GuiderType;
  children: React.ReactElement<any>;
  calendar: Calendar;
  status: StatusType;
  loadCalendarEvents: LoadCalendarEventsTriggerType;
  createCalendarEvent: createCalendarEventTriggerType;
}

interface GuidanceEventState {
  newEvent: Event;
  locked: boolean;
}

class GuidanceEvent extends React.Component<
  GuidanceEventProps,
  GuidanceEventState
> {
  private calendarRef = React.createRef<FullCalendar>();
  constructor(props: GuidanceEventProps) {
    super(props);

    this.state = {
      newEvent: {},
      locked: true,
    };
  }

  handleCalendarEventLoad = (forceLoad: boolean) => {
    const calendarApi = this.calendarRef.current
      ? this.calendarRef.current.getApi()
      : null;

    const startDate = calendarApi
      ? moment(calendarApi.view.currentStart).format()
      : moment().format();

    const endDate = calendarApi
      ? moment(calendarApi.view.currentEnd).format()
      : moment().format();

    if (this.props.calendar.events.length === 0 || forceLoad) {
      this.props.loadCalendarEvents(
        this.props.guider.currentStudent.basic.userEntityId,
        startDate,
        endDate
      );
    }
  };

  handleEventClick = () => {
    this.setState({ newEvent: {}, locked: true });
  };

  handleDateSelect = (arg: DateSelectArg) => {
    let newEvent = {
      title: getName(this.props.guider.currentStudent.basic, true),
      description: "Ohjaussaika opiskelijalle",
      start: arg.startStr,
      classNames: ["env-dialog__guidance-event"],
      overlap: false,
      end: arg.endStr,
    };
    this.setState({ newEvent: newEvent, locked: false });
  };

  saveEvent = (closeDialog: () => void) => {
    console.log(this.state.newEvent);
    const event = {
      title: this.state.newEvent.title,
      description: this.state.newEvent.description,
      start: this.state.newEvent.start,
      end: this.state.newEvent.end,
      visibility: "PUBLIC" as EventVisibility,
      participants: [
        {
          userEntityId: this.props.status.userId,
        },
        {
          userEntityId: this.props.guider.currentStudent.basic.userEntityId,
        },
      ],
    };
    this.props.createCalendarEvent(event);
    this.handleCalendarEventLoad(true);
    closeDialog();
  };

  render() {
    // A placeholder waiting for the backend
    const events = this.props.calendar.events.map((event) => {
      return {
        title: event.title,
        start: event.start,
        end: event.end,
        display: "background",
      };
    });

    const content = () => (
      <FullCalendar
        ref={this.calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        select={this.handleDateSelect}
        selectable={true}
        events={[...[this.state.newEvent], ...events]}
        allDaySlot={false}
        eventClick={this.handleEventClick}
        selectOverlap={false}
        locale={"fi"}
        slotMinTime={"09:00:00"}
        slotMaxTime={"16:00:00"}
        slotDuration={"00:30:00"}
        height={"auto"}
        weekends={false}
        firstDay={1}
      />
    );

    const footer = (closeDialog: () => void) => (
      <div className="env-dialog__actions env-dialog__actions--guidance-event">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.saveEvent.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.guider.user.addGuidanceEvent.button.save"
          )}
        </Button>
        <Button buttonModifiers="dialog-cancel" onClick={closeDialog}>
          {this.props.i18n.text.get(
            "plugin.guider.user.addGuidanceEvent.button.cancel"
          )}
        </Button>
      </div>
    );

    return (
      <EnvironmentDialog
        executeOnOpen={this.handleCalendarEventLoad.bind(this)}
        modifier="guidance-event"
        title={this.props.i18n.text.get(
          "plugin.guider.user.actions.reserveGuidanceTime.title"
        )}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider,
    calendar: state.calendar,
    status: state.status,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      loadCalendarEvents,
      createCalendarEvent,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(GuidanceEvent);
