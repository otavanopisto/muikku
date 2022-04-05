import * as React from "react";
import EnvironmentDialog from "~/components/general/environment-dialog";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/link.scss";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers";
import { GuiderType } from "~/reducers/main-function/guider";
import { Calendar } from "~/reducers/main-function/calendar";
import { AnyActionType } from "~/actions";
import FullCalendar, {
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Button from "~/components/general/button";
import { getName } from "~/util/modifiers";
import moment from "~/lib/moment";

import {
  loadCalendarEvents,
  LoadCalendarEventsTriggerType,
  createCalendarEvent,
  createCalendarEventTriggerType,
  EventVisibility,
} from "~/actions/main-function/calendar";
import { StatusType } from "~/reducers/base/status";
import { useState } from "react";

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

// TODO turn in to a function component
/**
 * Guidance event component
 * @param props GuidanceEventProps
 */
const GuidanceEvent: React.FC<GuidanceEventProps> = (props) => {
  const {
    i18n,
    guider,
    calendar,
    // status,
    loadCalendarEvents,
    createCalendarEvent,
    children,
  } = props;
  const calendarRef = React.createRef<FullCalendar>(); // Reference to access the calendar
  const [locked, setLocked] = useState(true);

  //TODO: this could be a reusable effect that returns a start and end date
  /**
   * Handler for events loading
   */
  const handleCalendarEventsLoad = () => {
    const calendarApi = calendarRef.current // If the calendar is not available, this will be null
      ? calendarRef.current.getApi()
      : null;
    const startDate = calendarApi // If the calendarApi is not available, date will be now
      ? moment(calendarApi.view.currentStart).format()
      : moment().format();
    const endDate = calendarApi // If the calendarApi is not available, date will be now
      ? moment(calendarApi.view.currentEnd).format()
      : moment().format();
    //TODO: There will be different types of events so a typecheck will be needed here
    /**Only loads if there are no events in the state or the load is forced*/
    // if (this.props.calendar.events.length === 0 || forceLoad) {
    loadCalendarEvents(
      guider.currentStudent.basic.userEntityId,
      startDate,
      endDate,
      "guidance"
    );
  };

  /**
   * Clears the event from the state
   * @param args Arguments of the event that has been clicked
   */
  const handleEventClick = (args: EventClickArg) => {
    if (!args.el.classList.contains("fc-bg-event")) {
      const event = calendarRef.current.getApi().getEventById(args.event.id);
      event.remove();
      setLocked(true);
    }
  };

  /**
   * Handles the selection of a state in the calendar
   * @param args Arguments of selected date from the fullCalendar
   */
  const handleDateSelect = (args: DateSelectArg) => {
    const newEvent = {
      id: "new-event",
      title: "Ohjauskeskustelu",
      description:
        "Ohjausaika opiskelijalle:" +
        getName(guider.currentStudent.basic, true),
      start: args.startStr,
      classNames: ["env-dialog__guidance-event"],
      overlap: false,
      end: args.endStr,
    };
    calendarRef.current.getApi().addEvent(newEvent);
    setLocked(false);
  };

  /**
   * Saves the event and runs the thunk functions and such
   * @param closeDialog close function for the dialog
   */
  const handleSaveEvent = (closeDialog: () => void) => {
    const event = calendarRef.current.getApi().getEventById("new-event");

    const payload = {
      title: event.title,
      description: event.extendedProps.description,
      start: event.startStr,
      end: event.endStr,
      visibility: "PUBLIC" as EventVisibility,
      type: "guidance",
      participants: [
        {
          userEntityId: guider.currentStudent.basic.userEntityId,
        },
      ],
    };
    createCalendarEvent(payload); // Create a new event
    setLocked(true);
    closeDialog(); // Close the dialog
  };

  /**
   * Changes the week
   * @param direction direction of the change
   */
  const handleWeekChange = (direction: "next" | "last") => {
    const calendarApi = calendarRef.current.getApi();
    if (direction === "next") {
      calendarApi.next();
    } else {
      calendarApi.prev();
    }
    handleCalendarEventsLoad();
  };

  /**
   *Handles dialog close
   * @param closeDialog prop drilling close function
   */
  const handleDialogClose = (closeDialog: () => void) => {
    clearState();
    closeDialog();
  };
  /**
   * Clears component state
   */
  const clearState = () => {
    setLocked(true);
  };

  /** Turns the state events to background events*/
  const events = calendar.guidanceEvents.map((event) => ({
    title: event.title,
    start: event.start,
    end: event.end,
    display: "background",
  }));

  /**
   * Dialog content
   * @returns JSX.Element fullcalendar component
   */
  const content = () => (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        select={handleDateSelect}
        editable={true}
        selectable={true}
        events={events}
        allDaySlot={false}
        eventClick={handleEventClick}
        buttonIcons={{
          prevWeek: "chevron-left",
          nextWeek: "chevron-right",
        }}
        customButtons={{
          nextWeek: {
            click: () => handleWeekChange("next"),
          },
          prevWeek: {
            click: () => handleWeekChange("last"),
          },
        }}
        headerToolbar={{
          left: "title",
          right: "today prevWeek,nextWeek",
        }}
        selectOverlap={false}
        locale={"fi"}
        slotMinTime={"09:00:00"}
        slotMaxTime={"16:00:00"}
        slotDuration={"00:15:00"}
        height={"auto"}
        weekends={false}
        firstDay={1}
      />
    </>
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
        onClick={() => handleSaveEvent(closeDialog)}
        disabled={locked}
      >
        {i18n.text.get("plugin.guider.user.addGuidanceEvent.button.save")}
      </Button>
      <Button
        buttonModifiers="dialog-cancel"
        onClick={() => handleDialogClose(closeDialog)}
      >
        {i18n.text.get("plugin.guider.user.addGuidanceEvent.button.cancel")}
      </Button>
    </div>
  );

  return (
    <EnvironmentDialog
      executeOnOpen={handleCalendarEventsLoad}
      modifier="guidance-event"
      title={i18n.text.get(
        "plugin.guider.user.actions.reserveGuidanceTime.title"
      )}
      content={content}
      footer={footer}
    >
      {children}
    </EnvironmentDialog>
  );
};

/**
 * Takes the app state and maps it into component props
 * @param state application state
 * @returns object
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
 * @param dispatch action dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      loadCalendarEvents,
      createCalendarEvent,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(GuidanceEvent);
