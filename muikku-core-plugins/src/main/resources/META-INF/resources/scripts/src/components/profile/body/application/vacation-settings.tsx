import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import DatePicker from "react-datepicker";
import "~/sass/elements/datepicker/datepicker.scss";
import { ProfileType } from "~/reducers/main-function/profile";
import {
  saveProfileProperty,
  SaveProfilePropertyTriggerType,
  updateProfileChatSettings,
  UpdateProfileChatSettingsTriggerType,
} from "~/actions/main-function/profile";
import { bindActionCreators } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import Button from "~/components/general/button";
import moment from "~/lib/moment";
import { SimpleActionExecutor } from "~/actions/executor";

/**
 * VacationSettingsProps
 */
interface VacationSettingsProps {
  i18n: i18nType;
  profile: ProfileType;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
  saveProfileProperty: SaveProfilePropertyTriggerType;
  updateProfileChatSettings: UpdateProfileChatSettingsTriggerType;
}

/**
 * VacationSettingsState
 */
interface VacationSettingsState {
  profileVacationStart: any;
  profileVacationEnd: any;
  vacationAutoReply: string;
  vacationAutoReplySubject: string;
  vacationAutoReplyMsg: string;
  locked: boolean;
}
/**
 * VacationSettings
 */
class VacationSettings extends React.Component<
  VacationSettingsProps,
  VacationSettingsState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: VacationSettingsProps) {
    super(props);

    this.state = {
      profileVacationStart:
        (props.profile.properties["profile-vacation-start"] &&
          moment(props.profile.properties["profile-vacation-start"])) ||
        null,
      profileVacationEnd:
        (props.profile.properties["profile-vacation-end"] &&
          moment(props.profile.properties["profile-vacation-end"])) ||
        null,
      vacationAutoReply:
        props.profile.properties["communicator-auto-reply"] || "",
      vacationAutoReplySubject:
        props.profile.properties["communicator-auto-reply-subject"] || "",
      vacationAutoReplyMsg:
        props.profile.properties["communicator-auto-reply-msg"] || "",
      locked: false,
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.onVacationAutoReplyChange = this.onVacationAutoReplyChange.bind(this);
    this.onVacationAutoReplySubjectChange =
      this.onVacationAutoReplySubjectChange.bind(this);
    this.onVacationAutoReplyMsgChange =
      this.onVacationAutoReplyMsgChange.bind(this);
    this.save = this.save.bind(this);
  }

  /**
   * componentWillReceiveProps
   * @param nextProps
   */
  componentWillReceiveProps(nextProps: VacationSettingsProps) {
    if (
      nextProps.profile.properties["profile-vacation-start"] &&
      this.props.profile.properties["profile-vacation-start"] !==
        nextProps.profile.properties["profile-vacation-start"]
    ) {
      this.setState({
        profileVacationStart: moment(
          nextProps.profile.properties["profile-vacation-start"]
        ),
      });
    }

    if (
      nextProps.profile.properties["profile-vacation-end"] &&
      this.props.profile.properties["profile-vacation-end"] !==
        nextProps.profile.properties["profile-vacation-end"]
    ) {
      this.setState({
        profileVacationEnd: moment(
          nextProps.profile.properties["profile-vacation-end"]
        ),
      });
    }

    if (
      nextProps.profile.properties["communicator-auto-reply"] &&
      this.props.profile.properties["communicator-auto-reply"] !==
        nextProps.profile.properties["communicator-auto-reply"]
    ) {
      this.setState({
        vacationAutoReply:
          nextProps.profile.properties["communicator-auto-reply"],
      });
    }

    if (
      nextProps.profile.properties["communicator-auto-reply-subject"] &&
      this.props.profile.properties["communicator-auto-reply-subject"] !==
        nextProps.profile.properties["communicator-auto-reply-subject"]
    ) {
      this.setState({
        vacationAutoReplySubject:
          nextProps.profile.properties["communicator-auto-reply-subject"],
      });
    }

    if (
      nextProps.profile.properties["communicator-auto-reply-msg"] &&
      this.props.profile.properties["communicator-auto-reply-msg"] !==
        nextProps.profile.properties["communicator-auto-reply-msg"]
    ) {
      this.setState({
        vacationAutoReplyMsg:
          nextProps.profile.properties["communicator-auto-reply-msg"],
      });
    }
  }

  /**
   * handleDateChange
   * @param stateLocation
   * @param newDate
   */
  handleDateChange(stateLocation: string, newDate: any) {
    const nState: any = {};
    nState[stateLocation] = newDate;
    (this.setState as any)(nState);
  }

  /**
   * onVacationAutoReplyChange
   * @param e
   */
  onVacationAutoReplyChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      vacationAutoReply: e.target.checked ? "ENABLED" : "",
    });
  }

  /**
   * onVacationAutoReplySubjectChange
   * @param e
   */
  onVacationAutoReplySubjectChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      vacationAutoReplySubject: e.target.value,
    });
  }

  /**
   * onVacationAutoReplyMsgChange
   * @param e
   */
  onVacationAutoReplyMsgChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      vacationAutoReplyMsg: e.target.value,
    });
  }

  /**
   * save
   */
  save() {
    this.setState({
      locked: true,
    });

    const executor = new SimpleActionExecutor();
    executor
      .addAction(
        !this.props.status.isStudent &&
          this.props.profile.properties["profile-vacation-start"] !==
            this.state.profileVacationStart,
        () => {
          this.props.saveProfileProperty({
            key: "profile-vacation-start",
            value: this.state.profileVacationStart
              ? this.state.profileVacationStart.toISOString()
              : null,
            success: executor.succeeded,
            fail: executor.failed,
          });
        }
      )
      .addAction(
        !this.props.status.isStudent &&
          this.props.profile.properties["profile-vacation-end"] !==
            this.state.profileVacationEnd,
        () => {
          this.props.saveProfileProperty({
            key: "profile-vacation-end",
            value: this.state.profileVacationEnd
              ? this.state.profileVacationEnd.toISOString()
              : null,
            success: executor.succeeded,
            fail: executor.failed,
          });
        }
      )
      .addAction(
        !this.props.status.isStudent &&
          (this.props.profile.properties["communicator-auto-reply"] || "") !==
            this.state.vacationAutoReply,
        () => {
          this.props.saveProfileProperty({
            key: "communicator-auto-reply",
            value: this.state.vacationAutoReply,
            success: executor.succeeded,
            fail: executor.failed,
          });
        }
      )
      .addAction(
        !this.props.status.isStudent &&
          (this.props.profile.properties["communicator-auto-reply-subject"] ||
            "") !== this.state.vacationAutoReplySubject,
        () => {
          this.props.saveProfileProperty({
            key: "communicator-auto-reply-subject",
            value: this.state.vacationAutoReplySubject,
            success: executor.succeeded,
            fail: executor.failed,
          });
        }
      )
      .addAction(
        !this.props.status.isStudent &&
          (this.props.profile.properties["communicator-auto-reply-msg"] ||
            "") !== this.state.vacationAutoReplyMsg,
        () => {
          this.props.saveProfileProperty({
            key: "communicator-auto-reply-msg",
            value: this.state.vacationAutoReplyMsg,
            success: executor.succeeded,
            fail: executor.failed,
          });
        }
      )
      .onAllSucceed(() => {
        this.props.displayNotification(
          this.props.i18n.text.get("plugin.profile.properties.saved"),
          "success"
        );

        this.setState({
          locked: false,
        });
      })
      .onOneFails(() => {
        this.props.displayNotification(
          this.props.i18n.text.get("plugin.profile.properties.failed"),
          "error"
        );

        this.setState({
          locked: false,
        });
      });
  }

  /**
   * render
   * @returns JSX.Element
   */
  public render() {
    if (this.props.profile.location !== "vacation") {
      return null;
    }

    return (
      <section>
        <form>
          <h2 className="application-panel__content-header">
            {this.props.i18n.text.get("plugin.profile.titles.vacationSettings")}
          </h2>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body">
              <div className="application-sub-panel__item application-sub-panel__item--profile">
                <label
                  htmlFor="profileVacationStart"
                  className="application-sub-panel__item-title"
                >
                  {this.props.i18n.text.get(
                    "plugin.profile.awayStartDate.label"
                  )}
                </label>
                <div className="application-sub-panel__item-data form-element">
                  <DatePicker
                    id="profileVacationStart"
                    className="form-element__input"
                    onChange={this.handleDateChange.bind(
                      this,
                      "profileVacationStart"
                    )}
                    maxDate={this.state.profileVacationEnd || null}
                    locale={this.props.i18n.time.getLocale()}
                    selected={this.state.profileVacationStart}
                  />
                </div>
              </div>

              <div className="application-sub-panel__item application-sub-panel__item--profile">
                <label
                  htmlFor="profileVacationStart"
                  className="application-sub-panel__item-title"
                >
                  {this.props.i18n.text.get("plugin.profile.awayEndDate.label")}
                </label>
                <div className="application-sub-panel__item-data form-element">
                  <DatePicker
                    id="profileVacationEnd"
                    className="form-element__input"
                    onChange={this.handleDateChange.bind(
                      this,
                      "profileVacationEnd"
                    )}
                    minDate={this.state.profileVacationStart || null}
                    locale={this.props.i18n.time.getLocale()}
                    selected={this.state.profileVacationEnd}
                  />
                </div>
              </div>

              <div
                className={`application-sub-panel__item application-sub-panel__item--profile ${
                  !this.state.profileVacationStart ||
                  !this.state.profileVacationEnd
                    ? "NON-ACTIVE"
                    : ""
                }`}
              >
                <div className="application-sub-panel__item-data form-element">
                  <div className="form-element__radio-option-container form-element__radio-option-container--profile">
                    <input
                      checked={
                        this.state.vacationAutoReply === "ENABLED"
                          ? true
                          : false
                      }
                      value={this.state.vacationAutoReply}
                      id="profileVacationAutoReply"
                      type="checkbox"
                      onChange={this.onVacationAutoReplyChange}
                    />
                    <label
                      htmlFor="profileVacationAutoReply"
                      className="application-sub-panel__item-label "
                    >
                      {this.props.i18n.text.get(
                        "plugin.profile.vacationAutoReply.label"
                      )}
                    </label>
                  </div>
                  <div className="application-sub-panel__item-description">
                    {this.props.i18n.text.get(
                      "plugin.profile.vacationAutoReply.description"
                    )}
                  </div>
                </div>
              </div>

              {this.state.vacationAutoReply === "ENABLED" && (
                <div
                  className={`application-sub-panel__item application-sub-panel__item--profile ${
                    !this.state.profileVacationStart ||
                    !this.state.profileVacationEnd
                      ? "NON-ACTIVE"
                      : ""
                  } form-element`}
                >
                  <label
                    htmlFor="profileVacationAutoReplySubject"
                    className="application-sub-panel__item-title"
                  >
                    {this.props.i18n.text.get(
                      "plugin.profile.vacationAutoReplySubject.label"
                    )}
                  </label>
                  <div className="application-sub-panel__item-data form-element">
                    <input
                      className="form-element__input form-element__input--profile-auto-reply"
                      id="profileVacationAutoReplySubject"
                      type="text"
                      onChange={this.onVacationAutoReplySubjectChange}
                      value={this.state.vacationAutoReplySubject}
                    ></input>
                  </div>
                </div>
              )}

              {this.state.vacationAutoReply === "ENABLED" && (
                <div
                  className={`application-sub-panel__item application-sub-panel__item--profile ${
                    !this.state.profileVacationStart ||
                    !this.state.profileVacationEnd
                      ? "NON-ACTIVE"
                      : ""
                  } form-element`}
                >
                  <label
                    htmlFor="profileVacationAutoReplyMsg"
                    className="application-sub-panel__item-title"
                  >
                    {this.props.i18n.text.get(
                      "plugin.profile.vacationAutoReplyMsg.label"
                    )}
                  </label>
                  <div className="application-sub-panel__item-data form-element">
                    <textarea
                      className="form-element__textarea form-element__textarea--profile-auto-reply"
                      id="profileVacationAutoReplyMsg"
                      onChange={this.onVacationAutoReplyMsgChange}
                      value={this.state.vacationAutoReplyMsg}
                    ></textarea>
                  </div>
                </div>
              )}

              <div className="application-sub-panel__item-actions">
                <Button
                  buttonModifiers="primary-function-save"
                  onClick={this.save}
                  disabled={this.state.locked}
                >
                  {this.props.i18n.text.get("plugin.profile.save.button")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    profile: state.profile,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { saveProfileProperty, displayNotification, updateProfileChatSettings },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(VacationSettings);
