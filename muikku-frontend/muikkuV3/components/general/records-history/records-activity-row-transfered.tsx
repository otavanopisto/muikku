import * as React from "react";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "../application-list";
import TransferedCreditIndicator from "./transfered-credit-indicator";
import { StudyActivityItem } from "~/generated/client";
import {
  suitabilityMapHelper,
  suitabilityMapHelperWithoutOPS,
} from "~/@shared/suitability";
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
    // Get first OPS from curriculums there should be only one OPS per workspace
    // Some old workspaces might have multiple OPS, but that is rare case
    const OPS = studyActivityItem.curriculums?.[0];

    // Mandatority exist and...
    if (studyActivityItem.mandatority) {
      // If OPS data is present
      if (OPS) {
        const suitabilityMap = suitabilityMapHelper(t);

        // Create map property from education type name and OPS name that was passed
        // Strings are changes to lowercase form and any empty spaces are removed
        const education = `${educationType
          .toLowerCase()
          .replace(/ /g, "")}${OPS.replace(/ /g, "")}`;

        // Check if our map contains data with just created education string
        // Otherwise just return null. There might not be all included values by every OPS created...
        if (!suitabilityMap[education]) {
          return null;
        }

        // Then get correct local string from map by suitability enum value
        let localString =
          suitabilityMap[education][studyActivityItem.mandatority];

        const sumOfCredits = getCreditsString();

        // If there is sum of credits, return it with local string
        if (sumOfCredits) {
          localString = `${localString}, ${sumOfCredits}`;
        }

        return (
          <div className="label">
            <div className="label__text">{localString} </div>
          </div>
        );
      }

      // If OPS data is not present, use suitability map without OPS
      // Then options for localization are "mandatory" and "optional"
      const suitabilityMapWithoutOPS = suitabilityMapHelperWithoutOPS(t);

      let localString = suitabilityMapWithoutOPS[studyActivityItem.mandatority];

      const sumOfCredits = getCreditsString();

      if (sumOfCredits) {
        localString = `${localString}, ${sumOfCredits}`;
      }

      return (
        <div className="label">
          <div className="label__text">{localString}</div>
        </div>
      );
    }
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
