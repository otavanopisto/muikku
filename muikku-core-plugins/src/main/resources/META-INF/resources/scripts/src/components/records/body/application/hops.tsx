import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/form.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/message.scss';
import { RecordsType } from '~/reducers/main-function/records';
import HopsGraph from '~/components/base/hops_editable';
import { SetHopsToTriggerType, setHopsTo } from "~/actions/main-function/hops";
import { bindActionCreators } from "redux";
import { HOPSDataType } from '~/reducers/main-function/hops';
import { StateType } from '~/reducers';
import FullCalendar, { DateSelectArg, EventDropArg } from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { EventResizeStopArg } from '@fullcalendar/interaction';
import moment from '~/lib/moment';


interface HopsProps {
  i18n: i18nType,
  records: RecordsType,
  hops: any,
  setHopsTo: SetHopsToTriggerType
}

interface EventType {
  id?: string,
  date?: string,
  title?: string,
  start?: string,
  end?: string,
  display?: "auto" | "background",
  overlap?: boolean,
  backgroundColor?: string,
}

interface HopsState {
  events: EventType[],
  dateClickArgs: DateSelectArg,
  showOverlay: boolean,
  title: string,
  hoursPerWeek: number,
}

class Hops extends React.Component<HopsProps, HopsState> {
  timeout: NodeJS.Timer;
  constructor(props: HopsProps) {
    super(props);
    this.state = {
      dateClickArgs: null,
      showOverlay: false,
      title: "",
      events: [],
      hoursPerWeek: 0,
    }

    this.setHopsToWithDelay = this.setHopsToWithDelay.bind(this);
  }
  setHopsToWithDelay(hops: HOPSDataType) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.props.setHopsTo.bind(null, hops), 1000) as any;
  }
  handleDateSelect = (arg: DateSelectArg) => {
    const currentEvents = this.state.events;
    let newEvents = currentEvents.concat({ title: "Opiskelua", start: arg.startStr, overlap: false, end: arg.endStr, id: arg.start.getTime().toString() });
    this.setState({ events: newEvents }, () => this.setStudyTime(this.state.events));
  }

  setStudyTime = (events: EventType[]) => {
    let count: number = 0;
    events.map((event) => {
      const hours = moment.duration(moment(event.end).diff(event.start));
      count += hours.asHours();
    });
    this.setState({ hoursPerWeek: count });
  }

  refreshEventStateOnChange = (startStr: string, endStr: string, id: string, start: Date) => {
    const currentEvents = this.state.events.filter((event) => event.id !== id);
    const newEvents = currentEvents.concat({ title: "Opiskelua", overlap: false, start: startStr, end: endStr, id: start.getTime().toString() });
    this.setState({ events: newEvents }, () => { this.setStudyTime(this.state.events) });
  }

  onResizeStop = (arg: EventResizeStopArg) => {
    this.refreshEventStateOnChange(arg.event.startStr, arg.event.endStr, arg.event.id, arg.event.start);
  }

  onEventDrop = (arg: EventDropArg) => {
    this.refreshEventStateOnChange(arg.event.startStr, arg.event.endStr, arg.event.id, arg.event.start);
  }

  closeOverlay = () => {
    this.setState({ showOverlay: false, title: "" });
  }

  handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ title: e.currentTarget.value })
  }

  render() {
    if (this.props.records.location !== "hops" || (this.props.hops.eligibility && this.props.hops.eligibility.upperSecondarySchoolCurriculum == false)) {
      if (this.props.records.location === "hops") {
        return <div><FullCalendar
          select={this.handleDateSelect}
          plugins={[timeGridPlugin, interactionPlugin]}
          editable={true}
          height="auto"
          eventDrop={this.onEventDrop}
          eventResize={this.onResizeStop}
          selectable={true}
          firstDay={1}
          eventOverlap={false}
          allDaySlot={false}
          slotMinTime="09:00:00"
          slotMaxTime="22:00:00"
          locale={"fi"}
          initialView="timeGridWeek"
          events={this.state.events} />
          <div><h1>Opiskelen {this.state.hoursPerWeek} tuntia viikossa</h1></div>
        </div>
      }
      return null;
    } else if (this.props.hops.status === "ERROR") {
      // TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      // message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.hops.status !== "READY") {
      return null;
    }

    return (<section>
      <h2 className="application-panel__content-header">{this.props.i18n.text.get("plugin.records.hops.title")}</h2>
      <HopsGraph onHopsChange={this.setHopsToWithDelay} />
    </section>)
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: (state as any).records,
    hops: state.hops
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ setHopsTo }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hops);
