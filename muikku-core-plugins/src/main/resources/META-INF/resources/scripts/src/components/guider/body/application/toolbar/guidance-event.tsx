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
import { EventInput } from "@fullcalendar/common"

interface GuidanceEventProps {
  i18n: i18nType,
  guider: GuiderType
  children: React.ReactElement<any>;
}

interface GuidanceEventState {
  newEvents: EventInput[],
  backgroundEvents: EventInput[],
}

class GuidanceEvent extends React.Component<GuidanceEventProps, GuidanceEventState> {
  constructor(props: GuidanceEventProps) {
    super(props);

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
    const footer = (closeDialog: () => any) => <div>Niii</div>;

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
