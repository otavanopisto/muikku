import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StatusType } from "~/reducers/base/status";
import { ProfileType } from "~/reducers/main-function/profile";
import ProfilePicture from "./components/profile-picture";
import ProfileProperty from "./components/profile-property";

/**
 * GeneralInformationProps
 */
interface GeneralInformationProps {
  i18nOLD: i18nType;
  profile: ProfileType;
  status: StatusType;
}

/**
 * GeneralInformationState
 */
interface GeneralInformationState {
  profileVacationStart: any;
  profileVacationEnd: any;
  phoneNumber: string;
  chatVisibility: string;
  chatNickname: string;
  vacationAutoReply: string;
  vacationAutoReplySubject: string;
  vacationAutoReplyMsg: string;
}

/**
 * GeneralInformation
 */
class GeneralInformation extends React.Component<
  GeneralInformationProps,
  GeneralInformationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: GeneralInformationProps) {
    super(props);
  }

  /**
   * render
   */
  public render() {
    if (!this.props.profile || !this.props.status.profile) {
      return null;
    }
    if (this.props.profile.location !== "general") {
      return null;
    }

    const studyTimeEndValues = [];
    if (this.props.status.profile.studyTimeEnd) {
      studyTimeEndValues.push(
        this.props.i18nOLD.time.format(this.props.status.profile.studyTimeEnd)
      );
      if (this.props.status.profile.studyTimeLeftStr) {
        studyTimeEndValues.push(this.props.status.profile.studyTimeLeftStr);
      }
    }

    return (
      <section>
        <form className="form">
          <h2 className="application-panel__content-header">
            {this.props.i18nOLD.text.get(
              "plugin.profile.titles.generalInformation"
            )}
          </h2>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body">
              <div className="form__row">
                <ProfilePicture />
              </div>

              <ProfileProperty
                modifier="study-start-date"
                i18nOLD={this.props.i18nOLD}
                condition={!!this.props.status.profile.studyStartDate}
                label="plugin.profile.studyStartDateLabel"
                value={this.props.i18nOLD.time.format(
                  this.props.status.profile.studyStartDate
                )}
              />
              <ProfileProperty
                modifier="study-end-date"
                i18nOLD={this.props.i18nOLD}
                condition={!!this.props.status.profile.studyTimeEnd}
                label="plugin.profile.studyTimeEndLabel"
                value={studyTimeEndValues}
              />
            </div>
          </div>
        </form>
      </section>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
    profile: state.profile,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInformation);
