import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { ProfileType } from "~/reducers/main-function/profile";
import ProfilePicture from "./components/profile-picture";
import ProfileProperty from "./components/profile-property";
import moment from '~/lib/moment';

interface GeneralInformationProps {
  i18n: i18nType,
  profile: ProfileType;
  status: StatusType;
}

interface GeneralInformationState {
  profileVacationStart: any;
  profileVacationEnd: any;
  phoneNumber: string,
  chatVisibility: string,
  chatNickname: string,
  vacationAutoReply: string,
  vacationAutoReplySubject: string,
  vacationAutoReplyMsg: string,
}

class GeneralInformation extends React.Component<GeneralInformationProps, GeneralInformationState> {
  constructor(props: GeneralInformationProps) {
    super(props);
  }

  public render() {
    if (!this.props.profile || !this.props.status.profile) {
      return null;
    }
    if (this.props.profile.location !== "general") {
      return null;
    }

    const studyTimeEndValues = [];
    if (this.props.status.profile.studyTimeEnd){
      studyTimeEndValues.push(this.props.i18n.time.format(moment(this.props.status.profile.studyTimeEnd, "ddd MMM DD hh:mm:ss [EET] YYYY", "en").toDate()));
      if (this.props.status.profile.studyTimeLeftStr){
        studyTimeEndValues.push(this.props.status.profile.studyTimeLeftStr);
      }
    }

    return (
      <section>
        <form>
          <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.generalInformation')}</h2>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body">
              <ProfilePicture />
              <ProfileProperty modifier="study-start-date" i18n={this.props.i18n} condition={!!this.props.status.profile.studyStartDate} label="plugin.profile.studyStartDateLabel"
                value={this.props.i18n.time.format(moment(this.props.status.profile.studyStartDate, "ddd MMM DD hh:mm:ss [EET] YYYY", "en").toDate())} />
              <ProfileProperty modifier="study-end-date"i18n={this.props.i18n} condition={!!this.props.status.profile.studyTimeEnd} label="plugin.profile.studyTimeEndLabel"
                value={studyTimeEndValues} />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    profile: state.profile,
    status: state.status,
  }
};

function mapDispatchToProps(dispatch: React.Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneralInformation);
