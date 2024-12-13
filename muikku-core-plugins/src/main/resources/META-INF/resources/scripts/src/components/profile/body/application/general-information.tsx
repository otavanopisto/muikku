import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { localize } from "~/locales/i18n";
import { StatusType } from "~/reducers/base/status";
import { ProfileState } from "~/reducers/main-function/profile";
import ProfilePicture from "./components/profile-picture";
import ProfileProperty from "./components/profile-property";

/**
 * GeneralInformationProps
 */
interface GeneralInformationProps extends WithTranslation {
  profile: ProfileState;
  status: StatusType;
}

/**
 * GeneralInformationState
 */
interface GeneralInformationState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profileVacationStart: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        localize.date(this.props.status.profile.studyTimeEnd)
      );
      if (this.props.status.profile.studyTimeLeftStr) {
        studyTimeEndValues.push(this.props.status.profile.studyTimeLeftStr);
      }
    }

    return (
      <section>
        <form className="form">
          <h2 className="application-panel__content-header">
            {this.props.t("labels.generalInfo", { ns: "profile" })}
          </h2>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body">
              <div className="application-sub-panel__item  application-sub-panel__item--profile">
                <div className="form__row">
                  <ProfilePicture />
                </div>
              </div>

              <ProfileProperty
                modifier="study-start-date"
                condition={!!this.props.status.profile.studyStartDate}
                label={this.props.t("labels.studyStartDate", { ns: "users" })}
                value={localize.date(this.props.status.profile.studyStartDate)}
              />
              <ProfileProperty
                modifier="study-end-date"
                condition={!!this.props.status.profile.studyTimeEnd}
                label={this.props.t("labels.studyEndDate", { ns: "users" })}
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

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(GeneralInformation)
);
