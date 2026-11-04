import * as React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { MatriculationPlan } from "~/generated/client";
import { styles } from "./hops-pdf-styles";
import { PdfInfoField, PdfSectionTitle } from "./hops-pdf-info-field";
import {
  formatMatriculationSubjectName,
  formatMatriculationTerm,
} from "./hops-pdf-helpers";

/**
 * HopsPdfMatriculationProps
 */
interface HopsPdfMatriculationProps {
  pageHeader: React.ReactNode;
  plan: MatriculationPlan | null;
}

/**
 * Matriculation plan section of the HOPS PDF.
 * Enrollment, history and eligibility are intentionally omitted.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfMatriculation = (props: HopsPdfMatriculationProps) => {
  const { pageHeader, plan } = props;
  const { t } = useTranslation(["hops_new", "common"]);

  const plannedSubjects = (plan?.plannedSubjects || []).filter(
    (subject) => subject.subject
  );

  return (
    <Page style={styles.body} size="A4">
      {pageHeader}
      <Text style={styles.pageTitle}>
        {t("labels.hopsMatriculation", { ns: "hops_new" })}
      </Text>
      {!plan ? (
        <Text style={styles.empty}>{t("content.empty", { ns: "common" })}</Text>
      ) : (
        <View>
          <PdfSectionTitle>
            {t("labels.matriculationPlan", {
              ns: "hops_new",
              context: "title",
            })}
          </PdfSectionTitle>
          <PdfInfoField
            label={t("content.matriculationPlanTarget", { ns: "hops_new" })}
            value={
              plan.goalMatriculationExam
                ? t("labels.yes", { ns: "common" })
                : t("labels.no", { ns: "common" })
            }
          />

          <PdfSectionTitle>
            {t("content.matriculationPlanSubjectGoal", { ns: "hops_new" })}
          </PdfSectionTitle>
          {plannedSubjects.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRow} wrap={false}>
                <Text style={styles.tableHeaderCell}>
                  {t("labels.matriculationSubject", { ns: "hops_new" })}
                </Text>
                <Text style={styles.tableHeaderCell}>
                  {t("labels.matriculationExamTerm", { ns: "hops_new" })}
                </Text>
              </View>
              {plannedSubjects.map((subject, index) => (
                <View
                  key={`${subject.subject}-${index}`}
                  style={styles.tableRow}
                  wrap={false}
                >
                  <Text style={styles.tableCell}>
                    {formatMatriculationSubjectName(t, subject.subject)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatMatriculationTerm(t, subject.term, subject.year)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.empty}>-</Text>
          )}
        </View>
      )}
    </Page>
  );
};

export default HopsPdfMatriculation;
