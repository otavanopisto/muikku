import * as React from "react";
import ApplicationList from "~/components/general/application-list";

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
