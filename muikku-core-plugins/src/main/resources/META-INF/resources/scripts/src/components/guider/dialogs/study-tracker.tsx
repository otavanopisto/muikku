import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Dialog, { DialogRow } from '~/components/general/dialog';
import { AnyActionType } from '~/actions';
import notificationActions from '~/actions/base/notifications';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import { StatusType } from '~/reducers/base/status';
import { bindActionCreators } from 'redux';
import { FormActionsElement } from '~/components/general/form-element';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin, { DateClickArg, Draggable } from '@fullcalendar/interaction';
import "./study-tracker.scss"
import moment from '~/lib/moment';
import { GuiderStudentListType } from "~/reducers/main-function/guider";
import title from '~/reducers/base/title';

interface EventType {
  date?: string,
  title?: string,
  start?: string,
  end?: string,
  display?: "auto" | "background",
  backgroundColor?: string,
  resourceId?: string,
}

interface ResourceType {
  id: string,
  title?: string,
  student?: string
}

interface calendarColumnType {
  field: string,
  headerContent: string,
}


interface guiderReservationCalendarProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  status: StatusType,
  students: GuiderStudentListType,
}

interface guiderReservationCalendarState {
  events: EventType[],
  resourceAreaColumns: calendarColumnType[],
  dateClickArgs: DateClickArg,
  showOverlay: boolean,
  title: string
}

class StudyTracker extends React.Component<guiderReservationCalendarProps, guiderReservationCalendarState> {

  constructor(props: guiderReservationCalendarProps) {
    super(props);

    this.state = {
      dateClickArgs: null,
      showOverlay: false,
      title: "",
      resourceAreaColumns: [
        {
          field: "student",
          headerContent: "Opiskelija"
        }
      ],
      events: [
        {
          start: moment().weekday(0).toDate(),
          end: moment().toDate(),
          display: "background",
          backgroundColor: "#cccccc",
          title: "Kurssi"
        },
        {
          start: moment().weekday(0).toDate(),
          end: moment().add(10, "d").toDate(),
          resourceId: "PYRAMUS-STUDENT-23",
          title: "Kurssi"
        },
        {
          start: moment().weekday(0).toDate(),
          end: moment().add(30, "d").toDate(),
          resourceId: "PYRAMUS-STUDENT-45",
          title: "Kurssi"
        },
        {
          start: moment().weekday(0).toDate(),
          end: moment().add(3, "d").toDate(),
          resourceId: "PYRAMUS-STUDENT-72",
          title: "Kurssi"
        },
      ],
    }
  }

  cancelDialog(closeDialog: () => any) {
    closeDialog();
  }

  turnUsersToResources = (users: GuiderStudentListType) => {
    const resources: ResourceType[] = [];
    users.map((user) => {
      resources.push({ id: user.id, student: user.firstName + " " + user.lastName, });
    });

    return resources.slice(0, 10);
  }

  handleAddEvent = () => {
    if (this.state.title) {
      const currentEvents = this.state.events;
      let newEvents = currentEvents.concat({ title: this.state.title, date: this.state.dateClickArgs.dateStr });
      this.setState({ events: newEvents, showOverlay: false, title: "" });

    }
  }

  handleDateClick = (arg: DateClickArg) => {
    this.setState({ showOverlay: true, dateClickArgs: arg });
  }

  closeOverlay = () => {
    this.setState({ showOverlay: false, title: "" });
  }

  handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ title: e.currentTarget.value })
  }

  render() {
    let content = (closePortal: () => any) =>
      <div>
        <DialogRow modifiers="guider-reservation">

          <FullCalendar
            plugins={[resourceTimelinePlugin, interactionPlugin]}
            editable={true}
            weekends={false}
            schedulerLicenseKey={"CC-Attribution-NonCommercial-NoDerivatives"}
            height="auto"
            firstDay={1}
            resourceAreaColumns={this.state.resourceAreaColumns}
            resources={this.turnUsersToResources(this.props.students)}
            allDaySlot={false}
            slotMinTime="09:00:00"
            slotMaxTime="16:00:00"
            locale={"fi"}
            initialView="resourceTimelineWeek"
            events={this.state.events} />
          <div className={`overlay ${this.state.showOverlay ? "" : "hidden"}`} >
            <div>
              <span>{this.state.dateClickArgs && this.state.dateClickArgs.dateStr}</span>
            </div>
            <input type="text" onChange={this.handleTitleChange} value={this.state.title} />
            <button onClick={this.handleAddEvent.bind(this)} >Add</button>
            <button onClick={this.closeOverlay}>Close</button>
          </div>
        </DialogRow>
      </div>;

    let footer = (closePortal: () => any) => <FormActionsElement locked={false} executeLabel={this.props.i18n.text.get('plugin.organization.users.addUser.execute')} cancelLabel={this.props.i18n.text.get('plugin.organization.users.addUser.cancel')} executeClick={this.cancelDialog.bind(this, closePortal)}
      cancelClick={this.cancelDialog.bind(this, closePortal)} />;

    return (<Dialog modifier="guider-reservation"
      title={"Seuraa opiskelijoita"}
      content={content} footer={footer}>
      {this.props.children}
    </Dialog  >
    )
  }
}


interface addEventOverlayProps {
  arg: DateClickArg,
  showOverlay: boolean,
  addEvent: (title: string, date: string) => void,
  toggleOverlay: (hidden: boolean) => void,
}

interface addEventOverlayState {
  title: string,
}


function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudyTracker);
