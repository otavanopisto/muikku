import * as React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import {
  MatriculationEligibilityWithAbistatus,
  MatriculationSubjectWithEligibility,
} from "~/reducers/hops";
import { styles } from "../hops-pdf-styles";
import {
  PdfEligibilityRow,
  PdfGuideText,
  PdfSectionTitle,
} from "../hops-pdf-info-field";
import { formatMatriculationSubjectName } from "../hops-pdf-helpers";

/**
 * HopsPdfMatriculationEligibilityProps
 */
interface HopsPdfMatriculationEligibilityProps {
  pageHeader: React.ReactNode;
  eligibility: MatriculationEligibilityWithAbistatus | null;
  subjectsWithEligibility: MatriculationSubjectWithEligibility[];
}

/**
 * True when any planned subject has zero passing credits.
 *
 * @param subjects subjects with eligibility
 * @returns true if a planned subject is not eligible
 */
const plannedSubjectsNotEligible = (
  subjects: MatriculationSubjectWithEligibility[]
): boolean =>
  subjects.some((subject) => subject.passingGradeCourseCreditPoints === 0);

/**
 * Matriculation eligibility (abistatus + subject-specific) for the HOPS PDF.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfMatriculationEligibility = (
  props: HopsPdfMatriculationEligibilityProps
) => {
  const { pageHeader, eligibility, subjectsWithEligibility } = props;
  const { t } = useTranslation(["hops_new", "common"]);

  const abistatusRows = [...(eligibility?.subjectStats ?? [])].sort(
    (a, b) =>
      subjectsWithEligibility.findIndex(
        (subject) => subject.subject.subjectCode === a.subjectCode
      ) -
      subjectsWithEligibility.findIndex(
        (subject) => subject.subject.subjectCode === b.subjectCode
      )
  );

  return (
    <Page style={styles.body} size="A4">
      {pageHeader}
      <Text style={styles.pageTitle}>
        {t("labels.matriculationParticipation", { ns: "hops_new" })}
      </Text>
      <View>
        <PdfSectionTitle>
          {t("labels.matriculationParticipation", {
            ns: "hops_new",
            context: "title1",
          })}
        </PdfSectionTitle>
        <PdfGuideText>
          {t("content.matriculationEligibilityGuides1", { ns: "hops_new" })}
        </PdfGuideText>
        <PdfGuideText>
          {t("content.matriculationEligibilityGuides2", { ns: "hops_new" })}
        </PdfGuideText>
        <PdfGuideText>
          {t("content.matriculationEligibilityGuides3", { ns: "hops_new" })}
        </PdfGuideText>
        {!eligibility ? (
          <Text style={styles.empty}>-</Text>
        ) : (
          <View>
            <PdfEligibilityRow
              eligible={eligibility.credits >= eligibility.creditsRequired}
              description={t("content.matriculationAbistatusEligibility1", {
                ns: "hops_new",
                acceptedCount: eligibility.credits,
                requiredCount: eligibility.creditsRequired,
              })}
            />
            <PdfEligibilityRow
              eligible={eligibility.personHasCourseAssessments}
              description={t("content.matriculationAbistatusEligibility2", {
                ns: "hops_new",
              })}
            />
            <PdfEligibilityRow
              eligible={!plannedSubjectsNotEligible(subjectsWithEligibility)}
              description={t("content.matriculationAbistatusEligibility3", {
                ns: "hops_new",
              })}
            />
          </View>
        )}
        <PdfGuideText>
          {t("content.matriculationEligibilityGuides4", { ns: "hops_new" })}
        </PdfGuideText>
        {abistatusRows.map((subject) => (
          <PdfEligibilityRow
            key={subject.code}
            eligible={subject.abistatusOk}
            label={formatMatriculationSubjectName(t, subject.code)}
            description={t("content.matriculationEligibility", {
              ns: "hops_new",
              acceptedCount: subject.doneCredits,
              requiredCount: subject.requiredCredits,
            })}
          />
        ))}
        <PdfSectionTitle>
          {t("labels.matriculationParticipation", {
            ns: "hops_new",
            context: "title2",
          })}
        </PdfSectionTitle>
        <PdfGuideText>
          {t("content.matriculationEligibilityGuides5", { ns: "hops_new" })}
        </PdfGuideText>
        {subjectsWithEligibility.length === 0 ? (
          <Text style={styles.empty}>-</Text>
        ) : (
          subjectsWithEligibility.map((subjectEligibility) => (
            <PdfEligibilityRow
              key={subjectEligibility.subject.code}
              eligible={subjectEligibility.eligible}
              label={formatMatriculationSubjectName(
                t,
                subjectEligibility.subject.code
              )}
              description={t("content.matriculationEligibility", {
                ns: "hops_new",
                acceptedCount:
                  subjectEligibility.passingGradeCourseCreditPoints,
                requiredCount:
                  subjectEligibility.requiredPassingGradeCourseCreditPoints,
              })}
            />
          ))
        )}
      </View>
    </Page>
  );
};

export default HopsPdfMatriculationEligibility;
