import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StudySector, FollowUp } from "../../../../../../../@types/shared";
import {
  FollowUpGoal,
  FollowUpStudies,
} from "../../../../../../../@types/shared";
import { useFollowUpGoal } from "./hooks/useFollowUp";
import { StateType } from "~/reducers";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { WebsocketStateType } from "~/reducers/util/websocket";

/**
 * FollowUpGoalsProps
 */
interface FollowUpGoalsProps {
  disabled: boolean;
  studentId: string;
  websocketState: WebsocketStateType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * FollowUpGoals
 * @param props props
 * @returns JSX.Element
 */
const FollowUpGoals: React.FC<FollowUpGoalsProps> = (props) => {
  const { disabled, studentId, websocketState, displayNotification } = props;

  const { followUpData, ...followUpHandlers } = useFollowUpGoal(
    studentId,
    websocketState,
    displayNotification
  );

  /**
   * handleGoalsSelectsChange
   * @param name
   */
  const handleGoalsSelectsChange =
    (name: keyof FollowUp) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const updatedFollowUpData: FollowUp = {
        ...followUpData.followUp,
        [name]: e.currentTarget.value,
      };

      followUpHandlers.updateFollowUpData(props.studentId, updatedFollowUpData);
    };

  return (
    <>
      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <label className="hops-label">Valmistumisaikatavoite:</label>
          <select
            value={followUpData.followUp.graduationGoal}
            onChange={handleGoalsSelectsChange("graduationGoal")}
            className="hops-select"
            disabled={disabled}
          >
            <option value="">Valitse...</option>
            <option value="6">6kk</option>
            <option value="12">1v.</option>
            <option value="18">1,5v.</option>
            <option value="24">2v.</option>
          </select>
        </div>
      </div>

      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <label className="hops-label">Jatkotavoitteet:</label>
          <select
            value={followUpData.followUp.followUpGoal}
            onChange={handleGoalsSelectsChange("followUpGoal")}
            className="hops-select"
            disabled={disabled}
          >
            <option value="">Valitse...</option>
            <option value={FollowUpGoal.POSTGRADUATE_STUDIES}>
              Jatko-opinnot
            </option>
            <option value={FollowUpGoal.WORKING_LIFE}>Työelämä</option>
            <option value={FollowUpGoal.NO_FOLLOW_UP_GOALS}>
              Ei muita tavotteita
            </option>
          </select>
        </div>
      </div>
      {followUpData.followUp.followUpGoal ===
      FollowUpGoal.POSTGRADUATE_STUDIES ? (
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label className="hops-label">Jatko-opinnot:</label>
            <select
              value={followUpData.followUp.followUpStudies}
              onChange={handleGoalsSelectsChange("followUpStudies")}
              className="hops-select"
              disabled={disabled}
            >
              <option value="">Valitse...</option>
              <option value={FollowUpStudies.APPRENTICESHIP_TRAINING}>
                Oppisopimuskoulutus
              </option>
              <option value={FollowUpStudies.VOCATIONAL_SCHOOL}>
                Ammatillinen toinen aste
              </option>
              <option value={FollowUpStudies.UPPER_SECONDARY_SCHOOL}>
                Lukio
              </option>
              <option value={FollowUpStudies.UNIVERSITY_STUDIES}>
                Korkeakouluopinnot
              </option>
            </select>
          </div>

          <div className="hops__form-element-container">
            <label className="hops-label">Koulutusala:</label>
            <select
              value={followUpData.followUp.studySector}
              onChange={handleGoalsSelectsChange("studySector")}
              className="hops-select"
              disabled={disabled}
            >
              <option value="">Valitse...</option>
              <option value={StudySector.SOCIAL_HEALT_SECTOR}>
                Sosiaali- ja terveysala
              </option>
              <option value={StudySector.TRADE_SECTOR}>Kauppa</option>
              <option value={StudySector.TRANSPORT_SECTOR}>Liikenne</option>
              <option value={StudySector.EDUCATION_SECTOR}>Kasvatus</option>
              <option value={StudySector.INDUSTRY_SECTOR}>Teollisuus</option>
              <option value={StudySector.ART_SECTOR}>Taide</option>
            </select>
          </div>
        </div>
      ) : null}
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
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return { displayNotification };
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowUpGoals);
