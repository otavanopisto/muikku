import * as React from "react";
import { Document, Page, Text, View, PDFViewer } from "@react-pdf/renderer";
import { StateType } from "~/reducers";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FiveStars from "./stars/star-selector";

const CvPdf = () => {
  const { languageProfile, status } = useSelector((state: StateType) => state);
  const cv = languageProfile.data.cv;
  const name = status.profile.displayName;
  const { t } = useTranslation(["languageProfile", "common"]);

  return (
    <div>
      <div>
        <img height="15" width={85} src="/gfx/stars/3.png" />
      </div>
      <PDFViewer style={{ width: "100%", height: "100vh" }}>
        <Document>
          <Page size="A4">
            <View>
              <Text
                style={{
                  fontSize: 15,
                  padding: 10,
                  backgroundColor: "#009fe3",
                  color: "white",
                }}
              >
                Kieli-CV - {name}
              </Text>
            </View>
            <View
              style={{ padding: 10, margin: 10, backgroundColor: "#f0f0f0" }}
            >
              <Text style={{ fontSize: 12, marginBottom: 10 }}>Yleistä</Text>
              <Text style={{ fontSize: 11, marginBottom: 10 }}>
                {cv.general}
              </Text>
            </View>
            {cv.languages.map((language, index: number) => (
              <View
                wrap={false}
                key={"language-" + index}
                style={{ padding: 10, margin: 10 }}
              >
                <Text style={{ fontSize: 12, marginBottom: 10 }}>
                  {t(`languages.${language.code}`, {
                    defaultValue: language.code,
                    ns: "languageProfile",
                  })}
                </Text>
                <Text style={{ fontSize: 11, marginBottom: 10 }}>
                  {language.description}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 11 }}>
                      {t("labels.skillVocalization", {
                        ns: "languageProfile",
                      })}
                    </Text>
                    <FiveStars value={Number(language.vocal)} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 11 }}>
                      {t("labels.skillWriting", {
                        ns: "languageProfile",
                      })}
                    </Text>
                    <FiveStars value={Number(language.writing)} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 11 }}>
                      {t("labels.skillReadingComprehension", {
                        ns: "languageProfile",
                      })}
                    </Text>
                    <FiveStars value={Number(language.reading)} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 11 }}>
                      {t("labels.skillInteraction", {
                        ns: "languageProfile",
                      })}
                    </Text>
                    <FiveStars value={Number(language.interaction)} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 11 }}>
                      {t("labels.skillListeningComprehension", {
                        ns: "languageProfile",
                      })}
                    </Text>
                    <FiveStars value={Number(language.listening)} />
                  </View>
                </View>
                <Text style={{ fontSize: 11, marginBottom: 10 }}>
                  {language.general}
                </Text>
              </View>
            ))}
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default CvPdf;
