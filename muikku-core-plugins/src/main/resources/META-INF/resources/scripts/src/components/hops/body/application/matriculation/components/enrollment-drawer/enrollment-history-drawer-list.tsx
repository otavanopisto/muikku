import * as React from "react";
import ApplicationList from "~/components/general/application-list";

/**
 * MatriculationEnrollmentHistoryDrawerProps
 */
interface MatriculationEnrollmentHistoryDrawerProps {
  children?: React.ReactNode;
}

/**
 * MatriculationEnrollmentDrawerList
 * @param props props
 */
const MatriculationEnrollmentDrawerList = (
  props: MatriculationEnrollmentHistoryDrawerProps
) => {
  const { children } = props;

  return <ApplicationList>{children}</ApplicationList>;
};

export default MatriculationEnrollmentDrawerList;
