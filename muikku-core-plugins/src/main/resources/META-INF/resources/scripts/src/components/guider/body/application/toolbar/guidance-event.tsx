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
import interactionPlugin from "@fullcalendar/interaction";
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
} from "~/actions/main-function/calendar";
import { StatusType } from "~/reducers/base/status";

/**
 *  Props for the guidance event reservation
 */
interface GuidanceEventProps {
  i18n: i18nType; // Localization
  guider: GuiderType;
  children: React.ReactElement<any>;
  calendar: Calendar; // Calendar events
  status: StatusType;
  loadCalendarEvents: LoadCalendarEventsTriggerType;
  createCalendarEvent: createCalendarEventTriggerType;
}

/**
 *  State for guidance event reservation
 */
interface GuidanceEventState {
  locked: boolean; // If the save button should be locked
}

/**
 * Guidance event component
 */
class GuidanceEvent extends React.Component<
  GuidanceEventProps,
  GuidanceEventState
> {
  private calendarRef = React.createRef<FullCalendar>(); // Reference to access the calendar

  /**
   * Constructor
   * @param props
   */
  constructor(props: GuidanceEventProps) {
    super(props);

    this.state = {
      locked: true,
    };
  }

  //TODO: this could be a reusable effect that returns a start and end date
  /**
   * Handler for events loading
   * @param forceLoad if true, load will be forced
   */
  handleCalendarEventsLoad = (forceLoad: boolean) => {
    const calendarApi = this.calendarRef.current // If the calendar is not available, this will be null
      ? this.calendarRef.current.getApi()
      : null;

    const startDate = calendarApi // If the calendarApi is not available, date will be now
      ? moment(calendarApi.view.currentStart).format()
      : moment().format();

    const endDate = calendarApi // If the calendarApi is not available, date will be now
      ? moment(calendarApi.view.currentEnd).format()
      : moment().format();

    //TODO: There will be different types of events so a typecheck will be needed here
    /**Only loads if there are no events in the state or the load is forced*/
    if (this.props.calendar.events.length === 0 || forceLoad) {
      this.props.loadCalendarEvents(
        this.props.guider.currentStudent.basic.userEntityId,
        startDate,
        endDate
      );
    }
  };

  /**
   * Clears the event from the state
   * @param args Arguments of the event that has been clicked
   */
  handleEventClick = (args: EventClickArg) => {
    if (!args.el.classList.contains("fc-bg-event")) {
      const event = this.calendarRef.current
        .getApi()
        .getEventById(args.event.id);
      event.remove();
      this.setState({ locked: true });
    }
  };

  /**
   * Handles the selection of a state in the calendar
   * @param args Arguments of selected date from the fullCalendar
   */
  handleDateSelect = (args: DateSelectArg) => {
    let newEvent = {
      id: "new-event",
      title: getName(this.props.guider.currentStudent.basic, true),
      description: "Ohjausaika opiskelijalle",
      start: args.startStr,
      classNames: ["env-dialog__guidance-event"],
      overlap: false,
      end: args.endStr,
    };
    this.calendarRef.current.getApi().addEvent(newEvent);
    this.setState({ locked: false });
  };

  /**
   * Saves the event and runs the thunk functions and such
   * @param closeDialog close function for the dialog
   */
  handleSaveEvent = (closeDialog: () => void) => {
    const event = this.calendarRef.current.getApi().getEventById("new-event");

    const payload = {
      title: event.title,
      description: event.extendedProps.description,
      start: event.startStr,
      end: event.endStr,
      visibility: "PRIVATE" as EventVisibility,
      participants: [
        {
          userEntityId: this.props.status.userId,
        },
        {
          userEntityId: this.props.guider.currentStudent.basic.userEntityId,
        },
      ],
    };
    this.props.createCalendarEvent(payload); // Create a new event
    this.clearState();
    closeDialog(); // Close the dialog
  };
  /**
   *Handles dialog close
   * @param closeDialog
   */
  handleDialogClose = (closeDialog: () => void) => {
    this.clearState();
    closeDialog();
  };
  /**
   * Clears component state
   */
  clearState = () => {
    this.setState({ locked: true });
  };

  render() {
    /** Turns then state events to background events*/
    const events = this.props.calendar.events.map((event) => {
      return {
        title: event.title,
        start: event.start,
        end: event.end,
        display: "background",
      };
    });

    /**
     * Dialog content
     * @returns JSX.Element fullcalendar component
     */
    const content = () => (
      <FullCalendar
        ref={this.calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        select={this.handleDateSelect}
        editable={true}
        selectable={true}
        events={events}
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

    /**
     * Dialog footer
     * @param closeDialog dialog close function
     * @returns JSX.Element
     */
    const footer = (closeDialog: () => void) => (
      <div className="env-dialog__actions env-dialog__actions--guidance-event">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.handleSaveEvent.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.guider.user.addGuidanceEvent.button.save"
          )}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={this.handleDialogClose.bind(this, closeDialog)}
        >
          {this.props.i18n.text.get(
            "plugin.guider.user.addGuidanceEvent.button.cancel"
          )}
        </Button>
      </div>
    );

    return (
      <EnvironmentDialog
        executeOnOpen={this.handleCalendarEventsLoad.bind(this)}
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

/**
 * Takes the app state and maps it into component props
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider,
    calendar: state.calendar,
    status: state.status,
  };
}

/**
 * Specifies what actions can be dispatched from the props
 * @param dispatch
 * @returns bindActionCreators
 */
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
