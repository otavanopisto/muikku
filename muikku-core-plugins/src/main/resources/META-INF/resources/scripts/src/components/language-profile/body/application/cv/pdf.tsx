import * as React from "react";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  StyleSheet,
} from "@react-pdf/renderer";
import { StateType } from "~/reducers";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FiveStars from "./pdf/pdfFiveStars";
import Dialog from "~/components/general/dialog";

const styles = StyleSheet.create({
  page: {
    fontSize: 15,
    padding: 10,
    backgroundColor: "#009fe3",
    color: "white",
  },
  section: { margin: 10, padding: 10, backgroundColor: "#f0f0f0" },
  header: { fontSize: 12, marginBottom: 10 },
  subheader: { fontSize: 11, marginBottom: 5 },
  text: { fontSize: 10, marginBottom: 5, paddingLeft: 5 },
  paragraph: { marginBottom: 10 },
  starContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
    marginTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
  },
});

/**
 * CvPdfProps
 */
interface CvPdfProps {
  children?: React.ReactElement;
}

/**
 * CvPdf component
 * @param props CvPdfProps
 * @returns JSX.Element
 */
const CvPdfDialog = (props: CvPdfProps) => {
  const { children } = props;
  const { languageProfile, status } = useSelector((state: StateType) => state);
  const cv = languageProfile.data.cv;
  const name = status.profile.displayName;
  const { t } = useTranslation(["languageProfile", "common"]);

  /**
   * content
   * @param closeDialog closeDialog
   * @returns JSX.Element
   */
  const content = (closeDialog: () => void) => (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document>
        <Page size="A4">
          <View>
            <Text style={styles.page}>
              {t("labels.languageCv", {
                ns: "languageProfile",
              })}
              {" - "}
              {name}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>Yleistä</Text>
            <Text style={styles.text}>{cv.general}</Text>
          </View>
          {cv.languages.map((language, index: number) => (
            <View wrap={false} key={"language-" + index} style={styles.section}>
              <Text style={styles.header}>
                {t(`languages.${language.code}`, {
                  defaultValue: language.code,
                  ns: "languageProfile",
                })}
              </Text>
              <View style={styles.paragraph}>
                <Text style={styles.subheader}>
                  {t("labels.descriptionOfCompetence", {
                    ns: "languageProfile",
                  })}
                </Text>
                <Text style={styles.text}>{language.description}</Text>
              </View>
              <View style={styles.paragraph}>
                <Text style={styles.subheader}>
                  {t("labels.skillEstimate", {
                    ns: "languageProfile",
                  })}
                </Text>
                <Text style={styles.text}>{language.general}</Text>
              </View>
              <View style={styles.starContainer}>
                <View>
                  <Text style={styles.subheader}>
                    {t("labels.skillVocalization", {
                      ns: "languageProfile",
                    })}
                  </Text>
                  <FiveStars value={Number(language.vocal)} />
                </View>
                <View>
                  <Text style={styles.subheader}>
                    {t("labels.skillWriting", {
                      ns: "languageProfile",
                    })}
                  </Text>
                  <FiveStars value={Number(language.writing)} />
                </View>
                <View>
                  <Text style={styles.subheader}>
                    {t("labels.skillReadingComprehension", {
                      ns: "languageProfile",
                    })}
                  </Text>
                  <FiveStars value={Number(language.reading)} />
                </View>
                <View>
                  <Text style={styles.subheader}>
                    {t("labels.skillInteraction", {
                      ns: "languageProfile",
                    })}
                  </Text>
                  <FiveStars value={Number(language.interaction)} />
                </View>
                <View>
                  <Text style={styles.subheader}>
                    {t("labels.skillListeningComprehension", {
                      ns: "languageProfile",
                    })}
                  </Text>
                  <FiveStars value={Number(language.listening)} />
                </View>
              </View>
            </View>
          ))}
        </Page>
      </Document>
    </PDFViewer>
  );

  return (
    <Dialog
      modifier="cv-pdf-dialog"
      title={t("labels.languageCv", {
        ns: "languageProfile",
      })}
      content={content}
      disableScroll
    >
      {children}
    </Dialog>
  );
};

export default CvPdfDialog;
