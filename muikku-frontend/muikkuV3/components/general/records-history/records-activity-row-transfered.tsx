import * as React from "react";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "../application-list";
import TransferedCreditIndicator from "./transfered-credit-indicator";
import { StudyActivityItem } from "~/generated/client";
import { suitabilityMapHelper } from "~/@shared/suitability";
import { useTranslation } from "react-i18next";

/**
 * RecordsActivityRowTransferedProps
 */
interface RecordsActivityRowTransferedProps {
  studyActivityItem: StudyActivityItem;
  educationType: string;
}

/**
 * RecordsActivityRowTransfered
 * @param props props
 */
const RecordsActivityRowTransfered = (
  props: RecordsActivityRowTransferedProps
) => {
  const { studyActivityItem, educationType } = props;
  const { t } = useTranslation([
    "studies",
    "evaluation",
    "materials",
    "workspace",
    "common",
  ]);

  /**
   * getSumOfCredits
   * @returns sum of credits
   */
  const getCreditsString = (): string | null => {
    if (!studyActivityItem) return null;

    return `${studyActivityItem.length} ${studyActivityItem.lengthSymbol}`;
  };

  /**
   * Renders mandatority description
   * @returns mandatority description
   */
  const renderMandatorityDescription = () => {
    if (!studyActivityItem.mandatority) return null;

    const OPS = studyActivityItem.curriculums[0];

    const suitabilityMap = suitabilityMapHelper(t);
    const education = `${educationType
      .toLowerCase()
      .replace(/ /g, "")}${OPS.replace(/ /g, "")}`;
    if (!suitabilityMap[education]) return null;
    let localString = suitabilityMap[education][studyActivityItem.mandatority];
    const creditsString = getCreditsString();
    if (creditsString) localString = `${localString}, ${creditsString}`;
    return (
      <div className="label">
        <div className="label__text">{localString} </div>
      </div>
    );
  };

  return (
    <ApplicationListItem className="course course--credits">
      <ApplicationListItemHeader modifiers="course">
        <span className="application-list__header-icon icon-books"></span>
        <div className="application-list__header-primary">
          <div className="application-list__header-primary-title">
            {studyActivityItem.courseName}
          </div>
          <div className="application-list__header-primary-meta application-list__header-primary-meta--records">
            <div className="label">
              <div className="label__text">
                {studyActivityItem.studyProgramme}
              </div>
            </div>
            {studyActivityItem.curriculums?.map((curriculum) => (
              <div key={curriculum} className="label">
                <div className="label__text">{curriculum} </div>
              </div>
            ))}

            {renderMandatorityDescription()}
          </div>
        </div>
        <div className="application-list__header-secondary">
          <TransferedCreditIndicator studyActivityItem={studyActivityItem} />
        </div>
      </ApplicationListItemHeader>
    </ApplicationListItem>
  );
};

export default RecordsActivityRowTransfered;
