import { TFunction } from "i18next";
import _ from "lodash";
import {
  CompulsoryStudiesHops,
  isSecondaryStudiesHops,
  SecondaryStudiesHops,
} from "~/@types/hops";
import { isCompulsoryStudiesHops } from "~/@types/hops";
import { HopsForm } from "~/@types/hops";

/**
 * CompulsoryStudiesFieldsTranslation. Returns the translation for the compulsory studies fields
 * Specifically used for history entries
 * @param t t
 */
export const compulsoryStudiesFieldsTranslation = (
  t: TFunction
): {
  [key: string]: string;
} => ({
  previousEducation: t("labels.hopsCompulsoryPreviousEducation", {
    ns: "hops_new",
  }),
  previousEducationElse: `${t("labels.hopsCompulsoryPreviousEducationElse", {
    ns: "hops_new",
  })} (${t("labels.hopsCompulsoryPreviousEducation", {
    ns: "hops_new",
  })})`,
  previousWorkExperience: t("labels.hopsCompulsoryPreviousWorkExperience", {
    ns: "hops_new",
  }),
  previousWorkExperienceField: t(
    "labels.hopsCompulsoryPreviousWorkExperienceField",
    {
      ns: "hops_new",
    }
  ),
  previousYearsUsedInStudies: t(
    "labels.hopsCompulsoryPreviousYearsUsedInStudies",
    {
      ns: "hops_new",
    }
  ),
  previousLanguageExperience: t(
    "labels.hopsCompulsoryPreviousLanguageExperience",
    {
      ns: "hops_new",
    }
  ),
  byReadingMaterials: t("labels.hopsCompulsoryByReadingMaterials", {
    ns: "hops_new",
  }),
  byTakingNotes: t("labels.hopsCompulsoryByTakingNotes", {
    ns: "hops_new",
  }),
  byDoingExercises: t("labels.hopsCompulsoryByDoingExercises", {
    ns: "hops_new",
  }),
  byMemorizing: t("labels.hopsCompulsoryByMemorizing", {
    ns: "hops_new",
  }),
  byWatchingVideos: t("labels.hopsCompulsoryByWatchingVideos", {
    ns: "hops_new",
  }),
  byListeningTeaching: t("labels.hopsCompulsoryByListeningTeaching", {
    ns: "hops_new",
  }),
  byExplaining: t("labels.hopsCompulsoryByExplaining", {
    ns: "hops_new",
  }),
  byDiscussing: t("labels.hopsCompulsoryByDiscussing", {
    ns: "hops_new",
  }),
  byWatchingOrDoingExamples: t(
    "labels.hopsCompulsoryByWatchingOrDoingExamples",
    {
      ns: "hops_new",
    }
  ),
  someOtherWay: t("labels.hopsCompulsorySomeOtherWay", {
    ns: "hops_new",
  }),
  fromFamilyMember: t("labels.hopsCompulsoryFromFamilyMember", {
    ns: "hops_new",
  }),
  fromFriend: t("labels.hopsCompulsoryFromFriend", {
    ns: "hops_new",
  }),
  fromSupportPerson: t("labels.hopsCompulsoryFromSupportPerson", {
    ns: "hops_new",
  }),
  noSupport: t("labels.hopsCompulsoryNoSupport", {
    ns: "hops_new",
  }),
  studySupportSomethingElse: t(
    "labels.hopsCompulsoryStudySupportSomethingElse",
    {
      ns: "hops_new",
      context: "edited",
    }
  ),
  studySupportSomethingElseWhat: t(
    "labels.hopsCompulsoryStudySupportSomethingElseWhat",
    {
      ns: "hops_new",
      context: "edited",
    }
  ),
  likeStudying: t("labels.hopsCompulsoryLikeStudying", {
    ns: "hops_new",
  }),
  haveGoals: t("labels.hopsCompulsoryHaveGoals", {
    ns: "hops_new",
  }),
  readyToAchieveGoals: t("labels.hopsCompulsoryReadyToAchieveGoals", {
    ns: "hops_new",
  }),
  alwaysFinishJobs: t("labels.hopsCompulsoryAlwaysFinishJobs", {
    ns: "hops_new",
  }),
  bePedantic: t("labels.hopsCompulsoryBePedantic", {
    ns: "hops_new",
  }),
  studyingConcentration: t("labels.hopsCompulsoryStudyingConcentration", {
    ns: "hops_new",
  }),
  affectedByNoise: t("labels.hopsCompulsoryAffectedByNoise", {
    ns: "hops_new",
  }),
  canFollowInstructions: t("labels.hopsCompulsoryCanFollowInstructions", {
    ns: "hops_new",
  }),
  canEvaluateOwnWork: t("labels.hopsCompulsoryCanEvaluateOwnWork", {
    ns: "hops_new",
  }),
  canTakeFeedback: t("labels.hopsCompulsoryCanTakeFeedback", {
    ns: "hops_new",
  }),
  canUseBasicComputerFunctionalities: t(
    "labels.hopsCompulsoryCanUseBasicComputerFunctionalities",
    {
      ns: "hops_new",
    }
  ),
  selfImageSomethingElse: t("labels.hopsCompulsorySelfImageSomethingElse", {
    ns: "hops_new",
  }),
  wishesForTeachersAndSupervisors: t(
    "labels.hopsCompulsoryWishesForTeachersAndSupervisors",
    {
      ns: "hops_new",
    }
  ),
  whatNext: t("labels.hopsCompulsoryWhatNext", {
    ns: "hops_new",
  }),
  postGraduateStudies: t("labels.hopsCompulsoryWhereApply", {
    ns: "hops_new",
  }),
  vocationalPostGraduateStudySector: t(
    "labels.hopsCompulsoryVocationalSector",
    {
      ns: "hops_new",
    }
  ),
  futurePlans: t("labels.hopsCompulsoryTellMoreFuturePlan", {
    ns: "hops_new",
  }),
});

/**
 * SecondaryStudiesFieldsTranslation. Returns the translation for the secondary studies fields
 * Specifically used for history entries
 * @param t t
 */
export const secondaryStudiesFieldsTranslation = (
  t: TFunction
): { [key: string]: string } => ({
  previousEducation: t("labels.hopsSecondaryPreviousEducation", {
    ns: "hops_new",
  }),
  nativeLanguage: t("labels.hopsSecondaryNativeLanguage", {
    ns: "hops_new",
  }),
  studiedLanguagesAtSchool: t("labels.hopsSecondaryStudiedLanguagesAtSchool", {
    ns: "hops_new",
  }),
  studiedLanguagesOther: t("labels.hopsSecondaryStudiedLanguagesOther", {
    ns: "hops_new",
  }),
  languageLearningSkills: t("labels.hopsSecondaryLanguageLearningSkills", {
    ns: "hops_new",
  }),
  positiveAttitude: t("labels.hopsSecondaryPositiveAttitude", {
    ns: "hops_new",
  }),
  goalSetting: t("labels.hopsSecondaryGoalSetting", {
    ns: "hops_new",
  }),
  goalMotivation: t("labels.hopsSecondaryGoalMotivation", {
    ns: "hops_new",
  }),
  taskCompletion: t("labels.hopsSecondaryTaskCompletion", {
    ns: "hops_new",
  }),
  focusAbility: t("labels.hopsSecondaryFocusAbility", {
    ns: "hops_new",
  }),
  followInstructions: t("labels.hopsSecondaryFollowInstructions", {
    ns: "hops_new",
  }),
  selfAssessment: t("labels.hopsSecondarySelfAssessment", {
    ns: "hops_new",
  }),
  receiveFeedback: t("labels.hopsSecondaryReceiveFeedback", {
    ns: "hops_new",
  }),
  itSkills: t("labels.hopsSecondaryItSkills", {
    ns: "hops_new",
  }),
  independentLearningSkills: t(
    "labels.hopsSecondaryIndependentLearningSkills",
    {
      ns: "hops_new",
    }
  ),
  moreAboutSelfAssessment: t("labels.hopsSecondaryMoreAboutSelfAssessment", {
    ns: "hops_new",
  }),
  whatNext: t("labels.hopsSecondaryPostgraduateSubTitle1", {
    ns: "hops_new",
  }),
  whatNextElse: t("labels.hopsSecondaryWhatNextElse", {
    ns: "hops_new",
  }),
  workExperienceAndInternships: t(
    "labels.hopsSecondaryWorkExperienceAndIntership",
    {
      ns: "hops_new",
    }
  ),
  hobbies: t("labels.hopsSecondaryHobbies", {
    ns: "hops_new",
  }),
  otherSkills: t("labels.hopsSecondaryOtherSkills", {
    ns: "hops_new",
  }),
  skillsFromHobbiesAndWorklife: t(
    "labels.hopsSecondarySkillsFromHobbiesAndWorklife",
    {
      ns: "hops_new",
    }
  ),
  interestedIn: t("labels.hopsSecondaryInterestedIn", {
    ns: "hops_new",
  }),
  goodAt: t("labels.hopsSecondaryAmGood", {
    ns: "hops_new",
  }),
  importantInFutureWork: t("labels.hopsSecondaryImportantInFutureWork", {
    ns: "hops_new",
  }),
  successfulDuringHighSchool: t(
    "labels.hopsSecondarySuccesfullDuringHighSchool",
    {
      ns: "hops_new",
    }
  ),
  challengesDuringHighSchool: t(
    "labels.hopsSecondaryChallangesDuringHighSchool",
    {
      ns: "hops_new",
    }
  ),
  interestedInFieldsOfStudy: t(
    "labels.hopsSecondaryInterestedInFieldsOfStudy",
    {
      ns: "hops_new",
    }
  ),
  whereCanStudyFieldsOfInterest: t(
    "labels.hopsSecondaryWhereCanStudyFieldsOfInterest",
    {
      ns: "hops_new",
    }
  ),
  basisForPostgraduateStudyAndCareerChoice: t(
    "labels.hopsSecondaryBasisForPostgraduateStudyAndCareerChoice",
    {
      ns: "hops_new",
    }
  ),
  thingsMakesYouThink: t("labels.hopsSecondaryThingsMakesYouThink", {
    ns: "hops_new",
  }),
  postGraduateGuidanceCouncelorComments: t(
    "labels.hopsSecondaryPostGraduateGuidanceCouncelorComments",
    {
      ns: "hops_new",
    }
  ),
});

/**
 * Get the edited fields
 * @param oldValues old values
 * @param newValues new values
 * @returns string[]
 */
export const getEditedHopsFields = (
  oldValues: HopsForm,
  newValues: HopsForm
) => {
  let changedValuesComparedToPrevious: string[] = [];

  // Compulsory studies
  if (
    isCompulsoryStudiesHops(oldValues) &&
    isCompulsoryStudiesHops(newValues)
  ) {
    // Get the changed fields by comparing the old and new values
    changedValuesComparedToPrevious = Object.keys(newValues).filter(
      (key: keyof CompulsoryStudiesHops) => {
        if (typeof oldValues[key] !== "object") {
          return oldValues[key] !== newValues[key];
        }
      }
    );

    // Check if the previous language experience has changed
    const previousLanguageExperienceHasChanged = !_.isEqual(
      newValues.previousLanguageExperience,
      oldValues.previousLanguageExperience
    );

    // If the previous language experience has changed, add it to the changed fields
    if (previousLanguageExperienceHasChanged) {
      changedValuesComparedToPrevious.push("previousLanguageExperience");
    }
  }
  // Secondary studies
  else if (
    isSecondaryStudiesHops(oldValues) &&
    isSecondaryStudiesHops(newValues)
  ) {
    // Get the changed fields by comparing the old and new values
    changedValuesComparedToPrevious = Object.keys(newValues).filter(
      (key: keyof SecondaryStudiesHops) => {
        if (typeof oldValues[key] !== "object") {
          return oldValues[key] !== newValues[key];
        }
      }
    );

    // Check if the previous studies have changed
    const previousStudiesHasChanged = !_.isEqual(
      newValues.previousEducations,
      oldValues.previousEducations
    );

    // Check if the what next has changed
    const whatNextHasChanged = !_.isEqual(
      newValues.whatNext,
      oldValues.whatNext
    );

    // If the previous studies have changed, add it to the changed fields
    if (previousStudiesHasChanged) {
      changedValuesComparedToPrevious.push("previousEducations");
    }

    // If the what next has changed, add it to the changed fields
    if (whatNextHasChanged) {
      changedValuesComparedToPrevious.push("whatNext");
    }
  }

  return changedValuesComparedToPrevious;
};
