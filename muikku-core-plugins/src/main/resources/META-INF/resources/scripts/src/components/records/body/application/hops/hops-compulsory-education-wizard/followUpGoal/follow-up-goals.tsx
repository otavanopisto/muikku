import * as React from "react";
import { useFollowUpGoal } from "./hooks/useFollowUp";
import { StudySector, FollowUp } from "../../../../../../../@types/shared";
import {
  FollowUpGoal,
  FollowUpStudies,
} from "../../../../../../../@types/shared";

/**
 * FollowUpGoalsProps
 */
interface FollowUpGoalsProps {
  disabled: boolean;
}

/**
 * FollowUpGoals
 * @param props
 * @returns JSX.Element
 */
const FollowUpGoals: React.FC<FollowUpGoalsProps> = (props) => {
  const { disabled } = props;

  const { followUpData, updateFollowUpData } = useFollowUpGoal();

  const { followUpGoal, followUpStudies, studySector } = followUpData;

  /**
   * handleGoalsSelectsChange
   * @param name
   */
  const handleGoalsSelectsChange =
    (name: keyof FollowUp) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      console.log("handleGoalsSelectsChange ==> updateFollowUpData()");
      updateFollowUpData({
        ...followUpData,
        [name]: e.currentTarget.value,
      });
    };

  return (
    <>
      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <label className="hops-label">Jatkotavoitteet:</label>
          <select
            value={followUpGoal}
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
      {followUpGoal === FollowUpGoal.POSTGRADUATE_STUDIES ? (
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label className="hops-label">Jatko-opinnot:</label>
            <select
              value={followUpStudies}
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
              value={studySector}
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

export default FollowUpGoals;
