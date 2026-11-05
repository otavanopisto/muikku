import * as React from "react";
import { MatriculationPlan, MatriculationResults } from "~/generated/client";
import {
  MatriculationEligibilityWithAbistatus,
  MatriculationExamWithHistory,
  MatriculationSubjectWithEligibility,
} from "~/reducers/hops";
import HopsPdfMatriculationPlan from "./matriculation/hops-pdf-matriculation-plan";
import HopsPdfMatriculationEligibility from "./matriculation/hops-pdf-matriculation-eligibility";
import HopsPdfMatriculationEnrollment from "./matriculation/hops-pdf-matriculation-enrollment";
import HopsPdfMatriculationHistory from "./matriculation/hops-pdf-matriculation-history";

/**
 * HopsPdfMatriculationProps
 */
interface HopsPdfMatriculationProps {
  pageHeader: React.ReactNode;
  plan: MatriculationPlan | null;
  eligibility: MatriculationEligibilityWithAbistatus | null;
  subjectsWithEligibility: MatriculationSubjectWithEligibility[];
  exams: MatriculationExamWithHistory[];
  pastExams: MatriculationExamWithHistory[];
  results: MatriculationResults[];
}

/**
 * Matriculation part of the HOPS PDF. Each UI tab is its own page.
 * Tab visibility settings come later; PLAN and ELIGIBILITY are always included.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfMatriculation = (props: HopsPdfMatriculationProps) => {
  const {
    pageHeader,
    plan,
    eligibility,
    subjectsWithEligibility,
    exams,
    pastExams,
    results,
  } = props;

  return (
    <>
      <HopsPdfMatriculationPlan pageHeader={pageHeader} plan={plan} />
      <HopsPdfMatriculationEligibility
        pageHeader={pageHeader}
        eligibility={eligibility}
        subjectsWithEligibility={subjectsWithEligibility}
      />
      <HopsPdfMatriculationEnrollment
        pageHeader={pageHeader}
        exams={exams}
        pastExams={pastExams}
      />

      <HopsPdfMatriculationHistory pageHeader={pageHeader} results={results} />
    </>
  );
};

export default HopsPdfMatriculation;
