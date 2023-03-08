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
import { FormData, PedagogyForm } from "~/@types/pedagogy-form";

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
  const formData = JSON.parse(props.data.formData) as FormData;

  const studentOpinion = formData?.studentOpinionOfSupport || "";
  const schoolOpinion = formData?.schoolOpinionOfSupport || "";

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

  return (
    <Document>
      {
        // Basic info page
      }
      <Page style={styles.body} size="A4">
        {pageHeader}
        <Text style={styles.pageTitle}>Perus-ja Asiakirjatiedot</Text>
        <Text>
          En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha
          mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga
          antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que
          carnero, salpicón las más noches, duelos y quebrantos los sábados,
          lentejas los viernes, algún palomino de añadidura los domingos,
          consumían las tres partes de su hacienda. El resto della concluían
          sayo de velarte, calzas de velludo para las fiestas con sus pantuflos
          de lo mismo, los días de entre semana se honraba con su vellori de lo
          más fino. Tenía en su casa una ama que pasaba de los cuarenta, y una
          sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que
          así ensillaba el rocín como tomaba la podadera. Frisaba la edad de
          nuestro hidalgo con los cincuenta años, era de complexión recia, seco
          de carnes, enjuto de rostro; gran madrugador y amigo de la caza.
          Quieren decir que tenía el sobrenombre de Quijada o Quesada (que en
          esto hay alguna diferencia en los autores que deste caso escriben),
          aunque por conjeturas verosímiles se deja entender que se llama
          Quijana; pero esto importa poco a nuestro cuento; basta que en la
          narración dél no se salga un punto de la verdad
        </Text>
        {pageFooter}
      </Page>

      {
        // Reason, actions etc page
      }
      <Page style={styles.body} size="A4">
        {pageHeader}
        <Text style={styles.pageTitle}>Perusteet</Text>
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

        <View style={styles.infoField}>
          {studentOpinion === "" ? (
            <Text style={styles.infoFieldValue}>
              Opiskelijan näkemystä ei ole vielä asetettu
            </Text>
          ) : (
            <Html>{studentOpinion}</Html>
          )}
        </View>
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

        <View style={styles.infoField}>
          {schoolOpinion === "" ? (
            <Text style={styles.infoFieldValue}>
              Lukion näkemystä ei ole vielä asetettu
            </Text>
          ) : (
            <Html>{schoolOpinion}</Html>
          )}
        </View>
        {pageFooter}
      </Page>
    </Document>
  );
};

export default PedagogyPDF;
