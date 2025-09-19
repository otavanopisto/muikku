import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import {
  loadLanguageProfile,
  loadLanguageSamples,
} from "~/actions/main-function/language-profile";
import { useTranslation } from "react-i18next";
import { LanguageProfileData } from "~/reducers/main-function/language-profile";
import {
  levelMap,
  skillMap,
} from "~/components/language-profile/body/application/initialization/steps/language-mapping";
import StarDisplayer from "./components/star-displayer";
import "~/sass/elements/user-language-profile.scss";
import Accordion from "./components/accordion";
import Sample from "~/components/language-profile/body/application/languages/sample";
import { LanguageData } from "~/@types/shared";

/**
 * UserLanguageProfileProps
 */
interface UserLanguageProfileProps {
  userId: number;
}

/**
 * UserLanguageProfile
 * @param props props
 * @returns JSX.Element
 */
const UserLanguageProfile = (props: UserLanguageProfileProps) => {
  const { userId } = props;
  const {
    languageUsage,
    studyMotivation,
    languageLearning,
    learningFactors,
    futureUsage,
    skillGoals,
    languages,
    samples,
  }: LanguageProfileData = useSelector(
    (state: StateType) => state.languageProfile.data
  );
  const { t } = useTranslation("languageProfile");

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadLanguageProfile(userId, true));
    dispatch(loadLanguageSamples(userId, true));
  }, [dispatch, userId]);

  /**
   * getLanguageSamples
   * @param language language item
   * @returns languages samples for the given language
   */
  const getLanguageSamples = (language: LanguageData) =>
    samples.filter((sample) => sample.language === language.code);

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
          <Accordion
            id="language-usage-drawer"
            title={t("labels.languageUsageAndStudying", {
              ns: "languageProfile",
            })}
          >
            {languageUsage && (
              <div className="user-language-profile-container__row">
                <label
                  htmlFor="languageUsage"
                  className="user-language-profile__label"
                >
                  {t("labels.languageUsage", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("content.languageUsage", {
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
                  {t("labels.languageMotivation", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("content.languageMotivation", {
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
                  {t("labels.languageLearning", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("content.languageLearning", {
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
          </Accordion>
          <Accordion
            id="future-of-studies-drawer"
            title={t("labels.futureOfStudies", {
              ns: "languageProfile",
            })}
          >
            {learningFactors && (
              <div className="user-language-profile-container__row">
                <label
                  htmlFor="learningFactors"
                  className="user-language-profile__label"
                >
                  {t("labels.studyAffectingFactors", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("content.studyAffectingFactors", {
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
                  {t("labels.futureUsage", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("content.futureUsage", {
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
                  {t("labels.languageGoals", {
                    ns: "languageProfile",
                  })}
                </label>
                <div className="language-profile__field-description">
                  {t("content.languageGoals", {
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
          </Accordion>
          {languages?.map((lang) => (
            <Accordion
              id={`language-drawer-${lang.code}`}
              key={lang.code}
              title={lang.name}
            >
              {lang.levels ? (
                lang.levels.map((level, idx) => (
                  <div key={`level-${idx}`}>
                    {Object.entries(level).map(([level, value]) => {
                      // Extracting the context index from the skill string
                      // the skill keys are in the format "fi-0", "fi-1", etc.
                      // This is because how the data handling component works

                      const contextIndex = Number(level.split("-")[1]);
                      return (
                        <React.Fragment key={level}>
                          <h4>
                            {t("labels.languageSkillLevel", {
                              ns: "languageProfile",
                              context: levelMap[contextIndex],
                            })}
                          </h4>

                          <div
                            className="user-language-profile__drawer-skill"
                            key={level}
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
                        </React.Fragment>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="empty">
                  {t("content.empty", {
                    context: "levels",
                    ns: "languageProfile",
                  })}
                </div>
              )}
              {lang.skills ? (
                <div>
                  <h4>
                    {t("labels.skillsByDivision", {
                      ns: "languageProfile",
                    })}
                  </h4>
                  {lang.skills?.map((skill, idx) => (
                    <div
                      className="user-language-profile__drawer-skill"
                      key={`skill-${idx}`}
                    >
                      {Object.entries(skill).map(([label, value]) => {
                        // Extracting the context index from the label string
                        // the skill keys are in the format "fi-0", "fi-1", etc.
                        // This is because how the data handling component works

                        const contextIndex = Number(label.split("-")[1]);
                        return (
                          <React.Fragment key={`skill-${idx}`}>
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
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">
                  {t("content.empty", {
                    context: "skills",
                    ns: "languageProfile",
                  })}
                </div>
              )}
              {lang.workspaces ? (
                <div>
                  <h4>
                    {t("labels.skillsByDivision", {
                      ns: "languageProfile",
                    })}
                  </h4>
                  {lang.workspaces?.map((workspace, idx) => (
                    <div
                      className="user-language-profile__drawer-skill"
                      key={`workspace-${idx}`}
                    >
                      <span>{workspace.name}:</span>
                      <StarDisplayer value={Number(workspace.value)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">
                  {t("content.empty", {
                    context: "workspaces",
                    ns: "languageProfile",
                  })}
                </div>
              )}
              <div>
                <h4>
                  {t("labels.samples", {
                    ns: "languageProfile",
                  })}
                </h4>
                {getLanguageSamples(lang).length === 0 ? (
                  <div className="empty">
                    {t("content.empty", {
                      context: "samples",
                      ns: "languageProfile",
                    })}
                  </div>
                ) : (
                  getLanguageSamples(lang).map((sample) => (
                    <Sample key={sample.id} sample={sample} />
                  ))
                )}
              </div>
            </Accordion>
          ))}
        </>
      )}
    </div>
  );
};

export default UserLanguageProfile;
