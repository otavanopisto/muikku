import * as React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { MatriculationExamWithHistory } from "~/reducers/hops";
import { styles } from "../hops-pdf-styles";
import { PdfSectionTitle } from "../hops-pdf-info-field";
import {
  formatMatriculationEnrollmentStatus,
  formatMatriculationTerm,
  stripHtml,
} from "../hops-pdf-helpers";

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
 * HopsPdfEnrollmentCardProps
 */
interface HopsPdfEnrollmentCardProps {
  exam: MatriculationExamWithHistory;
}
/**
 * Enrollment card used for both current and past exams.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfEnrollmentCard = (props: HopsPdfEnrollmentCardProps) => {
  const { exam } = props;
  const { t } = useTranslation(["hops_new", "common"]);
  const term = formatMatriculationTerm(t, exam.term, exam.year);
  const showConfirmDeadline = exam.confirmDate && exam.confirmDate > exam.ends;
  const rows: { label: string; value: string }[] = [
    {
      label: stripHtml(
        t("content.matriculationEnrollmentDone", {
          ns: "hops_new",
          term: term.toLowerCase(),
        }) + ":"
      ),
      value: formatPdfDate(exam.enrollment?.enrollmentDate),
    },
    {
      label: t(
        showConfirmDeadline
          ? "labels.matriculationEnrollmentDeadline"
          : "labels.matriculationEnrollmentCloses",
        { ns: "hops_new" }
      ),
      value: formatPdfDate(showConfirmDeadline ? exam.confirmDate : exam.ends),
    },
    {
      label: t("labels.matriculationEnrollmentStatus", { ns: "hops_new" }),
      value: formatMatriculationEnrollmentStatus(t, exam.studentStatus),
    },
  ];
  return (
    <View wrap={false} style={styles.enrollmentCard}>
      <Text style={styles.enrollmentCardTitle}>{term}</Text>
      {rows.map((row) => (
        <View key={row.label} style={styles.enrollmentCardRow}>
          <Text style={styles.enrollmentCardLabel}>{row.label}</Text>
          <Text style={styles.enrollmentCardValue}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
};

/**
 * HopsPdfMatriculationEnrollmentProps
 */
interface HopsPdfMatriculationEnrollmentProps {
  pageHeader: React.ReactNode;
  exams: MatriculationExamWithHistory[];
  pastExams: MatriculationExamWithHistory[];
}

/**
 * Matriculation ENROLLMENT tab as its own PDF page.
 * Same layout as matriculation-enrollment.tsx. Forms and change logs omitted.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfMatriculationEnrollment = (
  props: HopsPdfMatriculationEnrollmentProps
) => {
  const { pageHeader, exams, pastExams } = props;
  const { t } = useTranslation(["hops_new", "common"]);
  const currentExam = exams[0];

  return (
    <Page style={styles.body} size="A4">
      {pageHeader}
      <Text style={styles.pageTitle}>
        {t("labels.matriculationEnrollment", {
          ns: "hops_new",
          context: "title",
        })}
      </Text>
      {currentExam ? (
        <HopsPdfEnrollmentCard exam={currentExam} />
      ) : (
        <Text style={styles.empty}>
          {t("content.matriculationNoActiveEnrollment", { ns: "hops_new" })}
        </Text>
      )}

      <PdfSectionTitle>
        {t("labels.matriculationEnrollmentHistory", { ns: "hops_new" })}
      </PdfSectionTitle>
      {pastExams.length === 0 ? (
        <Text style={styles.empty}>{t("content.empty", { ns: "common" })}</Text>
      ) : (
        pastExams.map((exam) => (
          <HopsPdfEnrollmentCard key={exam.id} exam={exam} />
        ))
      )}
    </Page>
  );
};

export default HopsPdfMatriculationEnrollment;
