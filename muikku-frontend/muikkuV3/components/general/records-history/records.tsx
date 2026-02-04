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
}

/**
 * RecordsListing
 * @param props props
 * @returns JSX.Element
 */
const RecordsListing = (props: RecordsListingProps) => {
  const { courseMatrix, studyActivity } = props;
  if (!courseMatrix.problems.includes("INCOMPATIBLE_STUDENT")) {
    return (
      <RecordsMatrixView
        courseMatrix={courseMatrix}
        studyActivity={studyActivity}
      />
    );
  }
  return <RecordsActivityView studyActivity={studyActivity} />;
};

export default RecordsListing;
