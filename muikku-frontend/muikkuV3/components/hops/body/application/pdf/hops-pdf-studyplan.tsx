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
} from "~/reducers/hops";
import { styles } from "./hops-pdf-styles";
import { PdfSectionTitle } from "./hops-pdf-info-field";
import {
  getPeriodMonthNames,
  isPeriodCourseItemActivityCourse,
  isPeriodCourseItemPlannedCourse,
  isPeriodCourseItemStudyPlannerNote,
} from "~/components/hops/body/application/study-planing/helper";
import { getHopsPdfPeriodItemDate } from "./hops-pdf-helpers";

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
 * Formats one period item as PDF text.
 *
 * @param item period item
 * @param formatCourseLength length formatter from curriculum strategy
 * @param studyActivities student study activity
 * @param t t
 * @returns primary and optional secondary lines
 */
const getPeriodItemLines = (
  item: PeriodCourseItem,
  formatCourseLength: (courseLength: number) => string,
  studyActivities: StudyActivityItem[],
  t: TFunction
): { primary: string; dates?: string[]; secondary?: string } => {
  const dateStr = formatItemDate(
    getHopsPdfPeriodItemDate(item, studyActivities)
  );
  if (isPeriodCourseItemPlannedCourse(item)) {
    const studyActivity = studyActivities.find(
      (activity) =>
        activity.courseNumber === item.courseNumber &&
        activity.subject === item.subjectCode
    );
    const dates = [
      formatPlannedCourseDate(item, t),
      formatStudyActivityDate(t, studyActivity),
    ].filter((line): line is string => Boolean(line));
    return {
      primary: `${item.subjectCode}${item.courseNumber}  ${item.name}, ${formatCourseLength(item.length)}`,
      dates,
    };
  }
  if (isPeriodCourseItemActivityCourse(item)) {
    const { course, studyActivity } = item;
    const activityDate = formatStudyActivityDate(t, studyActivity);
    return {
      primary: `${course.subjectCode}${course.courseNumber}  ${course.name}, ${formatCourseLength(course.length)}`,
      dates: activityDate ? [activityDate] : undefined,
    };
  }
  if (isPeriodCourseItemStudyPlannerNote(item)) {
    return {
      primary: item.title,
      dates: [dateStr],
      secondary: item.content?.trim() ? item.content : "-",
    };
  }
  return { primary: "-" };
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
    <Page size="A4" orientation="landscape" style={styles.body}>
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
                  {month.items.map((item, index) => {
                    const lines = getPeriodItemLines(
                      item,
                      formatCourseLength,
                      studyActivities,
                      t
                    );
                    return (
                      <View key={`${item.identifier}-${index}`} wrap={false}>
                        <Text style={styles.periodItem}>{lines.primary}</Text>
                        {lines.dates?.map((dateLine) => (
                          <Text
                            key={dateLine}
                            style={styles.periodItemSecondary}
                          >
                            {dateLine}
                          </Text>
                        ))}
                        {lines.secondary ? (
                          <Text style={styles.periodItemSecondary}>
                            {lines.secondary}
                          </Text>
                        ) : null}
                      </View>
                    );
                  })}
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
