import * as React from "react";
import {
  Document,
  Page,
  Text,
  Image,
  View,
  PDFViewer,
} from "@react-pdf/renderer";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import moment from "moment";
import Html from "react-pdf-html";
import { supportActionsOptionsCompulsory } from "./helpers";
import { styles, htmlStyles } from "./pedagogy-PDF-styles";
import { useTranslation } from "react-i18next";
import { Opinion } from "~/@types/pedagogy-form";
import { useCompulsoryForm } from "./hooks/useCompulsoryForm";

/**
 * PedagogyPDFProps
 */
interface PedagogyPDFCompulsoryProps {}

/**
 * PedagogyPDF rendered with react-pdf and given data.
 * Data is parsed from JSON to FormData and can be undefined, so data is rendered conditionally.
 *
 * @param props props
 * @returns JSX.Element
 */
const PedagogyPDFCompulsory = (props: PedagogyPDFCompulsoryProps) => {
  const { t } = useTranslation(["pedagogySupportPlan", "common", "users"]);

  const compulsoryForm = useCompulsoryForm();
  const { formData, pedagogyForm, implemetedSupportActionsFormData } =
    compulsoryForm;
  const { studentInfo, ownerInfo, created } = pedagogyForm;

  const supportActionTranslationByValue =
    supportActionsOptionsCompulsory.reduce(
      (acc: { [key: string]: string }, option) => {
        acc[option.value] = option.label;
        return acc;
      },
      {}
    );

  const studentOpinion = (formData?.studentOpinionOfSupport &&
    formData?.studentOpinionOfSupport.length > 0 &&
    formData?.studentOpinionOfSupport.map((opinion: Opinion, i) => (
      <View key={i} style={styles.opinionContainer}>
        <View style={styles.opinionInfo} wrap={false}>
          <View style={styles.infoFieldContainerSameRow}>
            <Text style={styles.infoFieldLabelSameRow}>
              {t("labels.creator", { ns: "pedagogySupportPlan" })}
            </Text>
            <Text style={styles.infoFieldValueSameRow}>
              {opinion.creatorName},{" "}
              {opinion.updatedDate
                ? `${moment(opinion.creationDate).format("DD.MM.YYYY")} (${t(
                    "labels.updated",
                    { ns: "common" }
                  )} ${moment(opinion.updatedDate).format("DD.MM.YYYY")})`
                : moment(opinion.creationDate).format("DD.MM.YYYY")}
            </Text>
          </View>

          <View style={styles.infoFieldContainerSameRow}>
            <Text style={styles.infoFieldLabelSameRow}>
              {t("labels.entry", { ns: "pedagogySupportPlan" })}
            </Text>
            <View style={styles.infoFieldValueSameRow}>
              <Html stylesheet={htmlStyles}>{opinion.opinion || "-"}</Html>
            </View>
          </View>
        </View>
      </View>
    ))) || (
    <View>
      <Text style={styles.empty}>
        {t("content.empty", { ns: "pedagogySupportPlan", context: "opinnion" })}
      </Text>
    </View>
  );

  const schoolOpinion = (formData?.schoolOpinionOfSupport &&
    formData?.schoolOpinionOfSupport.length > 0 &&
    formData?.schoolOpinionOfSupport.map((opinion: Opinion, i) => (
      <View key={i} style={styles.opinionContainer}>
        <View style={styles.opinionInfo} wrap={false}>
          <View style={styles.infoFieldContainerSameRow}>
            <Text style={styles.infoFieldLabelSameRow}>
              {t("labels.creator", { ns: "pedagogySupportPlan" })}
            </Text>
            <Text style={styles.infoFieldValueSameRow}>
              {opinion.creatorName},{" "}
              {opinion.updatedDate
                ? `${moment(opinion.creationDate).format("DD.MM.YYYY")} (${t(
                    "labels.updated",
                    { ns: "common" }
                  )} ${moment(opinion.updatedDate).format("DD.MM.YYYY")})`
                : moment(opinion.creationDate).format("DD.MM.YYYY")}
            </Text>
          </View>

          <View style={styles.infoFieldContainerSameRow}>
            <Text style={styles.infoFieldLabelSameRow}>
              {t("labels.entry", { ns: "pedagogySupportPlan" })}
            </Text>
            <View style={styles.infoFieldValueSameRow}>
              <Html stylesheet={htmlStyles}>{opinion.opinion || "-"}</Html>
            </View>
          </View>
        </View>
      </View>
    ))) || (
    <View>
      <Text style={styles.empty}>
        {t("content.empty", { ns: "pedagogySupportPlan", context: "opinnion" })}
      </Text>
    </View>
  );

  const pageHeader = (
    <View style={styles.header} fixed>
      <View style={styles.headerImageContainer}>
        <Image
          src="/gfx/pedagogy_form_logo_header.png"
          style={styles.headerImage}
        />
      </View>
      <View style={styles.headerInfoContainer}>
        <View style={styles.headerInfoContainerMain}>
          <Text style={styles.headerTitle}>
            {t("labels.title", { ns: "pedagogySupportPlan" })}
          </Text>
        </View>
        <View style={styles.headerInfoContainerAside}>
          <View style={styles.headerInfoContainerAsidePrimary}>
            <Text style={styles.headerSubtitle}>
              {" "}
              {t("labels.confidential", { ns: "pedagogySupportPlan" })}
            </Text>
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

  const studentName = `${studentInfo?.firstName || ""} ${
    studentInfo.lastName || ""
  } ${
    (studentInfo.dateOfBirth &&
      `(${t("labels.dateOfBirth", {
        ns: "common",
      }).toLowerCase()} ${moment(studentInfo.dateOfBirth).format(
        "DD.MM.YYYY"
      )})`) ||
    ""
  } `;

  const studentEmail = `${studentInfo?.email || ""}`;

  const studentPhone = `${studentInfo?.phoneNumber || ""}`;

  const studentAddress = `${
    studentInfo?.streetAddress ||
    t("content.empty", {
      ns: "pedagogySupportPlan",
      context: "address",
    })
  }`;

  const studentZipCodeAndCity = `${studentInfo?.zipCode || ""} ${
    studentInfo.city || ""
  }`;

  const documentCreator = `${ownerInfo.firstName || "-"} ${
    ownerInfo.lastName || "-"
  }`;

  return (
    <PDFViewer className="pedagogy-form__pdf">
      <Document>
        {
          // Basic info page
        }
        <Page style={styles.body} size="A4">
          {pageHeader}
          <Text style={styles.pageTitle}>
            {t("labels.basicInfo", {
              ns: "pedagogySupportPlan",
              context: "document",
            })}
          </Text>

          <View style={styles.infoFieldContainer}>
            <Text style={styles.infoFieldLabel}>
              {t("labels.student", { ns: "users", count: 1 })}
            </Text>
            <Text style={styles.infoFieldValue}>{studentName}</Text>
            <Text style={styles.infoFieldValue}>{studentPhone}</Text>
            <Text style={styles.infoFieldValue}>{studentEmail}</Text>
            <Text style={styles.infoFieldValue}>{studentAddress}</Text>
            <Text style={styles.infoFieldValue}>{studentZipCodeAndCity}</Text>
          </View>

          <View style={styles.infoFieldContainer}>
            <Text style={styles.infoFieldLabel}>
              {t("labels.authorOfDocument", { ns: "pedagogySupportPlan" })}
            </Text>
            <Text style={styles.infoFieldValue}>
              {documentCreator},{" "}
              {t("labels.specialEducationTeacher", { ns: "users", count: 1 })}
            </Text>
            <Text style={styles.infoFieldValue}>{ownerInfo.phoneNumber}</Text>
            <Text style={styles.infoFieldValue}>{ownerInfo.email}</Text>
          </View>

          <View style={styles.infoFieldContainer}>
            <Text style={styles.infoFieldLabel}>
              {t("labels.documentCreatedDate", { ns: "pedagogySupportPlan" })}
            </Text>
            <Text style={styles.infoFieldValue}>
              {moment(created).format("DD.MM.YYYY")}
            </Text>
          </View>

          <View style={styles.infoFieldContainer}>
            <Text style={styles.infoFieldLabel}>
              {t("labels.documentParticipants", { ns: "pedagogySupportPlan" })}
            </Text>
            <Text style={styles.infoFieldValue}>
              {formData?.documentParticipants || "-"}
            </Text>
          </View>

          <View style={styles.infoFieldContainer}>
            <Text style={styles.infoFieldLabel}>
              {t("labels.cooperativePartners", { ns: "pedagogySupportPlan" })}
            </Text>
            <Text style={styles.infoFieldValue}>
              {formData?.cooperativePartners || "-"}
            </Text>
          </View>
        </Page>

        {
          // Reason, actions etc page
        }
        <Page style={styles.body} size="A4">
          {pageHeader}
          <Text style={styles.pageTitle}>
            {t("labels.basisForSupport", { ns: "pedagogySupportPlan" })}
          </Text>
          <View style={styles.infoFieldContainer}>
            <Text style={styles.infoFieldLabel}>
              {t("labels.studentStrengths", { ns: "pedagogySupportPlan" })}
            </Text>
            <Text style={styles.infoFieldValue}>
              {formData?.studentStrengths || "-"}
            </Text>
          </View>

          <View style={styles.infoFieldContainer}>
            <Text style={styles.infoFieldLabel}>
              {t("labels.needForSupport", { ns: "pedagogySupportPlan" })}
            </Text>
            <Text style={styles.infoFieldValue}>
              {formData?.needOfSupport || "-"}
            </Text>
          </View>

          <Text style={styles.pageTitle}>
            {t("labels.plan", {
              ns: "pedagogySupportPlan",
            })}
          </Text>
          <View style={styles.infoFieldContainer}>
            <Text style={styles.infoFieldLabel}>
              {t("labels.plannedActions", {
                ns: "pedagogySupportPlan",
              })}
            </Text>
            {formData?.supportActions?.length > 0 ? (
              <>
                {formData?.supportActions?.map((value, i) => (
                  <Text key={i} style={styles.infoFieldValue}>
                    - {supportActionTranslationByValue[value]}
                  </Text>
                )) || <Text style={styles.infoFieldValue}>-</Text>}
              </>
            ) : (
              <Text style={styles.infoFieldValue}>-</Text>
            )}
          </View>

          {formData?.supportActions?.includes("other") ? (
            <View style={styles.infoFieldContainer}>
              <Text style={styles.infoFieldLabel}>
                {t("labels.actionElse", {
                  ns: "pedagogySupportPlan",
                })}
              </Text>
              <Text style={styles.infoFieldValue}>
                {formData?.supportActionOther || "-"}
              </Text>
            </View>
          ) : null}
        </Page>

        {
          // Implemented support actions page
        }
        <Page style={styles.body} size="A4">
          {pageHeader}
          <Text style={styles.pageTitle}>
            {" "}
            {t("labels.implementedActions", {
              ns: "pedagogySupportPlan",
            })}
          </Text>
          {(implemetedSupportActionsFormData.length > 0 &&
            implemetedSupportActionsFormData.map((iAction, i) => (
              <View key={i} style={styles.implementedActionContainer}>
                <View style={styles.implementationInfo} wrap={false}>
                  <View style={styles.infoFieldContainerSameRow}>
                    <Text style={styles.infoFieldLabelSameRow}>
                      {" "}
                      {t("labels.supportAction", {
                        ns: "pedagogySupportPlan",
                      })}
                    </Text>
                    <Text style={styles.infoFieldValueSameRow}>
                      {supportActionTranslationByValue[iAction.action]},{" "}
                      {moment(iAction.date).format("DD.MM.YYYY")}
                    </Text>
                  </View>

                  {iAction?.course?.name ? (
                    <View style={styles.infoFieldContainerSameRow}>
                      <Text style={styles.infoFieldLabelSameRow}>
                        {t("labels.course", {
                          ns: "common",
                        })}
                      </Text>
                      <Text style={styles.infoFieldValueSameRow}>
                        {iAction?.course?.name}
                      </Text>
                    </View>
                  ) : null}

                  {iAction?.extraInfoDetails ? (
                    <View style={styles.infoFieldContainerSameRow}>
                      <Text style={styles.infoFieldLabelSameRow}>
                        {t("labels.additionalInfo", {
                          ns: "pedagogySupportPlan",
                        })}
                      </Text>
                      <Text style={styles.infoFieldValueSameRow}>
                        {iAction?.extraInfoDetails}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))) || (
            <View>
              <Text style={styles.empty}>
                {t("content.empty", {
                  ns: "pedagogySupportPlan",
                  context: "actions",
                })}
              </Text>
            </View>
          )}
        </Page>

        {
          // Student opinion of support page
        }
        <Page style={styles.body} size="A4">
          {pageHeader}
          <Text style={styles.pageTitle}>
            {t("labels.opinionOfSupport", {
              ns: "pedagogySupportPlan",
              context: "student",
            })}
          </Text>

          {studentOpinion}
          {/* {pageFooter} */}
        </Page>

        {
          // School opinion of support page
        }
        <Page style={styles.body} size="A4">
          {pageHeader}
          <Text style={styles.pageTitle}>
            {t("labels.opinionOfSupport", {
              ns: "pedagogySupportPlan",
              context: "school",
            })}
          </Text>

          {schoolOpinion}
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PedagogyPDFCompulsory;
