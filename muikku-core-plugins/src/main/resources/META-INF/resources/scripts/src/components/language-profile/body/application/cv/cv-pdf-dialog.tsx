import * as React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Link,
  PDFViewer,
  StyleSheet,
} from "@react-pdf/renderer";
import { StateType } from "~/reducers";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FiveStars from "./pdf/pdf-five-stars";
import Dialog from "~/components/general/dialog";

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 15,
    padding: 20,
    backgroundColor: "#fff",
    borderBottom: "1px solid #f2f2f2",
    color: "#000",
  },
  section: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: "#fff",
  },
  header: { fontSize: 16, marginBottom: 10 },
  subheader: { fontSize: 13, marginBottom: 5 },
  label: { fontSize: 10, marginBottom: 5 },
  text: { fontSize: 10, marginTop: 5, marginBottom: 5 },
  paragraph: { marginTop: 10, marginBottom: 10, lineHeight: 1.35 },
  starContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
});

/**
 * CvPdfDialogProps
 */
interface CvPdfDialogProps {
  children?: React.ReactElement;
}

/**
 * CvPdfDialog component
 * @param props CvPdfDialogProps
 * @returns JSX.Element
 */
const CvPdfDialog = (props: CvPdfDialogProps) => {
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
            <Text style={styles.pageTitle}>
              {t("labels.languageCv", {
                ns: "languageProfile",
              })}
              {" - "}
              {name}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.header}>Yleistä</Text>
            <View style={styles.paragraph}>
              <Text style={styles.text}>{cv.general}</Text>
            </View>
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

              <View style={styles.paragraph}>
                <Text style={styles.subheader}>
                  {t("labels.skillLevel", {
                    ns: "languageProfile",
                  })}
                </Text>
                <View style={styles.starContainer}>
                  <View>
                    <Text style={styles.label}>
                      {t("labels.skillVocalization", {
                        ns: "languageProfile",
                      })}
                    </Text>
                    <FiveStars value={Number(language.vocal)} />
                  </View>
                  <View>
                    <Text style={styles.label}>
                      {t("labels.skillWriting", {
                        ns: "languageProfile",
                      })}
                    </Text>
                    <FiveStars value={Number(language.writing)} />
                  </View>
                  <View>
                    <Text style={styles.label}>
                      {t("labels.skillReadingComprehension", {
                        ns: "languageProfile",
                      })}
                    </Text>
                    <FiveStars value={Number(language.reading)} />
                  </View>
                  <View>
                    <Text style={styles.label}>
                      {t("labels.skillInteraction", {
                        ns: "languageProfile",
                      })}
                    </Text>
                    <FiveStars value={Number(language.interaction)} />
                  </View>
                  <View>
                    <Text style={styles.label}>
                      {t("labels.skillListeningComprehension", {
                        ns: "languageProfile",
                      })}
                    </Text>
                    <FiveStars value={Number(language.listening)} />
                  </View>
                </View>
              </View>
              {language.samples.length > 0 && (
                <View style={styles.paragraph}>
                  <Text style={styles.subheader}>
                    {t("labels.samples", {
                      ns: "languageProfile",
                    })}
                  </Text>
                  {language.samples.map((sample, index) => (
                    <Link
                      style={styles.text}
                      key={`language-${language.code}-sample-${index}`}
                      src={sample.url}
                    >
                      {sample.name}
                    </Link>
                  ))}
                </View>
              )}
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
