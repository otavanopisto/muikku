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
import FullCalendar, { DateSelectArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import "./guider-reservation.scss"
import moment from '~/lib/moment';

interface EventType {
  date?: string,
  title?: string,
  start?: string,
  end?: string,
  display?: "auto" | "background",
  backgroundColor?: string,
}

interface guiderReservationCalendarProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  status: StatusType,
}

interface guiderReservationCalendarState {
  events: EventType[],
  dateClickArgs: DateClickArg,
  showOverlay: boolean,
  title: string
}

class GuiderReservationDialog extends React.Component<guiderReservationCalendarProps, guiderReservationCalendarState> {
  private test = moment().weekday(0).toDate()

  constructor(props: guiderReservationCalendarProps) {
    super(props);

    this.state = {
      dateClickArgs: null,
      showOverlay: false,
      title: "",
      events: [
        {
          start: moment().weekday(0).toDate(),
          end: moment().toDate(),
          display: "background",
          backgroundColor: "#cccccc"
        },
      ],
    }
  }

  cancelDialog(closeDialog: () => any) {
    closeDialog();
  }

  handleDateClick = (arg: DateClickArg) => {
    if (!moment(arg.dateStr).isBefore(moment())) {
      this.setState({ showOverlay: true, dateClickArgs: arg });
    }
  }

  handleAddEvent = () => {
    if (this.state.title) {
      const currentEvents = this.state.events;
      let newEvents = currentEvents.concat({ title: this.state.title, date: this.state.dateClickArgs.dateStr });
      this.setState({ events: newEvents, showOverlay: false, title: "" });

    }
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
            dateClick={this.handleDateClick}
            plugins={[timeGridPlugin, interactionPlugin]}
            editable={true}
            weekends={false}
            height="auto"
            firstDay={1}
            allDaySlot={false}
            slotMinTime="09:00:00"
            slotMaxTime="16:00:00"
            locale={"fi"}
            initialView="timeGridWeek"
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
      title={"Varaa aika ohjaajalle"}
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
)(GuiderReservationDialog);
