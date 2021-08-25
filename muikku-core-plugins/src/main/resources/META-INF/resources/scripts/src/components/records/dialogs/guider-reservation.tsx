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
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';


interface eventType {
  date: string,
  title: string,
}

interface dateClick {
  date: Date,
  dateStr: string,
  allDay: boolean,
  dayEl: HTMLElement,
  jsEvent: Event,
  view: any,
  resource: any,
}

interface guiderReservationCalendarProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  status: StatusType,
}

interface guiderReservationCalendarState {
  events: eventType[]
}

class GuiderReservationDialog extends React.Component<guiderReservationCalendarProps, guiderReservationCalendarState> {

  constructor(props: guiderReservationCalendarProps) {
    super(props);
  }

  cancelDialog(closeDialog: () => any) {
    closeDialog();
  }

  handleDateClick = (arg: DateClickArg) => {
    alert(arg);
  }

  render() {
    let content = (closePortal: () => any) =>
      <div>
        <DialogRow modifiers="guider-reservation">
          <FullCalendar dateClick={this.handleDateClick} plugins={[timeGridPlugin]}
            initialView="timeGridWeek" />
        </DialogRow>
      </div>;

    let footer = (closePortal: () => any) => <FormActionsElement locked={false} executeLabel={this.props.i18n.text.get('plugin.organization.users.addUser.execute')} cancelLabel={this.props.i18n.text.get('plugin.organization.users.addUser.cancel')} executeClick={this.cancelDialog.bind(this, closePortal)}
      cancelClick={this.cancelDialog.bind(this, closePortal)} />;

    return (<Dialog modifier="guider-reservation"
      title={this.props.i18n.text.get('plugin.organization.users.addUser.title')}
      content={content} footer={footer}>
      {this.props.children}
    </Dialog  >
    )
  }
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
