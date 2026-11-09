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
import {
  supportActionsOptionsCompulsory,
  supportActionsOptionsUppersecondary,
} from "./helpers";
import { styles } from "./pedagogy-PDF-styles";
import { useTranslation } from "react-i18next";
import { usePedagogyContext } from "./context/pedagogy-context";

/**
 * PedagogyPDFImplementedActionsProps
 */
interface PedagogyPDFImplementedActionsProps {}

/**
 * PedagogyPDFImplementedActions
 *
 * Standalone PDF of implemented support actions. Does not include
 * pedagogy form content.
 *
 * @param props props
 * @returns JSX.Element
 */
const PedagogyPDFImplementedActions = (
  props: PedagogyPDFImplementedActionsProps
) => {
  const { t } = useTranslation(["pedagogySupportPlan", "common", "users"]);

  const { contextType, implemetedSupportActionsFormData, pedagogyForm } =
    usePedagogyContext();

  const { studentInfo } = pedagogyForm;

  const supportActionTranslationByValue = (
    contextType === "upperSecondary"
      ? supportActionsOptionsUppersecondary
      : supportActionsOptionsCompulsory
  ).reduce((acc: { [key: string]: string }, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});

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
            {t("labels.implementedActions", { ns: "pedagogySupportPlan" })}
          </Text>
        </View>
        <View style={styles.headerInfoContainerAside}>
          <View style={styles.headerInfoContainerAsidePrimary}>
            <Text style={styles.headerSubtitle}>
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

  return (
    <PDFViewer className="pedagogy-form__pdf">
      <Document>
        <Page style={styles.body} size="A4">
          {pageHeader}

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

          <Text style={styles.pageTitle}>
            {t("labels.implementedActions", {
              ns: "pedagogySupportPlan",
            })}
          </Text>

          {(implemetedSupportActionsFormData &&
            implemetedSupportActionsFormData.length > 0 &&
            implemetedSupportActionsFormData.map((iAction, i) => (
              <View key={i} style={styles.implementedActionContainer}>
                <View style={styles.implementationInfo} wrap={false}>
                  <View style={styles.infoFieldContainerSameRow}>
                    <Text style={styles.infoFieldLabelSameRow}>
                      {t("labels.creator", { ns: "pedagogySupportPlan" })}
                    </Text>
                    <Text style={styles.infoFieldValueSameRow}>
                      {iAction.creatorName || "-"}
                    </Text>
                  </View>

                  <View style={styles.infoFieldContainerSameRow}>
                    <Text style={styles.infoFieldLabelSameRow}>
                      {t("labels.supportAction", {
                        ns: "pedagogySupportPlan",
                      })}
                    </Text>
                    <Text style={styles.infoFieldValueSameRow}>
                      {`${
                        supportActionTranslationByValue[iAction.action] ||
                        iAction.action
                      }, ${moment(iAction.date).format("DD.MM.YYYY")}`}
                    </Text>
                  </View>

                  <View style={styles.infoFieldContainerSameRow}>
                    <Text style={styles.infoFieldLabelSameRow}>
                      {t("labels.course", {
                        ns: "common",
                      })}
                    </Text>
                    <Text style={styles.infoFieldValueSameRow}>
                      {iAction?.course?.name
                        ? iAction.course.nameExtension
                          ? `${iAction.course.name} (${iAction.course.nameExtension})`
                          : iAction.course.name
                        : "-"}
                    </Text>
                  </View>

                  <View style={styles.infoFieldContainerSameRow}>
                    <Text style={styles.infoFieldLabelSameRow}>
                      {t("labels.additionalInfo", {
                        ns: "pedagogySupportPlan",
                      })}
                    </Text>
                    <Text style={styles.infoFieldValueSameRow}>
                      {iAction?.extraInfoDetails || "-"}
                    </Text>
                  </View>
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
      </Document>
    </PDFViewer>
  );
};

export default PedagogyPDFImplementedActions;
