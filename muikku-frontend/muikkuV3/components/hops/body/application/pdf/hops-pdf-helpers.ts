import { TFunction } from "i18next";
import { Education, LanguageGradeEnum } from "~/@types/shared";
import { StudyActivityItem } from "~/generated/client";
import {
  PlannedCourseWithIdentifier,
  PlannedPeriod,
  StudentDateInfo,
  StudyPlannerNoteWithIdentifier,
} from "~/reducers/hops";
import { CurriculumStrategy } from "~/util/curriculum-config";
import { PeriodCourseItem } from "~/reducers/hops";
import {
  createAndAllocateCoursesToPeriods,
  isPeriodCourseItemActivityCourse,
  isPeriodCourseItemPlannedCourse,
  isPeriodCourseItemStudyPlannerNote,
} from "~/components/hops/body/application/study-planing/helper";

/**
 * Formats an optional scalar as PDF text.
 *
 * @param value value
 * @returns display string
 */
export const displayText = (value?: string | number | null): string => {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  return String(value);
};

/**
 * Formats a 1-5 self-assessment scale value.
 *
 * @param t t
 * @param value value
 * @returns display string
 */
export const formatScaleValue = (t: TFunction, value?: number): string => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "-";
  }

  if (value < 1 || value > 5) {
    return String(value);
  }

  return t(`labels.hopsFormSelfAssessmentLevel${value}_description`, {
    ns: "hops_new",
    defaultValue: String(value),
  });
};

/**
 * Formats a compulsory language grade.
 *
 * @param t t
 * @param grade grade
 * @returns display string
 */
export const formatLanguageGrade = (
  t: TFunction,
  grade?: LanguageGradeEnum
): string => {
  switch (grade) {
    case LanguageGradeEnum.NATIVE_LANGUAGE:
      return t("labels.hopsCompulsoryLanguageTableSkillLevel1", {
        ns: "hops_new",
      });
    case LanguageGradeEnum.EXCELLENT:
      return t("labels.hopsCompulsoryLanguageTableSkillLevel2", {
        ns: "hops_new",
      });
    case LanguageGradeEnum.GOOD:
      return t("labels.hopsCompulsoryLanguageTableSkillLevel3", {
        ns: "hops_new",
      });
    case LanguageGradeEnum.SATISFYING:
      return t("labels.hopsCompulsoryLanguageTableSkillLevel4", {
        ns: "hops_new",
      });
    case LanguageGradeEnum.NOT_STUDIED:
      return t("labels.hopsCompulsoryLanguageTableSkillLevel5", {
        ns: "hops_new",
      });
    default:
      return "-";
  }
};

/**
 * Formats compulsory previous education.
 *
 * @param t t
 * @param value stored value
 * @returns display string
 */
export const formatPreviousEducation = (
  t: TFunction,
  value?: string
): string => {
  switch (value) {
    case Education.COMPULSORY_SCHOOL:
      return t("labels.hopsCompulsoryPreviousEducationOption1", {
        ns: "hops_new",
      });
    case Education.VOCATIONAL_SCHOOL:
    case "VOCATIONAL_SCHOOL":
      return t("labels.hopsCompulsoryPreviousEducationOption2", {
        ns: "hops_new",
      });
    case Education.NO_PREVIOUS_EDUCATION:
      return t("labels.hopsCompulsoryPreviousEducationOption3", {
        ns: "hops_new",
      });
    case Education.SOMETHING_ELSE:
      return t("labels.hopsCompulsoryPreviousEducationOption4", {
        ns: "hops_new",
      });
    default:
      return displayText(value);
  }
};

/**
 * Formats compulsory work-experience range.
 *
 * @param t t
 * @param value stored value
 * @returns display string
 */
export const formatWorkExperience = (t: TFunction, value?: string): string => {
  switch (value) {
    case "0-5":
      return t("labels.hopsCompulsoryPreviousWorkExperienceOption1", {
        ns: "hops_new",
      });
    case "6-10":
      return t("labels.hopsCompulsoryPreviousWorkExperienceOption2", {
        ns: "hops_new",
      });
    case "11-15":
      return t("labels.hopsCompulsoryPreviousWorkExperienceOption3", {
        ns: "hops_new",
      });
    case ">16":
      return t("labels.hopsCompulsoryPreviousWorkExperienceOption4", {
        ns: "hops_new",
      });
    default:
      return displayText(value);
  }
};

/**
 * Formats secondary previous-study type.
 *
 * @param t t
 * @param value stored value
 * @returns display string
 */
export const formatPreviousStudyType = (
  t: TFunction,
  value?: string
): string => {
  switch (value) {
    case "upper_secondary_education":
      return t("labels.hopsSecondaryPreviousEducationStudyTypeOption1", {
        ns: "hops_new",
      });
    case "vocational_studies":
      return t("labels.hopsSecondaryPreviousEducationStudyTypeOption2", {
        ns: "hops_new",
      });
    case "other_studies":
      return t("labels.hopsSecondaryPreviousEducationStudyTypeOption3", {
        ns: "hops_new",
      });
    default:
      return displayText(value);
  }
};

/**
 * Formats secondary previous-study duration.
 *
 * @param t t
 * @param value stored value
 * @returns display string
 */
export const formatPreviousStudyDuration = (
  t: TFunction,
  value?: string
): string => {
  switch (value) {
    case "<1":
      return t("labels.hopsSecondaryPreviousEducationStudyDurationOption1", {
        ns: "hops_new",
      });
    case "1-2":
      return t("labels.hopsSecondaryPreviousEducationStudyDurationOption2", {
        ns: "hops_new",
      });
    case "2-3":
      return t("labels.hopsSecondaryPreviousEducationStudyDurationOption3", {
        ns: "hops_new",
      });
    case "3-4":
      return t("labels.hopsSecondaryPreviousEducationStudyDurationOption4", {
        ns: "hops_new",
      });
    case ">4":
      return t("labels.hopsSecondaryPreviousEducationStudyDurationOption5", {
        ns: "hops_new",
      });
    default:
      return displayText(value);
  }
};

/**
 * Formats a what-next choice.
 *
 * @param t t
 * @param value stored value
 * @returns display string
 */
export const formatWhatNext = (t: TFunction, value?: string): string => {
  switch (value) {
    case "WORKING_LIFE":
      return t("labels.hopsFormPostgraduateWhatNextOption1", {
        ns: "hops_new",
      });
    case "POSTGRADUATE_STUDIES":
      return t("labels.hopsFormPostgraduateWhatNextOption2", {
        ns: "hops_new",
      });
    case "ELSE":
      return t("labels.hopsFormPostgraduateWhatNextOption3", {
        ns: "hops_new",
      });
    case "DONT_KNOW":
      return t("labels.hopsFormPostgraduateWhatNextOption4", {
        ns: "hops_new",
      });
    default:
      return displayText(value);
  }
};

/**
 * Formats a postgraduate-studies choice.
 *
 * @param t t
 * @param value stored value
 * @returns display string
 */
export const formatPostGraduateStudies = (
  t: TFunction,
  value?: string
): string => {
  switch (value) {
    case "APPRENTICESHIP_TRAINING":
      return t("labels.hopsFormPostgraduateStudiesOption1", {
        ns: "hops_new",
      });
    case "VOCATIONAL_SCHOOL":
      return t("labels.hopsFormPostgraduateStudiesOption2", {
        ns: "hops_new",
      });
    case "UPPER_SECONDARY_SCHOOL":
      return t("labels.hopsFormPostgraduateStudiesOption3", {
        ns: "hops_new",
      });
    case "UNIVERSITY":
      return t("labels.hopsFormPostgraduateStudiesOption4", {
        ns: "hops_new",
      });
    case "UNIVERSITY_OF_APPLIED_SCIENCES":
      return t("labels.hopsFormPostgraduateStudiesOption5", {
        ns: "hops_new",
      });
    case "ELSE":
      return t("labels.hopsFormPostgraduateStudiesOption6", {
        ns: "hops_new",
      });
    default:
      return displayText(value);
  }
};

/**
 * Formats a vocational study sector.
 *
 * @param t t
 * @param value stored value
 * @returns display string
 */
export const formatVocationalStudySector = (
  t: TFunction,
  value?: string
): string => {
  switch (value) {
    case "SOCIAL_HEALT_SECTOR":
      return t("labels.hopsFormStudySectorSocialAndHealth", {
        ns: "hops_new",
      });
    case "TRADE_SECTOR":
      return t("labels.hopsFormStudySectorTrade", { ns: "hops_new" });
    case "TRANSPORT_SECTOR":
      return t("labels.hopsFormStudySectorTransport", { ns: "hops_new" });
    case "EDUCATION_SECTOR":
      return t("labels.hopsFormStudySectorEducation", { ns: "hops_new" });
    case "INDUSTRY_SECTOR":
      return t("labels.hopsFormStudySectorIndustry", { ns: "hops_new" });
    case "ART_SECTOR":
      return t("labels.hopsFormStudySectorArts", { ns: "hops_new" });
    case "SOMETHING_ELSE":
      return t("labels.hopsFormStudySectorElse", { ns: "hops_new" });
    default:
      return displayText(value);
  }
};

/**
 * Formats a matriculation subject name from its YTL code.
 *
 * @param t t
 * @param code YTL subject code stored on the plan
 * @returns display string
 */
export const formatMatriculationSubjectName = (
  t: TFunction,
  code?: string
): string => {
  if (!code) {
    return "-";
  }

  return t(`matriculationSubjectsYTL.${code}`, {
    ns: "hops_new",
    defaultValue: code,
  });
};

/**
 * Formats a matriculation exam term.
 *
 * @param t t
 * @param term AUTUMN or SPRING
 * @param year year
 * @returns display string
 */
export const formatMatriculationTerm = (
  t: TFunction,
  term?: string,
  year?: number
): string => {
  if (!term || !year) {
    return "-";
  }

  return t(`matriculationTerms.${term}`, {
    ns: "hops_new",
    year,
    defaultValue: term,
  });
};

/**
 * Params for building study-plan periods for the HOPS PDF.
 */
export interface GetHopsPdfStudyPlanPeriodsParams {
  studyProgramName: string;
  studentDateInfo: StudentDateInfo;
  studyActivities: StudyActivityItem[];
  plannedCourses: PlannedCourseWithIdentifier[];
  planNotes: StudyPlannerNoteWithIdentifier[];
  curriculumStrategy: CurriculumStrategy;
}

/**
 * Builds planner periods and keeps only those that have courses or notes.
 * Past periods are included when they have content.
 *
 * @param params params
 * @returns periods with content
 */
export const getHopsPdfStudyPlanPeriods = (
  params: GetHopsPdfStudyPlanPeriodsParams
): PlannedPeriod[] => {
  const {
    studyProgramName,
    studentDateInfo,
    studyActivities,
    plannedCourses,
    planNotes,
    curriculumStrategy,
  } = params;

  if (
    !studentDateInfo.studyStartDate ||
    Number.isNaN(studentDateInfo.studyStartDate.getTime())
  ) {
    return [];
  }

  return createAndAllocateCoursesToPeriods(
    studyProgramName,
    studentDateInfo,
    studyActivities,
    plannedCourses,
    planNotes,
    curriculumStrategy
  ).filter((period) => period.items.length > 0);
};

/**
 * Date used to place a planner item in a period month.
 * Matches study-plan-tool: graded/supplementation activity date
 * overrides a planned course start date.
 *
 * @param item period item
 * @param studyActivities student study activity
 * @returns date
 */
export const getHopsPdfPeriodItemDate = (
  item: PeriodCourseItem,
  studyActivities: StudyActivityItem[]
): Date => {
  if (isPeriodCourseItemPlannedCourse(item)) {
    const studyActivity = studyActivities.find(
      (activity) =>
        activity.courseNumber === item.courseNumber &&
        activity.subject === item.subjectCode
    );
    const useStudyActivityDate =
      studyActivity &&
      (studyActivity.state === "GRADED" ||
        studyActivity.state === "SUPPLEMENTATIONREQUEST");

    return useStudyActivityDate
      ? new Date(studyActivity.date)
      : new Date(item.startDate);
  }

  if (isPeriodCourseItemActivityCourse(item)) {
    return new Date(item.studyActivity.date);
  }

  if (isPeriodCourseItemStudyPlannerNote(item)) {
    return new Date(item.startDate);
  }

  return new Date(0);
};
