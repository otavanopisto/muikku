import * as React from "react";
import { useEffect, useState } from "react";
import FullCalendar, { DateSelectArg } from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { CalendarEvent } from "~/reducers/main-function/calendar";
import "../../sass/elements/resource-timeline.scss";

/**
 * A type for external draggable events
 */
export type ExternalEventType = {
  title: string;
  id: number;
  color?: string;
  duration: string;
};

/**
 * Calendar header toolbar
 */
export type HeaderToolbarType = {
  left: string;
  center: string;
  right: string;
};

/**
 * Calendar resource type
 */
export type ResourceType = {
  id: string;
  title: string;
};

/**
 * ResourceTimelineProps
 */
interface ResourceTimelineProps {
  headerToolbar?: HeaderToolbarType;
  resourceHeaderContent: string;
  resources: ResourceType[];
  externalEvents?: ExternalEventType[];
  selectable?: boolean;
  namespace: string;
  onDateSelect: (events: CalendarEvent[]) => void;
}

/**
 * ResourceTimeline
 *
 * @param props ResourceTimelineProps
 * @returns JSX.Element
 */
export const ResourceTimeline: React.FC<ResourceTimelineProps> = (props) => {
  const {
    headerToolbar,
    resourceHeaderContent,
    resources,
    externalEvents,
    selectable = false,
    namespace,
    onDateSelect,
  } = props;

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const draggableElement = document.getElementById(
      `externalEvents${namespace}`
    );

    new Draggable(draggableElement, {
      itemSelector: ".resource-timeline__draggable-event",
      /**
       * eventData
       * @param element
       * @returns a draggable element
       */
      eventData: function (element) {
        const id = element.dataset.id;
        const title = element.getAttribute("title");
        const color = element.dataset.color;
        const duration = element.dataset.duration;

        return {
          id: id,
          title: title,
          color: color,
          duration: duration,
          create: true,
        };
      },
    });
  }, []);

  /**
   * handleDateSelect handles date a date select in calendar
   * @param arg agument passed from the calendar
   */
  const handleDateSelect = (arg: DateSelectArg) => {
    const currentEvents = events;
    const newEvents: CalendarEvent[] = currentEvents.concat({
      title: arg.resource._resource.title,
      description: "Ohjaussaika opiskelijalle",
      start: arg.startStr,
      classNames: ["env-dialog__guidance-event"],
      overlap: false,
      end: arg.endStr,
      resourceId: arg.resource._resource.id,
    });
    setEvents(newEvents);
    onDateSelect(newEvents);
  };

  const externalEventsElements =
    externalEvents &&
    externalEvents.map((event) => (
      <div
        className="resource-timeline__draggable-event"
        title={event.title}
        data-id={event.id}
        data-color={event.color}
        data-duration={"48:00:00"}
        key={event.id}
        style={{
          backgroundColor: event.color,
          cursor: "pointer",
        }}
      >
        {event.title}
      </div>
    ));

  return (
    <div className="resource-timeline">
      <div
        className="resource-timeline__external-events"
        id={`externalEvents${namespace}`}
      >
        {externalEventsElements}
      </div>
      <div className="resource-timeline__timeline">
        <FullCalendar
          headerToolbar={headerToolbar}
          selectable={selectable}
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          droppable={true}
          drop={function (element) {
            element.draggedEl.parentElement.removeChild;
          }}
          editable={true}
          forceEventDuration={true}
          schedulerLicenseKey={"CC-Attribution-NonCommercial-NoDerivatives"}
          height="auto"
          select={handleDateSelect}
          firstDay={1}
          resourceAreaHeaderContent={resourceHeaderContent}
          resourceAreaWidth={200}
          resources={resources}
          locale={"fi"}
          initialView="resourceTimelineMonth"
          // events={events}
        />
      </div>
    </div>
  );
};
