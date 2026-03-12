import * as React from "react";
import RecordsMatrixView from "./records-matrix-view";
import RecordsActivityView from "./records-activity-view";
import {
  RecordsInfo,
  RecordsInfoProvider,
} from "./context/records-info-context";
import { useTranslation } from "react-i18next";

/**
 * RecordsViewProps
 */
interface RecordsListingProps {
  /**
   * Records data related to the records listing
   */
  recordsInfo: RecordsInfo;
  /**
   * Education type selector
   */
  educationTypeSelector?: React.ReactNode;
  /**
   * Empty message to override the default one
   */
  emptyMessage?: string;
}

/**
 * RecordsListing
 * @param props props
 * @returns JSX.Element
 */
const RecordsListing = (props: RecordsListingProps) => {
  const { recordsInfo, educationTypeSelector, emptyMessage } = props;
  const { courseMatrix, studyActivity, curriculumConfig } = recordsInfo;
  const { t } = useTranslation(["studies"]);

  if (!studyActivity || !courseMatrix || !curriculumConfig) {
    return (
      <div className="application-sub-panel__item">
        <div className="empty">
          <span>
            {emptyMessage ||
              t("content.empty", {
                ns: "studies",
                context: "workspaces",
              })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <RecordsInfoProvider value={recordsInfo}>
      {educationTypeSelector}
      {!courseMatrix.problems.includes("INCOMPATIBLE_STUDENT") ? (
        <RecordsMatrixView />
      ) : (
        <RecordsActivityView />
      )}
    </RecordsInfoProvider>
  );
};

export default RecordsListing;
