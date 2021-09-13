import * as React from 'react';
import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import { StateType } from '~/reducers';
import { connect, Dispatch } from 'react-redux';
import '~/sass/elements/panel.scss';
import FullCalendar from '@fullcalendar/react'
import FrontPageCalendar from '../calendar/fontpage-calendar'
import Button, { ButtonPill } from "../../general/button"

interface ImportantPanelProps {
  i18n: i18nType,
  status: StatusType,
}

//TODO not implemented yet
export class ImportantPanel extends React.Component<ImportantPanelProps, {}> {
  private calendarRef = React.createRef<FullCalendar>();

  handleDateChange = (dir: "next" | "prev") => {
    const calendarApi = this.calendarRef.current.getApi();

    if (dir === "next") {
      calendarApi.next();
    } else {
      calendarApi.prev();
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

  render(): any {
    return (<div className="panel panel--important">
      <div className="panel__header">
        <div className="panel__header-icon panel__header-icon--continue-studies icon-clock"></div>
        <h2 className="panel__header-title">Aikataulut</h2>
        <div style={{ display: "flex" }}>
          <ButtonPill buttonModifiers="toggle" onClick={this.handleDateChange.bind(null, "prev")}><span className="icon-arrow-left" /></ButtonPill>
          <ButtonPill buttonModifiers="toggle" onClick={this.handleDateChange.bind(null, "next")}><span className="icon-arrow-right" /></ButtonPill>
          <Button buttonModifiers="primary-function" onClick={this.handleAddEvent}>Lisää tapahtuma</Button>
        </div>
      </div>
      <div className="panel__body">
        <div></div>
        <FullCalendar
          ref={this.calendarRef}
          plugins={[FrontPageCalendar]}
          editable={true}
          headerToolbar={false}
          weekends={false}
          height="auto"
          firstDay={1}
          locale={"fi"}
          initialView="custom"
        // events={this.state.events}
        />
      </div>

    </div>);
  }
}

function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    i18n: state.i18n,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportantPanel);