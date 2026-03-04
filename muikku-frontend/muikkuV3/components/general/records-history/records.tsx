import * as React from "react";
import { CourseMatrix, StudyActivity } from "~/generated/client";
import RecordsMatrixView from "./records-matrix-view";
import RecordsActivityView from "./records-activity-view";

/**
 * RecordsViewProps
 */
interface RecordsListingProps {
  courseMatrix: CourseMatrix;
  studyActivity: StudyActivity;
  educationTypeSelector?: React.ReactNode;
}

/**
 * RecordsListing
 * @param props props
 * @returns JSX.Element
 */
const RecordsListing = (props: RecordsListingProps) => {
  const { courseMatrix, studyActivity, educationTypeSelector } = props;

  return (
    <>
      {educationTypeSelector}
      {!courseMatrix.problems.includes("INCOMPATIBLE_STUDENT") ? (
        <RecordsMatrixView
          courseMatrix={courseMatrix}
          studyActivity={studyActivity}
        />
      ) : (
        <RecordsActivityView studyActivity={studyActivity} />
      )}
    </>
  );
};

export default RecordsListing;
