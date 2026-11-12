import * as React from "react";
import { Document, Page, Text, Image, View } from "@react-pdf/renderer";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { styles } from "./hops-pdf-styles";
import { HopsPdfSectionSelection } from "./hops-pdf-types";
import { HopsForm } from "~/@types/hops";
import { PdfInfoField } from "./hops-pdf-info-field";
import HopsPdfBackground from "./background/hops-pdf-background";
import HopsPdfPostgraduate from "./postgraduate/hops-pdf-postgraduate";
import HopsPdfMatriculation from "./matriculation/hops-pdf-matriculation";
import {
  MatriculationPlan,
  MatriculationResults,
  StudyActivityItem,
} from "~/generated/client";
import HopsPdfStudyPlan from "./studyplan/hops-pdf-studyplan";
import {
  MatriculationEligibilityWithAbistatus,
  MatriculationExamWithHistory,
  MatriculationSubjectWithEligibility,
  PlannedPeriod,
} from "~/reducers/hops";

/**
 * HopsPdfDocumentProps
 */
interface HopsPdfDocumentProps {
  selectedSections: HopsPdfSectionSelection;
  studentName: string;
  studyProgramName: string;
  educationTypeCode: string;
  counselors: string[];
  hopsForm: HopsForm | null;
  matriculationPlan: MatriculationPlan | null;
  eligibility: MatriculationEligibilityWithAbistatus | null;
  subjectsWithEligibility: MatriculationSubjectWithEligibility[];
  exams: MatriculationExamWithHistory[];
  pastExams: MatriculationExamWithHistory[];
  results: MatriculationResults[];
  studyPlanPeriods: PlannedPeriod[];
  studyActivities: StudyActivityItem[];
  formatCourseLength: (courseLength: number) => string;
}

/**
 * HOPS PDF document. Always includes a cover page; selected sections are
 * rendered as extra pages. Section bodies are filled in later chunks.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfDocument = (props: HopsPdfDocumentProps) => {
  const {
    selectedSections,
    studentName,
    studyProgramName,
    educationTypeCode,
    counselors,
    hopsForm,
    matriculationPlan,
    eligibility,
    subjectsWithEligibility,
    exams,
    pastExams,
    results,
    studyPlanPeriods,
    studyActivities,
    formatCourseLength,
  } = props;
  const { t } = useTranslation(["hops_new", "common", "users"]);

  const counselorValue =
    counselors.length > 0
      ? counselors.join(", ")
      : t("labels.hopsFormBasicInfoCouncelor_no", { ns: "hops_new" });

  const pageHeader = (
    <View style={styles.header} fixed>
      <View style={styles.headerImageContainer}>
        {educationTypeCode === "lukio" ? (
          <Image src="/gfx/logo_nettilukio.png" style={styles.headerImage} />
        ) : (
          <Image
            src="/gfx/logo_nettiperuskoulu.png"
            style={styles.headerImage}
          />
        )}
      </View>
      <View style={styles.headerInfoContainer}>
        <View style={styles.headerInfoContainerMain}>
          <Text style={styles.headerTitle}>
            {educationTypeCode === "lukio"
              ? t("labels.hopsPdfDialogTitle", {
                  ns: "hops_new",
                  context: "lukio",
                })
              : t("labels.hopsPdfDialogTitle", {
                  ns: "hops_new",
                  context: "peruskoulu",
                })}
          </Text>
        </View>
        <View style={styles.headerInfoContainerAside}>
          <View style={styles.headerInfoContainerAsidePrimary}>
            <Text style={styles.headerSubtitle}>
              {moment().format("D.M.YYYY")}
            </Text>
          </View>
          <View style={styles.headerInfoContainerAsideSecondary}>
            <Text
              style={styles.headerPageNumber}
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} (${totalPages})`
              }
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Document>
      <Page style={styles.body} size="A4">
        {pageHeader}
        <Text style={styles.pageTitle}>
          {t("labels.hopsFormInfoTitle", { ns: "hops_new" })}
        </Text>
        <PdfInfoField
          label={t("labels.student", { ns: "users", count: 1 })}
          value={studentName}
        />
        <PdfInfoField
          label={t("labels.studyProgramme", { ns: "users" })}
          value={studyProgramName}
        />
        <PdfInfoField
          label={t("labels.hopsFormBasicInfoEducationLevel", {
            ns: "hops_new",
          })}
          value={educationTypeCode}
        />
        <PdfInfoField
          label={t("labels.hopsFormBasicInfoCouncelor", { ns: "hops_new" })}
          value={counselorValue}
        />
      </Page>

      {selectedSections.BACKGROUND && (
        <HopsPdfBackground pageHeader={pageHeader} form={hopsForm} />
      )}

      {selectedSections.STUDYPLAN && (
        <HopsPdfStudyPlan
          pageHeader={pageHeader}
          periods={studyPlanPeriods}
          studyActivities={studyActivities}
          formatCourseLength={formatCourseLength}
        />
      )}

      {selectedSections.MATRICULATION && (
        <HopsPdfMatriculation
          pageHeader={pageHeader}
          plan={matriculationPlan}
          eligibility={eligibility}
          subjectsWithEligibility={subjectsWithEligibility}
          exams={exams}
          pastExams={pastExams}
          results={results}
        />
      )}

      {selectedSections.POSTGRADUATE && (
        <HopsPdfPostgraduate pageHeader={pageHeader} form={hopsForm} />
      )}
    </Document>
  );
};

export default HopsPdfDocument;
