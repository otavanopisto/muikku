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
import { styles } from "./pedagogy-PDF-styles";
import { FormData, Opinion, PedagogyForm } from "~/@types/pedagogy-form";

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

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
        <View key={i} style={styles.opinion}>
          <View style={styles.opinionInfo}>
            <View style={styles.infoField}>
              <Text style={styles.infoFieldLabel}>Merkitsijä:</Text>
              <Text style={styles.infoFieldValue}>{opinion.creatorName}</Text>
            </View>

            <View style={styles.infoField}>
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
          </View>

          <View style={styles.opinionExtraInfo}>
            <Html>{opinion.opinion}</Html>
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
        <View key={i} style={styles.opinion}>
          <View style={styles.opinionInfo}>
            <View style={styles.infoField}>
              <Text style={styles.infoFieldLabel}>Merkitsijä:</Text>
              <Text style={styles.infoFieldValue}>{opinion.creatorName}</Text>
            </View>

            <View style={styles.infoField}>
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
          </View>

          <View style={styles.opinionExtraInfo}>
            <Html>{opinion.opinion}</Html>
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
        <Text style={styles.title}>PEDAGOGISEN TUEN SUUNNITELMA</Text>
        <Text style={styles.subtitle}>Salassa pidettävä</Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Sivu ${pageNumber} / ${totalPages}`
          }
        />
      </View>
    </View>
  );

  const pageFooter = (
    <View style={styles.footer} fixed>
      <Image
        style={styles.footerImage}
        src="/gfx/pedagogy_form_logo_footer.png"
      />
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

  return (
    <Document>
      {
        // Basic info page
      }
      <Page style={styles.body} size="A4">
        {pageHeader}
        <Text style={styles.pageTitle}>Perus-ja Asiakirjatiedot</Text>

        <View style={styles.infoField}>
          <Text style={styles.infoFieldLabel}>Opiskelija:</Text>
          <Text style={styles.infoFieldValue}>{studentName}</Text>
          <Text style={styles.infoFieldValue}>{studentPhone}</Text>
          <Text style={styles.infoFieldValue}>{studentEmail}</Text>
          <Text style={styles.infoFieldValue}>{studentAddress}</Text>
          <Text style={styles.infoFieldValue}>{studentZipCodeAndCity}</Text>
        </View>

        <View style={styles.infoField}>
          <Text style={styles.infoFieldLabel}>
            Asiakirjan laatimiseen osallistuneet:
          </Text>
          <Text style={styles.infoFieldValue}>
            {formData?.documentParticipants || "-"}
          </Text>
        </View>

        <View style={styles.infoField}>
          <Text style={styles.infoFieldLabel}>Yhteistyötahot:</Text>
          <Text style={styles.infoFieldValue}>
            {formData?.cooperativePartners || "-"}
          </Text>
        </View>
        {pageFooter}
      </Page>

      {
        // Reason, actions etc page
      }
      <Page style={styles.body} size="A4">
        {pageHeader}
        <Text style={styles.pageTitle}>Tuen perusteet</Text>
        <View style={styles.infoField}>
          <Text style={styles.infoFieldLabel}>Opiskelijan vahvuudet:</Text>
          <Text style={styles.infoFieldValue}>
            {formData?.studentStrengths || "-"}
          </Text>
        </View>

        <View style={styles.infoField}>
          <Text style={styles.infoFieldLabel}>Pedagogisen tuen perusteet:</Text>
          <View style={styles.infoListValueContainer}>
            {formData?.supportReasons && formData?.supportReasons.length > 0
              ? formData?.supportReasons.map((value, i) => (
                  <Text key={i} style={styles.infoListItemValue}>
                    - {supportReasonTranslationByValue[value]}
                  </Text>
                ))
              : "-"}
          </View>
        </View>

        {formData?.supportReasons.includes("other") ? (
          <View style={styles.infoField}>
            <Text style={styles.infoFieldLabel}>Muu syy:</Text>
            <Text style={styles.infoFieldValue}>
              {formData?.supportReasonOther || "-"}
            </Text>
          </View>
        ) : null}

        <Text style={styles.pageTitle}>Suunnitelma</Text>
        <View style={styles.infoField}>
          <Text style={styles.infoFieldLabel}>Suunniteltut tukitoimet:</Text>
          <View style={styles.infoListValueContainer}>
            {formData?.supportActions && formData?.supportActions.length > 0
              ? formData?.supportActions.map((value, i) => (
                  <Text key={i} style={styles.infoListItemValue}>
                    - {supportActionTranslationByValue[value]}
                  </Text>
                ))
              : "-"}
          </View>
        </View>

        {formData?.supportActions.includes("other") ? (
          <View style={styles.infoField}>
            <Text style={styles.infoFieldLabel}>Muu syy:</Text>
            <Text style={styles.infoFieldValue}>
              {formData?.supportActionOther || "-"}
            </Text>
          </View>
        ) : null}

        <View style={styles.infoField}>
          <Text style={styles.infoFieldLabel}>
            Ennakko suunnitelma ylioppilaskirjoituksiin:
          </Text>
          <View style={styles.infoListValueContainer}>
            {formData?.matriculationExaminationSupport &&
            formData?.matriculationExaminationSupport.length > 0
              ? formData?.matriculationExaminationSupport.map((value, i) => (
                  <Text key={i} style={styles.infoListItemValue}>
                    - {matriculationActionTranslationByValue[value]}
                  </Text>
                ))
              : "-"}
          </View>
        </View>

        {formData?.matriculationExaminationSupport.includes("other") ? (
          <View style={styles.infoField}>
            <Text style={styles.infoFieldLabel}>Muu syy:</Text>
            <Text style={styles.infoFieldValue}>
              {formData?.matriculationExaminationSupportOther || "-"}
            </Text>
          </View>
        ) : null}
        {pageFooter}
      </Page>

      {
        // Implemented support actions page
      }
      <Page style={styles.body} size="A4">
        {pageHeader}
        <Text style={styles.pageTitle}>Toteutetut tukitoimet</Text>
        <View style={styles.implementedActionsList}>
          {formData?.supportActionsImplemented &&
          formData?.supportActionsImplemented.length > 0
            ? formData?.supportActionsImplemented.map((iAction, i) => (
                <View key={i} style={styles.implementedAction}>
                  <View style={styles.implementationInfo}>
                    <View style={styles.infoField}>
                      <Text style={styles.infoFieldLabel}>Päivämäärä:</Text>
                      <Text style={styles.infoFieldValue}>
                        {moment(iAction.date).format("DD.MM.YYYY")}
                      </Text>
                    </View>
                    <View style={styles.infoField}>
                      <Text style={styles.infoFieldLabel}>Tukitoimi:</Text>
                      <Text style={styles.infoFieldValue}>
                        {supportActionTranslationByValue[iAction.action]}
                      </Text>
                    </View>
                    <View style={styles.infoField}>
                      <Text style={styles.infoFieldLabel}>Kurssi:</Text>
                      <Text style={styles.infoFieldValue}>
                        {iAction?.course?.name || "-"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.implementationExtraInfo}>
                    <Text style={styles.infoFieldLabel}>Lisätietoa:</Text>
                    <Text style={styles.infoFieldValue}>
                      {iAction?.extraInfoDetails || "-"}
                    </Text>
                  </View>
                </View>
              ))
            : "Ei toteutettuja tukitoimia"}
        </View>
        {pageFooter}
      </Page>

      {
        // Student opinion of support page
      }
      <Page style={styles.body} size="A4">
        {pageHeader}
        <Text style={styles.pageTitle}>
          Tuen seuranta ja arviointi (Opiskelija näkemys)
        </Text>

        {studentOpinion}
        {pageFooter}
      </Page>

      {
        // School opinion of support page
      }
      <Page style={styles.body} size="A4">
        {pageHeader}
        <Text style={styles.pageTitle}>
          Tuen seuranta ja arviointi (Koulun näkemys)
        </Text>

        {schoolOpinion}
        {pageFooter}
      </Page>
    </Document>
  );
};

export default PedagogyPDF;
