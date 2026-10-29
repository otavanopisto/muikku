import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { StatusType } from "~/reducers/base/status";
import { ProfileState } from "~/reducers/main-function/profile";
import {
  saveProfileProperty,
  SaveProfilePropertyTriggerType,
} from "~/actions/main-function/profile";
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import Button from "~/components/general/button";
import { SimpleActionExecutor } from "~/actions/executor";
import { AnyActionType } from "~/actions/index";
import {
  doVacationPeriodsOverlap,
  hasCompleteVacationPeriod,
  serializeVacationPeriods,
} from "~/helper-functions/vacation-periods";
import VacationPeriods, {
  createVacationPeriodRow,
  VacationPeriodRow,
  vacationPeriodsFromProperties,
} from "./components/vacation-periods";
import { withTranslation, WithTranslation } from "react-i18next";
import { Instructions } from "~/components/general/instructions";

/**
 * VacationSettingsProps
 */
interface VacationSettingsProps extends WithTranslation {
  profile: ProfileState;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
  saveProfileProperty: SaveProfilePropertyTriggerType;
}

/**
 * VacationSettingsState
 */
interface VacationSettingsState {
  periods: VacationPeriodRow[];
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
      periods: vacationPeriodsFromProperties(
        props.profile.properties["profile-vacation-start"],
        props.profile.properties["profile-vacation-end"]
      ),
      vacationAutoReply:
        props.profile.properties["communicator-auto-reply"] || "",
      vacationAutoReplySubject:
        props.profile.properties["communicator-auto-reply-subject"] || "",
      vacationAutoReplyMsg:
        props.profile.properties["communicator-auto-reply-msg"] || "",
      locked: false,
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.addPeriod = this.addPeriod.bind(this);
    this.removePeriod = this.removePeriod.bind(this);
    this.onVacationAutoReplyChange = this.onVacationAutoReplyChange.bind(this);
    this.onVacationAutoReplySubjectChange =
      this.onVacationAutoReplySubjectChange.bind(this);
    this.onVacationAutoReplyMsgChange =
      this.onVacationAutoReplyMsgChange.bind(this);
    this.save = this.save.bind(this);
    this.getPendingChanges = this.getPendingChanges.bind(this);
    this.hasUnsavedChanges = this.hasUnsavedChanges.bind(this);
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: VacationSettingsProps) {
    const startChanged =
      this.props.profile.properties["profile-vacation-start"] !==
      nextProps.profile.properties["profile-vacation-start"];
    const endChanged =
      this.props.profile.properties["profile-vacation-end"] !==
      nextProps.profile.properties["profile-vacation-end"];

    if (startChanged || endChanged) {
      this.setState({
        periods: vacationPeriodsFromProperties(
          nextProps.profile.properties["profile-vacation-start"],
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
   * @param periodId periodId
   * @param field field
   * @param newDate newDate
   */
  handleDateChange(
    periodId: number,
    field: "start" | "end",
    newDate: Date | null
  ) {
    this.setState((prevState) => ({
      periods: prevState.periods.map((period) =>
        period.id === periodId ? { ...period, [field]: newDate } : period
      ),
    }));
  }

  /**
   * addPeriod
   */
  addPeriod() {
    this.setState((prevState) => ({
      periods: [...prevState.periods, createVacationPeriodRow()],
    }));
  }

  /**
   * removePeriod
   * @param periodId periodId
   */
  removePeriod(periodId: number) {
    this.setState((prevState) => {
      const nextPeriods = prevState.periods.filter(
        (period) => period.id !== periodId
      );

      return {
        periods:
          nextPeriods.length > 0 ? nextPeriods : [createVacationPeriodRow()],
      };
    });
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
   * Returns which profile properties would change on save.
   */
  getPendingChanges() {
    const periodsToSave = this.state.periods.filter(
      (period) => period.start || period.end
    );
    const serialized = serializeVacationPeriods(periodsToSave);
    const currentStart =
      this.props.profile.properties["profile-vacation-start"] || "";
    const currentEnd =
      this.props.profile.properties["profile-vacation-end"] || "";
    const isStaff = !this.props.status.isStudent;
    return {
      periodsToSave,
      serialized,
      startChanged: isStaff && currentStart !== (serialized.start || ""),
      endChanged: isStaff && currentEnd !== (serialized.end || ""),
      autoReplyChanged:
        isStaff &&
        (this.props.profile.properties["communicator-auto-reply"] || "") !==
          this.state.vacationAutoReply,
      autoReplySubjectChanged:
        isStaff &&
        (this.props.profile.properties["communicator-auto-reply-subject"] ||
          "") !== this.state.vacationAutoReplySubject,
      autoReplyMsgChanged:
        isStaff &&
        (this.props.profile.properties["communicator-auto-reply-msg"] || "") !==
          this.state.vacationAutoReplyMsg,
    };
  }

  /**
   * Has form changes that are not saved.
   */
  hasUnsavedChanges() {
    const changes = this.getPendingChanges();
    return (
      changes.startChanged ||
      changes.endChanged ||
      changes.autoReplyChanged ||
      changes.autoReplySubjectChanged ||
      changes.autoReplyMsgChanged
    );
  }

  /**
   * save
   */
  save() {
    const {
      periodsToSave,
      serialized,
      startChanged,
      endChanged,
      autoReplyChanged,
      autoReplySubjectChanged,
      autoReplyMsgChanged,
    } = this.getPendingChanges();

    if (doVacationPeriodsOverlap(periodsToSave)) {
      this.props.displayNotification(
        this.props.t("notifications.overlappingVacationPeriods", {
          ns: "profile",
        }),
        "error"
      );
      return;
    }

    if (
      !startChanged &&
      !endChanged &&
      !autoReplyChanged &&
      !autoReplySubjectChanged &&
      !autoReplyMsgChanged
    ) {
      return;
    }

    this.setState({
      locked: true,
    });

    const executor = new SimpleActionExecutor();
    executor
      .addAction(startChanged, () => {
        this.props.saveProfileProperty({
          key: "profile-vacation-start",
          value: serialized.start,
          success: executor.succeeded,
          fail: executor.failed,
        });
      })
      .addAction(endChanged, () => {
        this.props.saveProfileProperty({
          key: "profile-vacation-end",
          value: serialized.end,
          success: executor.succeeded,
          fail: executor.failed,
        });
      })
      .addAction(autoReplyChanged, () => {
        this.props.saveProfileProperty({
          key: "communicator-auto-reply",
          value: this.state.vacationAutoReply,
          success: executor.succeeded,
          fail: executor.failed,
        });
      })
      .addAction(autoReplySubjectChanged, () => {
        this.props.saveProfileProperty({
          key: "communicator-auto-reply-subject",
          value: this.state.vacationAutoReplySubject,
          success: executor.succeeded,
          fail: executor.failed,
        });
      })
      .addAction(autoReplyMsgChanged, () => {
        this.props.saveProfileProperty({
          key: "communicator-auto-reply-msg",
          value: this.state.vacationAutoReplyMsg,
          success: executor.succeeded,
          fail: executor.failed,
        });
      })
      .onAllSucceed(() => {
        this.props.displayNotification(
          this.props.t("notifications.saveSuccess"),
          "success"
        );

        this.setState({
          locked: false,
        });
      })
      .onOneFails(() => {
        this.props.displayNotification(
          this.props.t("notifications.saveError"),
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

    const autoReplyEnabled = hasCompleteVacationPeriod(this.state.periods);

    return (
      <section>
        <form className="form">
          <h2 className="application-panel__content-header">
            {this.props.t("labels.vacationSettings", { ns: "profile" })}
            <Instructions
              modifier="instructions"
              alignSelfVertically="top"
              openByHover={false}
              closeOnClick={true}
              closeOnOutsideClick={true}
              persistent
              content={
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.props.t("content.instructions", {
                      ns: "profile",
                    }),
                  }}
                />
              }
            />
          </h2>

          <div className="application-sub-panel">
            <div className="application-sub-panel__body">
              <VacationPeriods
                periods={this.state.periods}
                onDateChange={this.handleDateChange}
                onAddPeriod={this.addPeriod}
                onRemovePeriod={this.removePeriod}
              />
              <div className="application-sub-panel__item  application-sub-panel__item--profile">
                <div className="form__row">
                  <div
                    className={`form-element ${
                      !autoReplyEnabled ? "NON-ACTIVE" : ""
                    }`}
                  >
                    <div className="form-element form-element--checkbox-radiobutton">
                      <input
                        checked={this.state.vacationAutoReply === "ENABLED"}
                        value={this.state.vacationAutoReply}
                        id="profileVacationAutoReply"
                        type="checkbox"
                        onChange={this.onVacationAutoReplyChange}
                      />
                      <label htmlFor="profileVacationAutoReply">
                        {this.props.t("labels.vacationAutoReply", {
                          ns: "profile",
                        })}
                      </label>
                    </div>
                    <div className="form-element__description">
                      {this.props.t("content.vacationAutoReply", {
                        ns: "profile",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {this.state.vacationAutoReply === "ENABLED" && (
                <div className="application-sub-panel__item  application-sub-panel__item--profile">
                  <div className="form__row">
                    <div
                      className={`form-element ${
                        !autoReplyEnabled ? "NON-ACTIVE" : ""
                      }`}
                    >
                      <label htmlFor="profileVacationAutoReplySubject">
                        {this.props.t("labels.title", {
                          context: "vacationMessage",
                        })}
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
                </div>
              )}

              {this.state.vacationAutoReply === "ENABLED" && (
                <div className="application-sub-panel__item  application-sub-panel__item--profile">
                  <div className="form__row">
                    <div
                      className={`form-element ${
                        !autoReplyEnabled ? "NON-ACTIVE" : ""
                      }`}
                    >
                      <label htmlFor="profileVacationAutoReplyMsg">
                        {this.props.t("labels.content", {
                          context: "vacationMessage",
                        })}
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
                </div>
              )}
              <div className="application-sub-panel__item  application-sub-panel__item--profile">
                <div className="form__buttons">
                  <Button
                    buttonModifiers="primary-function-save"
                    onClick={this.save}
                    disabled={this.state.locked || !this.hasUnsavedChanges()}
                  >
                    {this.props.t("actions.save")}
                  </Button>
                </div>
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
    profile: state.profile,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { saveProfileProperty, displayNotification },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(VacationSettings)
);
