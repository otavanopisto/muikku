import {
  AbsenceEventEnum,
  AbsenceReasonEnum,
} from "~/reducers/base/muikku-events";
import { MuikkuEvent } from "~/generated/client";
import i18n from "~/locales/i18n";

const { t } = i18n;

/**
 * Returns the absent from label
 * @param event MuikkuEvent
 * @returns string
 */
export const absentFromLabel = (event: MuikkuEvent) => {
  switch (event.title as AbsenceEventEnum) {
    case AbsenceEventEnum.Lesson:
      return t("types.LESSON", {
        ns: "events",
      });
    case AbsenceEventEnum.LessonPreArranged:
      return t("types.LESSON_PRE_ARRANGED", {
        ns: "events",
      });
    case AbsenceEventEnum.Exam:
      return t("types.EXAM", {
        ns: "events",
      });
    case AbsenceEventEnum.SkillsDemonstrationMeeting:
      return t("types.SKILLS_DEMONSTRATION_MEETING", {
        ns: "events",
      });
    case AbsenceEventEnum.GroupMeeting:
      return t("types.GROUP_MEETING", {
        ns: "events",
      });
    case AbsenceEventEnum.GroupMeetingPreArranged:
      return t("types.GROUP_MEETING_PRE_ARRANGED", {
        ns: "events",
      });
    case AbsenceEventEnum.AssignmentsUndone:
      return t("types.ASSIGNMENTS_UNDONE", {
        ns: "events",
      });
    case AbsenceEventEnum.GuidanceOrSupportSession:
      return t("types.GUIDANCE_OR_SUPPORT_SESSION", {
        ns: "events",
      });
  }
};

/**
 * Returns the absence reason value label
 * @param value absence reason value
 * @returns string
 */
export const absenceReasonLabel = (value: string) => {
  switch (value as AbsenceReasonEnum) {
    case AbsenceReasonEnum.Medical:
      return t("reasons.MEDICAL_REASON", { ns: "events" });
    case AbsenceReasonEnum.OtherAuthorized:
      return t("reasons.OTHER_AUTHORIZED_REASON", { ns: "events" });
    case AbsenceReasonEnum.UnauthorizedExplained:
      return t("reasons.UNAUTHORIZED_ABSENCE_EXPLAINED", { ns: "events" });
  }
};

/**
 * A class abstraction for absence event range
 * @param beginMonthsFromDate date range start in months from now
 * @param endMonthsFromDate date range end in months from now
 * @returns AbsenceEventDateRange
 */
export class AbsenceEventDateRange {
  private beginMonthsFromDate: number;
  private endMonthsFromDate: number;

  /**
   * Constructor
   * @param beginMonthsFromDate number of months from now
   * @param endMonthsFromDate number of months from now
   */
  constructor(beginMonthsFromDate = 12, endMonthsFromDate = 6) {
    this.beginMonthsFromDate = beginMonthsFromDate;
    this.endMonthsFromDate = endMonthsFromDate;
  }
  /**
   * Get start date
   * @returns start date
   */
  public getStartDate(): Date {
    const start = new Date();
    start.setMonth(start.getMonth() - this.beginMonthsFromDate);
    return start;
  }

  /**
   * Get end date
   * @returns end date
   */
  public getEndDate(): Date {
    const end = new Date();
    end.setMonth(end.getMonth() + this.endMonthsFromDate);
    return end;
  }
}
