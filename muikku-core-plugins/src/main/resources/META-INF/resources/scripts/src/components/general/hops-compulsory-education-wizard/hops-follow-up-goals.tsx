import * as React from "react";
import { connect, Dispatch } from "react-redux";
import {
  StudySector,
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
import { localize } from "~/locales/i18n";
import moment from "moment";
import AnimateHeight from "react-animate-height";
import { updateFollowUpData, useFollowUp } from "./context/follow-up-context";
import { HopsGoals } from "~/generated/client";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("hops");
  const followUpData = useFollowUp();

  /**
   * Handles goals change
   *
   * @param key key
   * @param value value
   */
  const handleGoalsChange = <T extends keyof HopsGoals>(
    key: T,
    value: HopsGoals[T]
  ) => {
    const updatedFollowUpData: HopsGoals = {
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
            {t("labels.graduationQuestion")}
          </label>
          <DatePicker
            id="graduationGoalMonth"
            onChange={(date) => handleGoalsChange("graduationGoal", date)}
            selected={
              followUpData.followUp.graduationGoal &&
              moment(followUpData.followUp.graduationGoal).toDate()
            }
            locale={outputCorrectDatePickerLocale(localize.language)}
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
            {t("labels.followUpQuestion")}
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
            <option value="">{t("labels.select")}</option>
            <option value={FollowUpGoal.POSTGRADUATE_STUDIES}>
              {t("labels.planToStudy")}
            </option>
            <option value={FollowUpGoal.WORKING_LIFE}>
              {t("labels.planToWork")}
            </option>
            <option value={FollowUpGoal.DONT_KNOW}>
              {t("labels.planUnknown")}
            </option>
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
              {t("labels.followUpStudyQuestion")}
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
              <option value="">{t("labels.select")}</option>
              <option value={FollowUpStudies.VOCATIONAL_SCHOOL}>
                {t("labels.schoolVocational")}
              </option>
              <option value={FollowUpStudies.UPPER_SECONDARY_SCHOOL}>
                {t("labels.schoolGymnasium")}
              </option>
              <option value={FollowUpStudies.SOMETHING_ELSE}>
                {t("labels.else")}
              </option>
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
              {t("labels.educationSector")}
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
              <option value=""> {t("labels.select")}</option>
              <option value={StudySector.SOCIAL_HEALT_SECTOR}>
                {t("labels.socialAndHealth")}
              </option>
              <option value={StudySector.TRADE_SECTOR}>
                {t("labels.trade")}
              </option>
              <option value={StudySector.TRANSPORT_SECTOR}>
                {t("labels.transport")}
              </option>
              <option value={StudySector.EDUCATION_SECTOR}>
                {t("labels.education")}
              </option>
              <option value={StudySector.INDUSTRY_SECTOR}>
                {t("labels.industry")}
              </option>
              <option value={StudySector.ART_SECTOR}>{t("labels.arts")}</option>
              <option value={StudySector.SOMETHING_ELSE}>
                {t("labels.else")}
              </option>
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
