import * as React from "react";
import EnvironmentDialog from '~/components/general/environment-dialog';
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import '~/sass/elements/link.scss';
import { bindActionCreators } from "redux";
import { StateType } from '~/reducers';
import { GuiderType, GuiderStudentType } from "~/reducers/main-function/guider";
import FullCalendar, { DateSelectArg } from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { EventResizeStopArg } from '@fullcalendar/interaction'
import Button from '~/components/general/button';
import { getName } from '~/util/modifiers';
import moment from "~/lib/moment";

interface EventType {
  date?: string,
  id?: string,
  title?: string,
  start?: string,
  overlap?: boolean,
  end?: string,
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
      backgroundEvents: [],
      locked: false,
    }
  }

  handleDateSelect = (arg: DateSelectArg) => {
    const currentEvents = this.state.newEvents;

    if (!moment(arg.start).isBefore()) {
      let newEvents = currentEvents.concat({
        title: getName(this.props.guider.currentStudent.basic, true),
        start: arg.startStr,
        overlap: false,
        end: arg.endStr,
        id: this.props.guider.currentStudent.basic.id + arg.start.getTime().toString()
      });
      this.setState({ newEvents: newEvents });
    }
  }

  render() {
    const content = () => <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      select={this.handleDateSelect}
      selectable={true}
      events={this.state.newEvents}
      allDaySlot={false}
      selectOverlap={false}
      locale={"fi"}
      slotMinTime={"09:00:00"}
      slotMaxTime={"16:00:00"}
      slotDuration={"00:30:00"}
      height={"auto"}
      weekends={false}
      firstDay={1}
    />;
    const footer = (closeDialog: () => any) => (
      <div className="env-dialog__actions env-dialog__actions--guidance-event">
        <Button
          buttonModifiers="dialog-execute"
          onClick={() => alert("Muu")}
          disabled={this.state.locked} >
          {this.props.i18n.text.get('plugin.guider.user.addGuidanceEvent.button.save')}
        </Button>
        <Button buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}>
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
