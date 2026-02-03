import * as React from "react";
import { CourseMatrix, StudyActivity } from "~/generated/client";
import RecordsMatrixList from "./records-matrix-list";
import RecordsActivityList from "./records-activity-list";

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
      <RecordsMatrixList
        courseMatrix={courseMatrix}
        studyActivity={studyActivity}
      />
    );
  }
  return <RecordsActivityList studyActivity={studyActivity} />;
};

export default RecordsListing;
