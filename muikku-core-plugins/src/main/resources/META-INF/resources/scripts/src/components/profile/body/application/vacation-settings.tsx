import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StatusType } from "~/reducers/base/status";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { SimpleActionExecutor } from "~/actions/executor";
import * as moment from "moment";
import { AnyActionType } from "~/actions/index";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";

/**
 * VacationSettingsProps
 */
interface VacationSettingsProps {
  i18nOLD: i18nType;
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
  profileVacationStart: Date | null;
  profileVacationEnd: Date | null;
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
   * @param props props
   */
  constructor(props: VacationSettingsProps) {
    super(props);

    this.state = {
      profileVacationStart:
        (props.profile.properties["profile-vacation-start"] &&
          moment(
            props.profile.properties["profile-vacation-start"]
          ).toDate()) ||
        null,
      profileVacationEnd:
        (props.profile.properties["profile-vacation-end"] &&
          moment(props.profile.properties["profile-vacation-end"]).toDate()) ||
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
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: VacationSettingsProps) {
    if (
      nextProps.profile.properties["profile-vacation-start"] &&
      this.props.profile.properties["profile-vacation-start"] !==
        nextProps.profile.properties["profile-vacation-start"]
    ) {
      this.setState({
        profileVacationStart: moment(
          nextProps.profile.properties["profile-vacation-start"]
        ).toDate(),
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
        ).toDate(),
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
   * @param stateLocation stateLocation
   * @param newDate newDate
   */
  handleDateChange(
    stateLocation: "profileVacationStart" | "profileVacationEnd",
    newDate: Date
  ) {
    const nState: any = {};
    nState[stateLocation] = newDate;
    (this.setState as any)(nState);
  }

  /**
   * onVacationAutoReplyChange
   * @param e e
   */
  onVacationAutoReplyChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      vacationAutoReply: e.target.checked ? "ENABLED" : "",
    });
  }

  /**
   * onVacationAutoReplySubjectChange
   * @param e e
   */
  onVacationAutoReplySubjectChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      vacationAutoReplySubject: e.target.value,
    });
  }

  /**
   * onVacationAutoReplyMsgChange
   * @param e e
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
          !moment(
            this.props.profile.properties["profile-vacation-start"]
          ).isSame(moment(this.state.profileVacationStart)),
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
          !moment(this.props.profile.properties["profile-vacation-end"]).isSame(
            moment(this.state.profileVacationEnd)
          ),
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
          this.props.i18nOLD.text.get("plugin.profile.properties.saved"),
          "success"
        );

        this.setState({
          locked: false,
        });
      })
      .onOneFails(() => {
        this.props.displayNotification(
          this.props.i18nOLD.text.get("plugin.profile.properties.failed"),
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
        <form className="form">
          <h2 className="application-panel__content-header">
            {this.props.i18nOLD.text.get(
              "plugin.profile.titles.vacationSettings"
            )}
          </h2>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body">
              <div className="form__row">
                <div className="form-element">
                  <label htmlFor="profileVacationStart">
                    {this.props.i18nOLD.text.get(
                      "plugin.profile.awayStartDate.label"
                    )}
                  </label>
                  <DatePicker
                    id="profileVacationStart"
                    className="form-element__input"
                    onChange={this.handleDateChange.bind(
                      this,
                      "profileVacationStart"
                    )}
                    maxDate={this.state.profileVacationEnd}
                    locale={outputCorrectDatePickerLocale(
                      this.props.i18nOLD.time.getLocale()
                    )}
                    selected={this.state.profileVacationStart}
                    dateFormat="P"
                  />
                </div>
              </div>
              <div className="form__row">
                <div className="form-element">
                  <label htmlFor="profileVacationStart">
                    {this.props.i18nOLD.text.get(
                      "plugin.profile.awayEndDate.label"
                    )}
                  </label>
                  <DatePicker
                    id="profileVacationEnd"
                    className="form-element__input"
                    onChange={this.handleDateChange.bind(
                      this,
                      "profileVacationEnd"
                    )}
                    minDate={this.state.profileVacationStart}
                    locale={outputCorrectDatePickerLocale(
                      this.props.i18nOLD.time.getLocale()
                    )}
                    selected={this.state.profileVacationEnd}
                    dateFormat="P"
                  />
                </div>
              </div>

              <div className="form__row">
                <div
                  className={`form-element ${
                    !this.state.profileVacationStart ||
                    !this.state.profileVacationEnd
                      ? "NON-ACTIVE"
                      : ""
                  }`}
                >
                  <div className="form-element form-element--checkbox-radiobutton">
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
                    <label htmlFor="profileVacationAutoReply">
                      {this.props.i18nOLD.text.get(
                        "plugin.profile.vacationAutoReply.label"
                      )}
                    </label>
                  </div>
                  <div className="form-element__description">
                    {this.props.i18nOLD.text.get(
                      "plugin.profile.vacationAutoReply.description"
                    )}
                  </div>
                </div>
              </div>

              {this.state.vacationAutoReply === "ENABLED" && (
                <div className="form__row">
                  <div
                    className={`form-element ${
                      !this.state.profileVacationStart ||
                      !this.state.profileVacationEnd
                        ? "NON-ACTIVE"
                        : ""
                    } form-element`}
                  >
                    <label htmlFor="profileVacationAutoReplySubject">
                      {this.props.i18nOLD.text.get(
                        "plugin.profile.vacationAutoReplySubject.label"
                      )}
                    </label>
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
                <div className="form__row">
                  <div
                    className={`form-element ${
                      !this.state.profileVacationStart ||
                      !this.state.profileVacationEnd
                        ? "NON-ACTIVE"
                        : ""
                    } form-element`}
                  >
                    <label htmlFor="profileVacationAutoReplyMsg">
                      {this.props.i18nOLD.text.get(
                        "plugin.profile.vacationAutoReplyMsg.label"
                      )}
                    </label>
                    <div className="form-element__textarea-container">
                      <textarea
                        className="form-element__textarea form-element__textarea--profile-auto-reply"
                        id="profileVacationAutoReplyMsg"
                        onChange={this.onVacationAutoReplyMsgChange}
                        value={this.state.vacationAutoReplyMsg}
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              <div className="form__buttons">
                <Button
                  buttonModifiers="primary-function-save"
                  onClick={this.save}
                  disabled={this.state.locked}
                >
                  {this.props.i18nOLD.text.get("plugin.profile.save.button")}
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
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { saveProfileProperty, displayNotification, updateProfileChatSettings },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(VacationSettings);
