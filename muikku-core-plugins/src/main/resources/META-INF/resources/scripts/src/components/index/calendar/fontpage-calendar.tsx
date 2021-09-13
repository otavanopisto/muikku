import * as  React from 'react';
import { sliceEvents, createPlugin, ViewProps, DateProfile, Duration } from '@fullcalendar/react';
import "./frontpage-calendar.scss";

interface FrontPageCalendarViewProps extends ViewProps {
  dateProfile: DateProfile;
  nextDayThreshold: Duration;
}

class FrontPageCalendarView extends React.Component<FrontPageCalendarViewProps, {}>  {

  constructor(props: FrontPageCalendarViewProps) {
    super(props)
  }

  render() {
    let segs = sliceEvents(this.props, true); // allDay=true

    return <div className="frontpage-calendar">
      <div className='frontpage-calendar__title'>
        {this.props.dateProfile.currentRange.start.toUTCString()}
      </div>
      <div className="frontpage-calendar__content">
        <div className="frontpage-calendar__events" >{segs.map((seg) => (
          <div key={seg.def.publicId} className="frontpage-calendar__event">{seg.def.title}</div>
        ))}</div>
        <div className="frontpage-calendar__event-count">{segs.length} tapahtumaa</div>
      </div>
    </div>
  };
}

// class CustomView extends React.Component {
//   render() {
//     let segs = sliceEvents(props, true); // allDay=true
//     return (
//       <div>
//         <div className='view-title'>
//           {props.dateProfile.currentRange.start.toUTCString()}
//         </div>
//         <div className='view-events'>
//           {segs.length} events
//         </div>
//       </div>
//     );
//   }
// }

export default createPlugin({
  views: {
    custom: FrontPageCalendarView
  }
});