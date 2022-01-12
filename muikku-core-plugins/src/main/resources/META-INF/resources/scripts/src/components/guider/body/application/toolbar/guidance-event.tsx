import * as React from "react";
import EnvironmentDialog from '~/components/general/environment-dialog';
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import '~/sass/elements/link.scss';
import { bindActionCreators } from "redux";
import { StateType } from '~/reducers';
import { GuiderType, GuiderStudentType } from "~/reducers/main-function/guider";
import FullCalendar, { DateSelectArg, EventClickArg } from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { EventResizeStopArg } from '@fullcalendar/interaction'
import Button from '~/components/general/button';
import { getName } from '~/util/modifiers';
import moment from "~/lib/moment";

export interface EventType {
  id?: string,
  title?: string,
  start?: string,
  overlap?: boolean,
  end?: string,
  classNames?: string[],
  description?: string,
  display?: "auto" | "background",
  backgroundColor?: string,
  resourceId?: string,
}

interface GuidanceEventProps {
  i18n: i18nType,
  guider: GuiderType
  children: React.ReactElement<any>;
}

interface GuidanceEventState {
  newEvents: EventType[],
  backgroundEvents: EventType[],
  locked: boolean,
}

class GuidanceEvent extends React.Component<GuidanceEventProps, GuidanceEventState> {

  private calendarRef = React.createRef<FullCalendar>();
  constructor(props: GuidanceEventProps) {
    super(props);

    this.state = {
      newEvents: [],
      backgroundEvents: [{
        start: moment().day(0).toDate(),
        end: moment().toDate(),
        display: "background",
        backgroundColor: "#cccccc"
      },
      {
        start: moment().day(4).toDate(),
        end: moment().day(5).toDate(),
        display: "background",
        backgroundColor: "#1db599"
      }],
      locked: true,
    }
  }

  handleEventClick = (eventClickInfo: EventClickArg) => {
    const currentEvents = this.state.newEvents;
    const newEvents = currentEvents.filter(event => event.id !== eventClickInfo.event.id);
    const locked = newEvents.length === 0;
    this.setState({ newEvents: newEvents, locked: locked });
  }

  saveEvents = (closeDialog: () => void) => {
    console.log(this.state.newEvents);
    closeDialog();
  }

  handleDateSelect = (arg: DateSelectArg) => {
    const currentEvents = this.state.newEvents;
    let newEvents = currentEvents.concat({
      title: getName(this.props.guider.currentStudent.basic, true),
      description: "Ohjaussaika opiskelijalle",
      start: arg.startStr,
      classNames: ["env-dialog__guidance-event"],
      overlap: false,
      end: arg.endStr,
      id: this.props.guider.currentStudent.basic.id + arg.start.getTime().toString()
    });
    this.setState({ newEvents: newEvents, locked: false });
  }

  render() {
    const content = () => <FullCalendar
      ref={this.calendarRef}
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      select={this.handleDateSelect}
      selectable={true}
      events={[...this.state.newEvents, ...this.state.backgroundEvents]}
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
    />;
    const footer = (closeDialog: () => void) => (
      <div className="env-dialog__actions env-dialog__actions--guidance-event">
        <Button
          buttonModifiers="dialog-execute"
          onClick={() => { this.saveEvents.bind(closeDialog()) }}
          disabled={this.state.locked} >
          {this.props.i18n.text.get('plugin.guider.user.addGuidanceEvent.button.save')}
        </Button>
        <Button buttonModifiers="dialog-cancel"
          onClick={closeDialog}
        >
          {this.props.i18n.text.get('plugin.guider.user.addGuidanceEvent.button.cancel')}
        </Button>
      </div>
    );

    return <EnvironmentDialog modifier="guidance-event"
      title={this.props.i18n.text.get('plugin.guider.user.actions.reserveGuidanceTime.title')}
      content={content} footer={footer}
    >
      {this.props.children}
    </EnvironmentDialog>;
  }

}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuidanceEvent);
