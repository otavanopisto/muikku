import * as React from "react";
import { connect, Dispatch } from "react-redux";
import {
  StudySector,
  FollowUp,
  FollowUpStudies,
  FollowUpGoal,
} from "../../../@types/shared";
import { StateType } from "~/reducers";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import "react-datepicker/dist/react-datepicker.css";
import "~/sass/elements/datepicker/datepicker.scss";
import { WebsocketStateType } from "~/reducers/util/websocket";
import { AnyActionType } from "~/actions";
import { Textarea } from "./text-area";
import { TextField } from "./text-field";
import DatePicker from "react-datepicker";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { localizeTime } from "~/locales/i18n";
import * as moment from "moment";
import AnimateHeight from "react-animate-height";
import { updateFollowUpData, useFollowUp } from "./context/follow-up-context";

/**
 * FollowUpGoalsProps
 */
interface HopsFollowUpGoalsProps {
  disabled: boolean;
  studentId: string;
  studyTimeEnd: string | null;
  websocketState: WebsocketStateType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * FollowUpGoals
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsFollowUpGoals: React.FC<HopsFollowUpGoalsProps> = (props) => {
  const { disabled } = props;

  const followUpData = useFollowUp();

  /**
   * Handles goals change
   *
   * @param key key
   * @param value value
   */
  const handleGoalsChange = <T extends keyof FollowUp>(
    key: T,
    value: FollowUp[T]
  ) => {
    const updatedFollowUpData: FollowUp = {
      ...followUpData.followUp,
      [key]: value,
    };

    updateFollowUpData(
      props.studentId,
      updatedFollowUpData,
      props.displayNotification
    );
  };

  return (
    <>
      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <label htmlFor="graduationGoalMonth" className="hops__label">
            Milloin haluat valmistua?
          </label>
          <DatePicker
            id="graduationGoalMonth"
            onChange={(date) => handleGoalsChange("graduationGoal", date)}
            selected={followUpData.followUp.graduationGoal}
            locale={outputCorrectDatePickerLocale(localizeTime.language)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            showFullMonthYearPicker
            className="hops__input"
            maxDate={
              props.studyTimeEnd !== null && moment(props.studyTimeEnd).toDate()
            }
            disabled={disabled}
          />
        </div>
      </div>

      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <label htmlFor="followUpGoal" className="hops__label">
            Mitä aiot tehdä Nettiperuskoulun jälkeen:
          </label>
          <select
            id="followUpGoal"
            value={followUpData.followUp.followUpGoal}
            onChange={(e) =>
              handleGoalsChange("followUpGoal", e.currentTarget.value)
            }
            className="hops__select"
            disabled={disabled}
          >
            <option value="">Valitse...</option>
            <option value={FollowUpGoal.POSTGRADUATE_STUDIES}>
              Jatko-opinnot
            </option>
            <option value={FollowUpGoal.WORKING_LIFE}>Aion mennä töihin</option>

            <option value={FollowUpGoal.DONT_KNOW}>En tiedä vielä</option>
          </select>
        </div>

        <AnimateHeight
          height={
            followUpData.followUp.followUpGoal ===
            FollowUpGoal.POSTGRADUATE_STUDIES
              ? "auto"
              : 0
          }
          contentClassName="hops-animate__height-wrapper"
          className="hops-container__row hops-container__row--dependant-of-above"
        >
          <div className="hops__form-element-container">
            <label htmlFor="followUpStudies" className="hops__label">
              Mihin aiot hakea:
            </label>
            <select
              id="followUpStudies"
              value={followUpData.followUp.followUpStudies}
              onChange={(e) =>
                handleGoalsChange("followUpStudies", e.currentTarget.value)
              }
              className="hops__select"
              disabled={disabled}
            >
              <option value="">Valitse...</option>

              <option value={FollowUpStudies.VOCATIONAL_SCHOOL}>
                ammatillinen toinen aste
              </option>
              <option value={FollowUpStudies.UPPER_SECONDARY_SCHOOL}>
                lukio
              </option>

              <option value={FollowUpStudies.SOMETHING_ELSE}>joku muu?</option>
            </select>
          </div>

          <AnimateHeight
            height={
              followUpData.followUp.followUpStudies ===
              FollowUpStudies.SOMETHING_ELSE
                ? "auto"
                : 0
            }
            contentClassName="hops-animate__height-wrapper"
            className="hops-container__row hops-container__row--dependant-of-above"
          >
            <div className="hops__form-element-container">
              <TextField
                id="followUpStudiesElse"
                label="Kerro tarkemmin"
                defaultValue={followUpData.followUp.followUpStudiesElse}
                disabled={disabled}
                onBlur={(e) =>
                  handleGoalsChange(
                    "followUpStudiesElse",
                    e.currentTarget.value
                  )
                }
              />
            </div>
          </AnimateHeight>
        </AnimateHeight>
        <AnimateHeight
          height={
            followUpData.followUp.followUpGoal ===
              FollowUpGoal.POSTGRADUATE_STUDIES &&
            followUpData.followUp.followUpStudies ===
              FollowUpStudies.VOCATIONAL_SCHOOL
              ? "auto"
              : 0
          }
          contentClassName="hops-animate__height-wrapper"
          className="hops-container__row hops-container__row--dependant-of-above"
        >
          <div className="hops__form-element-container">
            <label htmlFor="studySector" className="hops__label">
              Koulutusala:
            </label>
            <select
              id="studySector"
              value={followUpData.followUp.studySector}
              onChange={(e) =>
                handleGoalsChange("studySector", e.currentTarget.value)
              }
              className="hops__select"
              disabled={disabled}
            >
              <option value="">Valitse...</option>
              <option value={StudySector.SOCIAL_HEALT_SECTOR}>
                sosiaali- ja terveysala
              </option>
              <option value={StudySector.TRADE_SECTOR}>kauppa</option>
              <option value={StudySector.TRANSPORT_SECTOR}>liikenne</option>
              <option value={StudySector.EDUCATION_SECTOR}>kasvatus</option>
              <option value={StudySector.INDUSTRY_SECTOR}>teollisuus</option>
              <option value={StudySector.ART_SECTOR}>taide</option>
              <option value={StudySector.SOMETHING_ELSE}>joku muu?</option>
            </select>
          </div>

          <AnimateHeight
            height={
              followUpData.followUp.studySector ===
              FollowUpStudies.SOMETHING_ELSE
                ? "auto"
                : 0
            }
            contentClassName="hops-animate__height-wrapper"
            className="hops-container__row hops-container__row--dependant-of-above"
          >
            <div className="hops__form-element-container">
              <TextField
                id="studySectorElse"
                label="Kerro tarkemmin"
                defaultValue={followUpData.followUp.studySectorElse}
                disabled={disabled}
                onBlur={(e) =>
                  handleGoalsChange("studySectorElse", e.currentTarget.value)
                }
              />
            </div>
          </AnimateHeight>
        </AnimateHeight>
      </div>

      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <Textarea
            id="followUpPlanExtraInfo"
            className="hops__textarea"
            label="Voit kertoa tarkemmin jatkosuunnitelmistasi:"
            disabled={disabled}
            defaultValue={followUpData.followUp.followUpPlanExtraInfo}
            onBlur={(e) =>
              handleGoalsChange("followUpPlanExtraInfo", e.currentTarget.value)
            }
          />
        </div>
      </div>
    </>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    websocketState: state.websocket,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return { displayNotification };
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsFollowUpGoals);
