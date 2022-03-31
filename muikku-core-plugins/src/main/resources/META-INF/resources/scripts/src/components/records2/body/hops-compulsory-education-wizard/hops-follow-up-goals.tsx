import * as React from "react";
import { connect, Dispatch } from "react-redux";
import {
  StudySector,
  FollowUp,
  FollowUpStudies,
  FollowUpGoal,
} from "../../../../@types/shared";
import { useFollowUpGoal } from "./hooks/useFollowUp";
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
import AnimateHeight from "react-animate-height";
import DatePicker from "react-datepicker";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { i18nType } from "~/reducers/base/i18n";
import * as moment from "moment";

/**
 * FollowUpGoalsProps
 */
interface HopsFollowUpGoalsProps {
  i18n: i18nType;
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
  const { disabled, studentId, websocketState, displayNotification, i18n } =
    props;

  const { followUpData, ...followUpHandlers } = useFollowUpGoal(
    studentId,
    websocketState,
    displayNotification
  );

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

    followUpHandlers.updateFollowUpData(props.studentId, updatedFollowUpData);
  };

  return (
    <>
      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <label className="hops__label">Milloin haluat valmistua?</label>
          <DatePicker
            onChange={(date) => handleGoalsChange("graduationGoal", date)}
            selected={followUpData.followUp.graduationGoal}
            locale={outputCorrectDatePickerLocale(i18n.time.getLocale())}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            showFullMonthYearPicker
            className="form-element__input"
            maxDate={
              props.studyTimeEnd !== null && moment(props.studyTimeEnd).toDate()
            }
          />
        </div>
      </div>

      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <label className="hops__label">
            Mitä aiot tehdä Nettiperuskoulun jälkeen:
          </label>
          <select
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
            {/* <option value={FollowUpGoal.NO_FOLLOW_UP_GOALS}>
              Ei muita tavotteita
            </option> */}
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
          contentClassName="hops-animate_height-wrapper"
          className="hops-container__row hops-container__row--dependant-of-above"
        >
          <div className="hops__form-element-container">
            <label className="hops__label">Mihin aiot hakea:</label>
            <select
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
            contentClassName="hops-animate_height-wrapper"
            className="hops-container__row hops-container__row--dependant-of-above"
          >
            <div className="hops__form-element-container">
              <TextField
                label="Kerro tarkemmin"
                defaultValue={followUpData.followUp.followUpStudiesElse}
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
              FollowUpGoal.POSTGRADUATE_STUDIES ||
            followUpData.followUp.followUpGoal === FollowUpGoal.WORKING_LIFE
              ? "auto"
              : 0
          }
          contentClassName="hops-animate_height-wrapper"
          className="hops-container__row hops-container__row--dependant-of-above"
        >
          <div className="hops__form-element-container">
            <label className="hops__label">Koulutusala:</label>
            <select
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
            contentClassName="hops-animate_height-wrapper"
            className="hops-container__row hops-container__row--dependant-of-above"
          >
            <div className="hops__form-element-container">
              <TextField
                label="Kerro tarkemmin"
                defaultValue={followUpData.followUp.studySectorElse}
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
            className="hops__textarea"
            label="Voit kertoa tarkemmin jatkosuunnitelmistasi:"
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
    i18n: state.i18n,
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
