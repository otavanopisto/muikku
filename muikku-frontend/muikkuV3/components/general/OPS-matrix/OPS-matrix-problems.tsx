import * as React from "react";
import { useTranslation } from "react-i18next";
import { CourseMatrixProblem, CourseMatrixType } from "~/generated/client";

/**
 * Props for the OPSMatrixProblems component
 */
interface OPSMatrixProblemsProps {
  matrixType: CourseMatrixType;
  matrixProblems: CourseMatrixProblem[];
}

/**
 * OPSMatrixProblems component - Displays a list of problems in the course matrix
 * @param props - Component props
 * @returns Rendered list of problems
 */
const OPSMatrixProblems = (props: OPSMatrixProblemsProps) => {
  const { matrixProblems } = props;

  const { t } = useTranslation(["studyMatrix"]);

  /**
   * Renders a matrix problem based on the type of problem
   * @param problemType - The type of problem to render
   * @returns The rendered problem
   */
  const renderProblem = (problemType: CourseMatrixProblem) => {
    let problemContent = null;

    switch (problemType) {
      case "INCOMPATIBLE_STUDENT":
        problemContent = t("problems.incompatibleStudent", {
          ns: "studyMatrix",
        });
        break;

      case "NO_MATH":
        problemContent = t("problems.noMath", { ns: "studyMatrix" });
        break;

      case "NO_NATIVE_LANGUAGE":
        problemContent = t("problems.noNativeLanguage", { ns: "studyMatrix" });
        break;
      case "NO_PRIMARY_FOREIGN_LANGUAGE":
        problemContent = t("problems.noPrimaryForeignLanguage", {
          ns: "studyMatrix",
        });
        break;
      case "NO_SECONDARY_FOREIGN_LANGUAGE":
        problemContent = t("problems.noSecondaryForeignLanguage", {
          ns: "studyMatrix",
        });
        break;
      case "NO_RELIGION":
        problemContent = t("problems.noReligion", { ns: "studyMatrix" });
        break;
      default:
        problemContent = "Unknown problem";
        break;
    }

    return (
      <li key={problemType} className="matrix-problems__list-item">
        {problemContent}
      </li>
    );
  };

  if (matrixProblems.length === 0) {
    return null;
  }

  return (
    <div className="matrix-problems">
      <div className="matrix-problems__message">
        {t("content.problemsExist", {
          ns: "studyMatrix",
        })}
      </div>
      <ul className="matrix-problems__list">
        {matrixProblems.map(renderProblem)}
      </ul>
    </div>
  );
};

export default OPSMatrixProblems;
