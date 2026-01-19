import * as React from "react";
import { localize } from "~/locales/i18n";
import { getShortenGradeExtension, shortenGrade } from "~/util/modifiers";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import { StudyActivityItem } from "~/generated/client";

/**
 * AssessmentProps
 */
interface RecordsAssessmentIndicatorNewProps {
  studyActivityItem?: StudyActivityItem;
  isCombinationWorkspace: boolean;
}

/**
 * Creates component that shows assessment
 * @param props Component props
 * @returns JSX.Element
 */
const RecordsAssessmentIndicatorNew: React.FC<
  RecordsAssessmentIndicatorNewProps
> = (props) => {
  const { studyActivityItem, isCombinationWorkspace } = props;

  const { t } = useTranslation(["studies", "common"]);

  if (!studyActivityItem) {
    return null;
  }

  // We can have situation where course module has PASSED assessment and also it's state is INCOMPLETE
  // as it has been evaluated as incomplete after evaluated as PASSED
  if (
    studyActivityItem.grade &&
    studyActivityItem.gradeDate &&
    studyActivityItem.state !== "SUPPLEMENTATIONREQUEST"
  ) {
    return (
      <Dropdown
        openByHover
        content={
          <span>
            {t("labels.evaluated", {
              ns: "studies",
              date: localize.date(studyActivityItem.gradeDate),
            }) + getShortenGradeExtension(studyActivityItem.grade)}
          </span>
        }
      >
        <span
          className={`application-list__indicator-badge application-list__indicator-badge--course ${
            studyActivityItem.passing ? "state-PASSED" : "state-FAILED"
          }`}
        >
          {shortenGrade(studyActivityItem.grade)}
        </span>
      </Dropdown>
    );
  } else if (studyActivityItem.state === "SUPPLEMENTATIONREQUEST") {
    const status =
      studyActivityItem.state === "SUPPLEMENTATIONREQUEST"
        ? t("labels.incomplete", {
            ns: "workspace",
          })
        : t("labels.failed", {
            ns: "workspace",
          });
    return (
      <Dropdown
        openByHover
        content={
          <span>
            {t("labels.evaluated", {
              ns: "studies",
              date: localize.date(studyActivityItem.date),
            }) +
              " - " +
              status}
          </span>
        }
      >
        <span
          className={`application-list__indicator-badge application-list__indicator-badge--course ${
            studyActivityItem.state === "SUPPLEMENTATIONREQUEST"
              ? "state-INCOMPLETE"
              : "state-FAILED"
          }`}
        >
          {status[0].toLocaleUpperCase()}
        </span>
      </Dropdown>
    );
  } else {
    if (isCombinationWorkspace) {
      return (
        <Dropdown
          openByHover
          content={
            <span>
              {studyActivityItem.grade && studyActivityItem.gradeDate
                ? t("labels.evaluated", {
                    ns: "studies",
                    date: localize.date(studyActivityItem.gradeDate),
                  }) + getShortenGradeExtension(studyActivityItem.grade)
                : t("content.notEvaluated", {
                    ns: "studies",
                  })}
            </span>
          }
        >
          <span
            className={`application-list__indicator-badge application-list__indicator-badge--course ${
              studyActivityItem.state === "ONGOING" ? "state-UNASSESSED" : ""
            }`}
          >
            -
          </span>
        </Dropdown>
      );
    }
  }

  return null;
};

export default RecordsAssessmentIndicatorNew;
