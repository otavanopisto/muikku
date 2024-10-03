import * as React from "react";

/**
 * MatriculationPastEnrollmentListProps
 */
interface MatriculationPastEnrollmentListProps {
  children?: React.ReactNode;
}

/**
 * MatriculationEnrollmentDrawerList
 * @param props props
 */
const MatriculationPastEnrollmentList = (
  props: MatriculationPastEnrollmentListProps
) => {
  const { children } = props;

  return <>{children}</>;
};

export default MatriculationPastEnrollmentList;
