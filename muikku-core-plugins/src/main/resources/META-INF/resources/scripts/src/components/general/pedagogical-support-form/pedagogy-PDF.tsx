import * as React from "react";
import { Document, Page, Text, Image, View, Font } from "@react-pdf/renderer";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import * as moment from "moment";
import Html from "react-pdf-html";
import {
  matriculationSupportActionsOptions,
  supportActionsOptions,
  supportReasonsOptions,
} from "./helpers";
import { styles, htmlStyles } from "./pedagogy-PDF-styles";
import { FormData, Opinion, PedagogyForm } from "~/@types/pedagogy-form";

/**
 * PedagogyPDFProps
 */
interface PedagogyPDFProps {
  data: PedagogyForm;
}

/**
 * PedagogyPDF
 * @param props props
 * @returns JSX.Element
 */
const PedagogyPDF = (props: PedagogyPDFProps) => {
  const { data } = props;

  const formData = JSON.parse(props.data.formData) as FormData;

  const supportReasonTranslationByValue = supportReasonsOptions.reduce(
    (acc: { [key: string]: string }, option) => {
      acc[option.value] = option.label;
      return acc;
    },
    {}
  );

  const supportActionTranslationByValue = supportActionsOptions.reduce(
    (acc: { [key: string]: string }, option) => {
      acc[option.value] = option.label;
      return acc;
    },
    {}
  );

  const matriculationActionTranslationByValue =
    matriculationSupportActionsOptions.reduce(
      (acc: { [key: string]: string }, option) => {
        acc[option.value] = option.label;
        return acc;
      },
      {}
    );

  const studentOpinion =
    formData?.studentOpinionOfSupport.length > 0 ? (
      formData.studentOpinionOfSupport.map((opinion: Opinion, i) => (
        <View key={i} style={styles.opinionContainer}>
          <View style={styles.opinionInfo} wrap={false}>
            <View style={styles.infoFieldContainer}>
              <Text style={styles.infoFieldLabel}>Merkitsijä:</Text>
              <Text style={styles.infoFieldValue}>{opinion.creatorName}</Text>
            </View>

            <View style={styles.infoFieldContainer}>
              <Text style={styles.infoFieldLabel}>Päivämäärä:</Text>
              <Text style={styles.infoFieldValue}>
                {opinion.updatedDate
                  ? `${moment(opinion.creationDate).format(
                      "DD.MM.YYYY"
                    )} (Päivitetty ${moment(opinion.updatedDate).format(
                      "DD.MM.YYYY"
                    )})`
                  : moment(opinion.creationDate).format("DD.MM.YYYY")}
              </Text>
            </View>

            <View style={styles.infoFieldContainer}>
              <Text style={styles.infoFieldLabel}>Merkintä:</Text>
              <View style={styles.infoFieldValue}>
                <Html stylesheet={htmlStyles}>{opinion.opinion}</Html>
              </View>
            </View>
          </View>
        </View>
      ))
    ) : (
      <View>
        <Text>Ei mielipidettä asetettu</Text>
      </View>
    );

  const schoolOpinion =
    formData?.schoolOpinionOfSupport.length > 0 ? (
      formData.schoolOpinionOfSupport.map((opinion: Opinion, i) => (
        <View key={i} style={styles.opinionContainer}>
          <View style={styles.opinionInfo} wrap={false}>
            <View style={styles.infoFieldContainer}>
              <Text style={styles.infoFieldLabel}>Merkitsijä:</Text>
              <Text style={styles.infoFieldValue}>{opinion.creatorName}</Text>
            </View>

            <View style={styles.infoFieldContainer}>
              <Text style={styles.infoFieldLabel}>Päivämäärä:</Text>
              <Text style={styles.infoFieldValue}>
                {opinion.updatedDate
                  ? `${moment(opinion.creationDate).format(
                      "DD.MM.YYYY"
                    )} (Päivitetty ${moment(opinion.updatedDate).format(
                      "DD.MM.YYYY"
                    )})`
                  : moment(opinion.creationDate).format("DD.MM.YYYY")}
              </Text>
            </View>

            <View style={styles.infoFieldContainer}>
              <Text style={styles.infoFieldLabel}>Merkintä:</Text>
              <View style={styles.infoFieldValue}>
                <Html stylesheet={htmlStyles}>{opinion.opinion}</Html>
              </View>
            </View>
          </View>
        </View>
      ))
    ) : (
      <View>
        <Text>Ei mielipidettä asetettu</Text>
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
        <Text style={styles.headerTitle}>Pedagogisen tuen suunnitelma</Text>
        <Text style={styles.headerSubtitle}>Salassa pidettävä</Text>
        <Text
          style={styles.headerPageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} (${totalPages})`
          }
        />
      </View>
    </View>
  );

  const studentName = `${data?.studentInfo?.firstName || ""} ${
    data.studentInfo.lastName || ""
  } ${
    (data.studentInfo.dateOfBirth &&
      `(syntymäaika ${moment(data.studentInfo.dateOfBirth).format(
        "DD.MM.YYYY"
      )})`) ||
    ""
  } `;

  const studentEmail = `${data?.studentInfo?.email || ""}`;

  const studentPhone = `${data?.studentInfo?.phoneNumber || ""}`;

  const studentAddress = `${
    data?.studentInfo?.streetAddress || "Ei osoitetietoa"
  }`;

  const studentZipCodeAndCity = `${data?.studentInfo?.zipCode || ""} ${
    data.studentInfo.city || ""
  }`;

  const documentCreator = `${data?.ownerInfo.firstName || "-"} ${
    data?.ownerInfo.lastName || "-"
  }`;

  return (
    <Document>
      {
        // Basic info page
      }
      <Page style={styles.body} size="A4">
        {pageHeader}
        <Text style={styles.pageTitle}>Perus- ja asiakirjatiedot</Text>

        <View style={styles.infoFieldContainer}>
          <Text style={styles.infoFieldLabel}>Opiskelija</Text>
          <Text style={styles.infoFieldValue}>{studentName}</Text>
          <Text style={styles.infoFieldValue}>{studentPhone}</Text>
          <Text style={styles.infoFieldValue}>{studentEmail}</Text>
          <Text style={styles.infoFieldValue}>{studentAddress}</Text>
          <Text style={styles.infoFieldValue}>{studentZipCodeAndCity}</Text>
        </View>

        <View style={styles.infoFieldContainer}>
          <Text style={styles.infoFieldLabel}>Asiakirjan laatija</Text>
          <Text style={styles.infoFieldValue}>{documentCreator}</Text>
        </View>

        <View style={styles.infoFieldContainer}>
          <Text style={styles.infoFieldLabel}>Asiakirjan päivämäärä</Text>
          <Text style={styles.infoFieldValue}>
            {moment(data.created).format("DD.MM.YYYY")}
          </Text>
        </View>

        <View style={styles.infoFieldContainer}>
          <Text style={styles.infoFieldLabel}>
            Asiakirjan laatimiseen osallistuneet
          </Text>
          <Text style={styles.infoFieldValue}>
            {formData?.documentParticipants || "-"}
          </Text>
        </View>

        <View style={styles.infoFieldContainer}>
          <Text style={styles.infoFieldLabel}>Yhteistyötahot</Text>
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
        <Text style={styles.pageTitle}>Tuen perusteet</Text>
        <View style={styles.infoFieldContainer}>
          <Text style={styles.infoFieldLabel}>Opiskelijan vahvuudet</Text>
          <Text style={styles.infoFieldValue}>
            {formData?.studentStrengths || "-"}
          </Text>
        </View>

        <View style={styles.infoFieldContainer}>
          <Text style={styles.infoFieldLabel}>Pedagogisen tuen perusteet</Text>
          {formData?.supportReasons && formData?.supportReasons.length > 0
            ? formData?.supportReasons.map((value, i) => (
                <Text key={i} style={styles.infoFieldValue}>
                  - {supportReasonTranslationByValue[value]}
                </Text>
              ))
            : "-"}
        </View>

        {formData?.supportReasons.includes("other") ? (
          <View style={styles.infoFieldContainer}>
            <Text style={styles.infoFieldLabel}>Muu syy</Text>
            <Text style={styles.infoFieldValue}>
              {formData?.supportReasonOther || "-"}
            </Text>
          </View>
        ) : null}

        <Text style={styles.pageTitle}>Suunnitelma</Text>
        <View style={styles.infoFieldContainer}>
          <Text style={styles.infoFieldLabel}>Suunnitellut tukitoimet</Text>
          {formData?.supportActions && formData?.supportActions.length > 0
            ? formData?.supportActions.map((value, i) => (
                <Text key={i} style={styles.infoFieldValue}>
                  - {supportActionTranslationByValue[value]}
                </Text>
              ))
            : "-"}
        </View>

        {formData?.supportActions.includes("other") ? (
          <View style={styles.infoFieldContainer}>
            <Text style={styles.infoFieldLabel}>Muu syy</Text>
            <Text style={styles.infoFieldValue}>
              {formData?.supportActionOther || "-"}
            </Text>
          </View>
        ) : null}

        <View style={styles.infoFieldContainer}>
          <Text style={styles.infoFieldLabel}>:</Text>
          {formData?.matriculationExaminationSupport &&
          formData?.matriculationExaminationSupport.length > 0
            ? formData?.matriculationExaminationSupport.map((value, i) => (
                <Text key={i} style={styles.infoFieldValue}>
                  - {matriculationActionTranslationByValue[value]}
                </Text>
              ))
            : "-"}
        </View>

        {formData?.matriculationExaminationSupport.includes("other") ? (
          <View style={styles.infoFieldContainer}>
            <Text style={styles.infoFieldLabel}>Muu syy</Text>
            <Text style={styles.infoFieldValue}>
              {formData?.matriculationExaminationSupportOther || "-"}
            </Text>
          </View>
        ) : null}
      </Page>

      {
        // Implemented support actions page
      }
      <Page style={styles.body} size="A4">
        {pageHeader}
        <Text style={styles.pageTitle}>Toteutetut tukitoimet</Text>
        {formData?.supportActionsImplemented &&
        formData?.supportActionsImplemented.length > 0
          ? formData?.supportActionsImplemented.map((iAction, i) => (
              <View key={i} style={styles.implementedActionContainer}>
                <View style={styles.implementationInfo} wrap={false}>
                  <View style={styles.infoFieldContainer}>
                    <Text style={styles.infoFieldLabel}>Tukitoimi</Text>
                    <Text style={styles.infoFieldValue}>
                      {supportActionTranslationByValue[iAction.action]}
                    </Text>
                  </View>

                  <View style={styles.infoFieldContainer}>
                    <Text style={styles.infoFieldLabel}>Päivämäärä</Text>
                    <Text style={styles.infoFieldValue}>
                      {moment(iAction.date).format("DD.MM.YYYY")}
                    </Text>
                  </View>

                  <View style={styles.infoFieldContainer}>
                    <Text style={styles.infoFieldLabel}>Kurssi</Text>
                    <Text style={styles.infoFieldValue}>
                      {iAction?.course?.name || "-"}
                    </Text>
                  </View>

                  <View style={styles.infoFieldContainer}>
                    <Text style={styles.infoFieldLabel}>Lisätietoa</Text>
                    <Text style={styles.infoFieldValue}>
                      {iAction?.extraInfoDetails || "-"}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          : "Ei toteutettuja tukitoimia"}
      </Page>

      {
        // Student opinion of support page
      }
      <Page style={styles.body} size="A4">
        {pageHeader}
        <Text style={styles.pageTitle}>
          Opiskelijan näkemys tuen vaikuttavuudesta
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
          Oppilaitoksen näkemys tuen vaikuttavuudesta
        </Text>

        {schoolOpinion}
      </Page>
    </Document>
  );
};

export default PedagogyPDF;
