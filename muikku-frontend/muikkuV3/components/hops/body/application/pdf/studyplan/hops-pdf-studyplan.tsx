import * as React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { StudyActivityItem } from "~/generated/client";
import {
  PeriodCourseItem,
  PlannedCourseWithIdentifier,
  PlannedPeriod,
  PlannerActivityItem,
  StudyPlannerNoteWithIdentifier,
} from "~/reducers/hops";
import { styles } from "../hops-pdf-styles";
import { PdfSectionTitle } from "../hops-pdf-info-field";
import {
  getPeriodMonthNames,
  isPeriodCourseItemPlannedCourse,
  isPeriodCourseItemStudyPlannerNote,
} from "~/components/hops/body/application/study-planing/helper";
import { getHopsPdfPeriodItemDate } from "../hops-pdf-helpers";
import { MANDATORITY_MANDATORY_VALUES } from "~/helper-functions/study-matrix";

/**
 * HopsPdfStudyPlanProps
 */
interface HopsPdfStudyPlanProps {
  pageHeader: React.ReactNode;
  periods: PlannedPeriod[];
  studyActivities: StudyActivityItem[];
  formatCourseLength: (courseLength: number) => string;
}

/**
 * Formats an item date as in the rest of the HOPS PDF.
 *
 * @param date date
 * @returns display string
 */
const formatItemDate = (date: Date): string => moment(date).format("D.M.YYYY");

/**
 * Planned course date, or start–end when duration is set.
 * Same calculation as planner-period-course-base.
 *
 * @param item planned course
 * @param t t
 * @returns display string
 */
const formatPlannedCourseDate = (
  item: PlannedCourseWithIdentifier,
  t: TFunction
): string => {
  const startDate = formatItemDate(new Date(item.startDate));
  if (!item.duration) {
    return t("labels.planned", {
      ns: "common",
      context: "date",
      startDate,
    });
  }
  const calculatedEndDate = formatItemDate(
    new Date(new Date(item.startDate).getTime() + item.duration)
  );
  return t("labels.planned", {
    ns: "common",
    context: "dateRange",
    startDate,
    endDate: calculatedEndDate,
  });
};

/**
 * Study-activity date line, or null when the state has no date label.
 *
 * @param t t
 * @param studyActivity study activity
 * @returns display string or null
 */
const formatStudyActivityDate = (
  t: TFunction,
  studyActivity?: StudyActivityItem | null
): string | null => {
  if (!studyActivity) {
    return null;
  }
  const dateStr = formatItemDate(new Date(studyActivity.date));
  switch (studyActivity.state) {
    case "GRADED":
      return t("studyPlanCardActivity.graded", {
        ns: "hops_new",
        date: dateStr,
      });
    case "ONGOING":
      return t("studyPlanCardActivity.ongoing", {
        ns: "hops_new",
        date: dateStr,
      });
    case "SUPPLEMENTATIONREQUEST":
      return t("studyPlanCardActivity.supplementationRequest", {
        ns: "hops_new",
        date: dateStr,
      });
    default:
      return null;
  }
};

/**
 * Groups period items by calendar month, skipping empty months.
 * Item order inside a month follows the given sorted list.
 *
 * @param period period
 * @param sortedItems items already sorted by date
 * @param studyActivities student study activity
 * @param t t
 * @returns months that have content
 */
const groupPeriodItemsByMonth = (
  period: PlannedPeriod,
  sortedItems: PeriodCourseItem[],
  studyActivities: StudyActivityItem[],
  t: TFunction
): { monthName: string; items: PeriodCourseItem[] }[] => {
  const monthNames = getPeriodMonthNames(period.type, t);
  const monthIndexOffset = period.type === "AUTUMN" ? 7 : 0;
  return monthNames
    .map((monthName, index) => {
      const monthIndex = index + monthIndexOffset;
      const items = sortedItems.filter((item) => {
        const itemDate = getHopsPdfPeriodItemDate(item, studyActivities);
        return itemDate.getMonth() === monthIndex;
      });
      return { monthName, items };
    })
    .filter((month) => month.items.length > 0);
};

/**
 * HopsPdfStudyPlanCourseCardProps
 */
interface HopsPdfStudyPlanCourseCardProps {
  item: PlannedCourseWithIdentifier | PlannerActivityItem;
  studyActivities: StudyActivityItem[];
  formatCourseLength: (courseLength: number) => string;
}

/**
 * Course card in the study-plan PDF (planned or activity-only).
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfStudyPlanCourseCard = (props: HopsPdfStudyPlanCourseCardProps) => {
  const { item, studyActivities, formatCourseLength } = props;
  const { t } = useTranslation(["hops_new", "common"]);

  let title: string;
  let dates: string[] = [];
  let isMandatory: boolean;
  if (isPeriodCourseItemPlannedCourse(item)) {
    const studyActivity = studyActivities.find(
      (activity) =>
        activity.courseNumber === item.courseNumber &&
        activity.subject === item.subjectCode
    );
    title = `${item.subjectCode}${item.courseNumber}  ${item.name}, ${formatCourseLength(item.length)}`;
    isMandatory = item.mandatory;
    dates = [
      formatPlannedCourseDate(item, t),
      formatStudyActivityDate(t, studyActivity),
    ].filter((line): line is string => Boolean(line));
  } else {
    const { course, studyActivity } = item;
    const activityDate = formatStudyActivityDate(t, studyActivity);
    title = `${course.subjectCode}${course.courseNumber}  ${course.name}, ${formatCourseLength(course.length)}`;
    isMandatory = MANDATORITY_MANDATORY_VALUES.includes(course.mandatority);
    dates = activityDate ? [activityDate] : [];
  }
  const typeLabel = t(isMandatory ? "labels.mandatory" : "labels.optional", {
    ns: "common",
  });
  return (
    <View wrap={false} style={styles.periodItem}>
      <View style={styles.periodItemHeader}>
        <Text style={styles.periodItemTitle}>{title}</Text>
        <Text style={styles.periodItemType}>{typeLabel}</Text>
      </View>

      {dates.map((dateLine) => (
        <Text key={dateLine} style={styles.periodItemDate}>
          {dateLine}
        </Text>
      ))}
    </View>
  );
};

/**
 * HopsPdfStudyPlanNoteCardProps
 */
interface HopsPdfStudyPlanNoteCardProps {
  item: StudyPlannerNoteWithIdentifier;
}

/**
 * Note card in the study-plan PDF.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfStudyPlanNoteCard = (props: HopsPdfStudyPlanNoteCardProps) => {
  const { item } = props;
  const dateStr = formatItemDate(new Date(item.startDate));

  return (
    <View wrap={false} style={styles.periodItem}>
      <View style={styles.periodItemHeader}>
        <Text style={styles.periodItemTitle}>{item.title}</Text>
      </View>

      <Text style={styles.periodItemSecondary}>
        {item.content?.trim() ? item.content : "-"}
      </Text>
      <Text style={styles.periodItemDate}>{dateStr}</Text>
    </View>
  );
};

/**
 * Study-plan section of the HOPS PDF.
 * Landscape pages, stacked periods, only periods that have content.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfStudyPlan = (props: HopsPdfStudyPlanProps) => {
  const { pageHeader, periods, studyActivities, formatCourseLength } = props;
  const { t } = useTranslation(["hops_new", "common"]);

  return (
    <Page size="A4" style={styles.body}>
      {pageHeader}
      <Text style={styles.pageTitle}>
        {t("labels.hopsStudyPlanning", { ns: "hops_new" })}
      </Text>
      {periods.length === 0 ? (
        <Text style={styles.empty}>{t("content.empty", { ns: "common" })}</Text>
      ) : (
        periods.map((period) => {
          const title = t(
            period.type === "AUTUMN" ? "labels.autumn" : "labels.spring",
            { ns: "common", year: period.year }
          );
          const sortedItems = [...period.items].sort(
            (itemA, itemB) =>
              getHopsPdfPeriodItemDate(itemA, studyActivities).getTime() -
              getHopsPdfPeriodItemDate(itemB, studyActivities).getTime()
          );

          return (
            <View
              key={`${period.type}-${period.year}`}
              style={styles.periodBlock}
            >
              <PdfSectionTitle>
                {period.isPastPeriod
                  ? `${title} (${t("labels.pastPeriodLabel", { ns: "hops_new" })})`
                  : title}
              </PdfSectionTitle>
              {groupPeriodItemsByMonth(
                period,
                sortedItems,
                studyActivities,
                t
              ).map((month) => (
                <View key={`${period.type}-${period.year}-${month.monthName}`}>
                  <Text style={styles.periodMonthTitle}>{month.monthName}</Text>
                  {month.items.map((item, index) =>
                    isPeriodCourseItemStudyPlannerNote(item) ? (
                      <HopsPdfStudyPlanNoteCard
                        key={`${item.identifier}-${index}`}
                        item={item}
                      />
                    ) : (
                      <HopsPdfStudyPlanCourseCard
                        key={`${item.identifier}-${index}`}
                        item={item}
                        studyActivities={studyActivities}
                        formatCourseLength={formatCourseLength}
                      />
                    )
                  )}
                </View>
              ))}
            </View>
          );
        })
      )}
    </Page>
  );
};

export default HopsPdfStudyPlan;
