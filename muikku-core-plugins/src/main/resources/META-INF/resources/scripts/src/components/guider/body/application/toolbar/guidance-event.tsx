import * as React from "react";
import EnvironmentDialog from '~/components/general/environment-dialog';
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import '~/sass/elements/link.scss';
import { bindActionCreators } from "redux";
import { StateType } from '~/reducers';
import { GuiderType, GuiderStudentType } from "~/reducers/main-function/guider";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import Button from '~/components/general/button';

interface EventType {
  date?: string,
  title?: string,
  start?: string,
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

  handleAddEvent = () => {
    const title = prompt("Uusi tapahtuma");
    let calendarApi = this.calendarRef.current.getApi();

    calendarApi.unselect()

    if (title) {
      calendarApi.addEvent({
        id: Date.now().toString(),
        title,
        start: new Date(),
        allDay: true
      })
    }
  }


  render() {
    const content = () => <FullCalendar
      plugins={[timeGridPlugin]}
      initialView="timeGridWeek"
      allDaySlot={false}
      locale={"fi"}
      slotMinTime={"09:00:00"}
      slotMaxTime={"16:00:00"}
      slotDuration={"01:00:00"}
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
