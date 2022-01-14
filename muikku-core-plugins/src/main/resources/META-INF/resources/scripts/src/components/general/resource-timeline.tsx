import * as React from 'react';
import { useEffect, useState } from 'react';
import FullCalendar, { DateSelectArg, EventClickArg } from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin, { Draggable, EventResizeStopArg } from '@fullcalendar/interaction'
import { EventType } from "../guider/body/application/toolbar/guidance-event"



export type ExternalEventType = {
  title: string,
  id: string,
  color?: string,
  duration: string,
}

export type HeaderToolbarType = {
  left: string,
  center: string,
  right: string,
}

export type ResourceType = {
  id: string,
  title: string,
}

interface ResourceTimelineProps {
  headerToolbar?: HeaderToolbarType,
  resourceHeaderContent: string,
  resources: ResourceType[],
  externalEvents?: ExternalEventType[],
  namespace: string,
  onDateSelect: (events: EventType[]) => void;
}

interface ResourceTimelineState {
  newEvents: EventType[];
}


export const ResourceTimeline: React.FC<ResourceTimelineProps> = ({
  headerToolbar,
  resourceHeaderContent,
  resources,
  externalEvents,
  namespace,
  onDateSelect,
}) => {

  const [events, setEvents] = useState<EventType[]>([]);

  const handleDateSelect = (arg: DateSelectArg) => {
    const currentEvents = events;
    const newEvents: EventType[] = currentEvents.concat({
      title: arg.resource._resource.title,
      description: "Ohjaussaika opiskelijalle",
      start: arg.startStr,
      classNames: ["env-dialog__guidance-event"],
      overlap: false,
      end: arg.endStr,
      id: arg.resource._resource.title + arg.startStr,
      resourceId: arg.resource._resource.id
    });
    setEvents(newEvents);
    onDateSelect(newEvents);
  }


  useEffect(() => {
    let draggableElement = document.getElementById(`external-events--${namespace}`);

    new Draggable(draggableElement, {
      itemSelector: ".draggable-event",
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
          create: true
        }
      }

    });

  }, []);

  const externalEventsElements = externalEvents && externalEvents.map((event) => (
    <div
      className='draggable-event fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'
      title={event.title}
      data-id={event.id}
      data-color={event.color}
      data-duration={event.duration}
      key={event.id}
      style={{
        backgroundColor: event.color,
        cursor: "pointer",
        width: 100,
        height: 20,

      }}
    >{event.title}
    </div>
  ));

  const test = events;

  return (
    <>
      <div id={`external-events--${namespace}`}>
        {externalEventsElements}
      </div>
      <div>
        <FullCalendar
          headerToolbar={headerToolbar}
          selectable={true}
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          editable={true}
          schedulerLicenseKey={"CC-Attribution-NonCommercial-NoDerivatives"}
          height="auto"
          select={handleDateSelect}
          firstDay={1}
          resourceAreaHeaderContent={resourceHeaderContent}
          resourceAreaWidth={200}
          resources={resources}
          // slotMinTime="09:00:00"
          // slotMaxTime="16:00:00"
          locale={"fi"}
          initialView="resourceTimelineMonth"
          events={events}
        />
      </div>
    </>
  )

}