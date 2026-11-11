import * as React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { MatriculationResults } from "~/generated/client";
import { styles } from "../hops-pdf-styles";
import { PdfGuideText } from "../hops-pdf-info-field";
import { formatMatriculationExamGrade } from "../hops-pdf-helpers";

/**
 * HopsPdfMatriculationHistoryProps
 */
interface HopsPdfMatriculationHistoryProps {
  pageHeader: React.ReactNode;
  results: MatriculationResults[];
}

/**
 * Formats a PDF date.
 *
 * @param value date
 * @returns display string
 */
const formatPdfDate = (value?: Date | string | null): string => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return moment(date).format("D.M.YYYY");
};

/**
 * Grade letter legend for the history PDF page.
 *
 * @returns JSX.Element
 */
const HopsPdfHistoryGradeLegend = () => {
  const { t } = useTranslation(["hops_new", "common"]);
  const items: { code?: string; name: string }[] = [
    { code: "L", name: "laudatur" },
    { code: "E", name: "eximia cum laude approbatur" },
    { code: "M", name: "magna cum laude approbatur" },
    { code: "C", name: "cum laude approbatur" },
    { code: "B", name: "lubenter approbatur" },
    { code: "A", name: "approbatur" },
    { code: "I", name: t("matriculationGrades.I", { ns: "hops_new" }) },
    { code: "K", name: t("matriculationGrades.K", { ns: "hops_new" }) },
    {
      code: "EO",
      name: t("matriculationGrades.NO_RIGHT_TO_PARTICIPATE", {
        ns: "hops_new",
      }),
    },
    { name: t("matriculationGrades.INVALIDATED", { ns: "hops_new" }) },
    { name: t("matriculationGrades.UNKNOWN", { ns: "hops_new" }) },
  ];

  return (
    <View wrap={false} style={styles.gradeLegend}>
      {items.map((item) => (
        <View key={item.code || item.name} style={styles.gradeLegendItem}>
          {item.code ? (
            <>
              <Text style={styles.gradeLegendCode}>{item.code}</Text>
              <Text style={styles.gradeLegendCode}>=</Text>
            </>
          ) : null}
          <Text style={styles.gradeLegendName}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

/**
 * HopsPdfHistoryResultCardProps
 */
interface HopsPdfHistoryResultCardProps {
  result: MatriculationResults;
}

/**
 * One subject's exam results.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfHistoryResultCard = (props: HopsPdfHistoryResultCardProps) => {
  const { result } = props;
  const { t } = useTranslation(["hops_new", "common"]);
  const subjectName = t(`subjects.${result.subjectCode}`, {
    ns: "common",
    defaultValue: result.subjectCode,
  });

  return (
    <View wrap={false} style={styles.enrollmentCard}>
      <Text style={styles.enrollmentCardTitle}>{subjectName}</Text>
      {result.grades.map((gradeResult, index) => {
        const points = gradeResult.totalPoints
          ? t("labels.totalPoints", {
              ns: "hops_new",
              points: gradeResult.totalPoints,
            })
          : null;

        return (
          <View
            key={`${result.subjectCode}-${index}`}
            style={styles.enrollmentCardRow}
          >
            <Text style={styles.enrollmentCardLabel}>
              {formatPdfDate(gradeResult.gradeDate)}
            </Text>
            <Text style={styles.enrollmentCardValue}>
              {`${t("labels.grade", { ns: "hops_new" })} ${formatMatriculationExamGrade(t, gradeResult.grade)}${points ? `  ${points}` : ""}`}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

/**
 * Matriculation HISTORY tab as its own PDF page.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfMatriculationHistory = (
  props: HopsPdfMatriculationHistoryProps
) => {
  const { pageHeader, results } = props;
  const { t } = useTranslation(["hops_new", "common"]);

  return (
    <Page style={styles.body} size="A4">
      {pageHeader}
      <Text style={styles.pageTitle}>
        {t("labels.matriculationHistory", {
          ns: "hops_new",
          context: "title",
        })}
      </Text>
      <PdfGuideText>
        {results.length === 0
          ? t("content.matriculationHistoryEmpty", { ns: "hops_new" })
          : t("content.matriculationHistoryGuides1", { ns: "hops_new" })}
      </PdfGuideText>
      <PdfGuideText>
        {t("content.matriculationHistoryGuides2", { ns: "hops_new" })}
      </PdfGuideText>
      <HopsPdfHistoryGradeLegend />
      {results.map((result) => (
        <HopsPdfHistoryResultCard key={result.subjectCode} result={result} />
      ))}
    </Page>
  );
};

export default HopsPdfMatriculationHistory;
