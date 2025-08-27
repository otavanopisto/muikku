import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import {
  loadLanguageProfile,
  loadLanguageSamples,
} from "~/actions/main-function/language-profile";
import { useTranslation } from "react-i18next";
import {
  LanguageProfileData,
  LanguageItem,
  LanguageLevels,
} from "~/reducers/main-function/language-profile";
import {
  levelMap,
  skillMap,
} from "~/components/language-profile/body/application/initialization/steps/language-mapping";
import StarDisplayer from "./stars";
import "~/sass/elements/user-language-profile.scss";
import Drawer from "./drawer";

interface UserLanguageProfileProps {
  userId: number;
}

const UserLanguageProfileProps = (props: UserLanguageProfileProps) => {
  const { userId } = props;
  const {
    languageUsage,
    studyMotivation,
    languageLearning,
    learningFactors,
    futureUsage,
    skillGoals,
    languages,
  }: LanguageProfileData = useSelector(
    (state: StateType) => state.languageProfile.data
  );
  const { t } = useTranslation("languageProfile");

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadLanguageProfile(userId, true));
    dispatch(loadLanguageSamples(userId, true));
  }, [dispatch, userId]);

  const isEmpty =
    languageUsage === "" &&
    studyMotivation === "" &&
    languageLearning === "" &&
    learningFactors === "" &&
    futureUsage === "" &&
    skillGoals === "" &&
    (languages === undefined || languages.length === 0);

  return (
    <div className="user-language-profile">
      {isEmpty ? (
        <div className="empty">
          {t("content.empty", { ns: "languageProfile" })}
        </div>
      ) : (
        <>
          <Drawer title="Yleiset tiedot">
            {languageUsage && (
              <div className="user-language-profile-container__row">
                <label
                  htmlFor="languageUsage"
                  className="user-language-profile__label"
                >
                  {t("labels.languageUsageUseOfLanguagesLabel", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("labels.languageUsageUseOfLanguagesDescription", {
                    ns: "languageProfile",
                  })}
                </div>
                <textarea
                  id="languageUsage"
                  disabled={true}
                  defaultValue={languageUsage || ""}
                  className="user-language-profile__textarea"
                />
              </div>
            )}
            {studyMotivation && (
              <div className="user-language-profile-container__row">
                <label
                  htmlFor="studyMotivation"
                  className="user-language-profile__label"
                >
                  {t("labels.languageUsageMotivationInStudyingLabel", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("labels.languageUsageMotivationInStudyingDescription", {
                    ns: "languageProfile",
                  })}
                </div>
                <textarea
                  id="studyMo}tivation"
                  disabled={true}
                  defaultValue={studyMotivation || ""}
                  className="user-language-profile__textarea"
                />
              </div>
            )}
            {languageLearning && (
              <div className="user-language-profile-container__row">
                <label
                  htmlFor="messageForTeacher"
                  className="user-language-profile__label"
                >
                  {t("labels.languageUsageLearningLanguagesLabel", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("labels.languageUsageLearningLanguagesDescription", {
                    ns: "languageProfile",
                  })}
                </div>
                <textarea
                  id="messageForTeacher"
                  disabled={true}
                  defaultValue={languageLearning || ""}
                  className="user-language-profile__textarea"
                />
              </div>
            )}
            {learningFactors && (
              <div className="user-language-profile-container__row">
                <label
                  htmlFor="learningFactors"
                  className="user-language-profile__label"
                >
                  {t("labels.futureOfStudiesAffectingFactorsLabel", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("content.futureOfStudiesAffectingFactorsDescription", {
                    ns: "languageProfile",
                  })}
                </div>
                <textarea
                  id="learningFactors"
                  disabled={true}
                  defaultValue={learningFactors || ""}
                  className="user-language-profile__textarea"
                />
              </div>
            )}
            {futureUsage && (
              <div className="user-language-profile-container__row">
                <label
                  htmlFor="futureUsage"
                  className="user-language-profile__label"
                >
                  {t("labels.futureOfStudiesNecessityOfLanguagesLabel", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("content.futureOfStudiesNecessityOfLanguagesDescription", {
                    ns: "languageProfile",
                  })}
                </div>
                <textarea
                  id="futureUsage"
                  disabled={true}
                  defaultValue={futureUsage || ""}
                  className="user-language-profile__textarea"
                />
              </div>
            )}
            {skillGoals && (
              <div className="user-language-profile-container__row">
                <label
                  htmlFor="skillGoals"
                  className="user-language-profile__label"
                >
                  {t("labels.futureOfStudiesLanguageSkillGoalsLabel", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("content.futureOfStudiesLanguageSkillGoalsDescription", {
                    ns: "languageProfile",
                  })}
                </div>
                <textarea
                  id="skillGoals"
                  disabled={true}
                  defaultValue={skillGoals || ""}
                  className="user-language-profile__textarea"
                />
              </div>
            )}
          </Drawer>
          {languages?.map((lang) => (
            <Drawer key={lang.code} title={lang.name}>
              {lang.levels?.map((level, idx) => (
                <div key={idx}>
                  <h4>
                    {t("labels.languageSkillLevel", {
                      ns: "languageProfile",
                      context: levelMap[idx],
                    })}
                  </h4>
                  {Object.entries(level).map(([skill, value]) => {
                    // Extracting the context index from the skill string
                    // the skill keys are in the format "fi-0", "fi-1", etc.
                    const contextIndex = Number(skill.split("-")[1]);
                    return (
                      <div
                        className="user-language-profile__drawer-skill"
                        key={skill}
                      >
                        <h5>
                          {t([`levels.${value}`, "levels.unknown"], {
                            ns: "languageProfile",
                            defaultValue: "Unknown",
                          })}
                        </h5>
                        <p>
                          {t([`levels.${value}`, "levels.unknown"], {
                            ns: "languageProfile",
                            context: levelMap[contextIndex],
                            defaultValue: "Unknown",
                          })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div>
                <h4>
                  {t("labels.initializationStep2Title2", {
                    ns: "languageProfile",
                  })}
                </h4>
                {lang.skills?.map((skill, idx) => (
                  <div
                    className="user-language-profile__drawer-skill"
                    key={idx}
                  >
                    {Object.entries(skill).map(([label, value]) => {
                      // Extracting the context index from the skill string
                      // the skill keys are in the format "fi-0", "fi-1", etc.
                      const contextIndex = Number(label.split("-")[1]);
                      return (
                        <>
                          <h5>
                            {t("labels.skill", {
                              ns: "languageProfile",
                              context: skillMap[contextIndex],
                            })}
                          </h5>
                          <p>
                            {t(
                              [
                                `skills.${value.toLowerCase()}`,
                                "skills.unknown",
                              ],
                              {
                                ns: "languageProfile",
                                defaultValue: "Unknown",
                              }
                            )}
                          </p>
                        </>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div>
                <h4>
                  {t("labels.initializationStep2Title2", {
                    ns: "languageProfile",
                  })}
                </h4>
                {lang.workspaces?.map((workspace, idx) => (
                  <div
                    className="user-language-profile__drawer-skill"
                    key={idx}
                  >
                    <span>{workspace.name}:</span>
                    <StarDisplayer value={Number(workspace.value)} />
                  </div>
                ))}
              </div>
            </Drawer>
          ))}
        </>
      )}
    </div>
  );
};

export default UserLanguageProfileProps;
