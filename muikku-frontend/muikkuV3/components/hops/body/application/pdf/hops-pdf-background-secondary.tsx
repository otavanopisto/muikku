import * as React from "react";
import { Text, View } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { SecondaryStudiesHops } from "~/@types/hops";
import { styles } from "./hops-pdf-styles";
import {
  PdfInfoField,
  PdfScaleRow,
  PdfSectionTitle,
} from "./hops-pdf-info-field";
import {
  formatPreviousStudyDuration,
  formatPreviousStudyType,
} from "./hops-pdf-helpers";

/**
 * HopsPdfBackgroundSecondaryProps
 */
interface HopsPdfBackgroundSecondaryProps {
  form: SecondaryStudiesHops;
}

/**
 * Upper-secondary Background fields for the HOPS PDF.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfBackgroundSecondary = (props: HopsPdfBackgroundSecondaryProps) => {
  const { form } = props;
  const { t } = useTranslation(["hops_new"]);

  const previousStudies = (form.previousEducations || []).filter(
    (study) => study.type || study.duration || study.moreInfo
  );

  return (
    <View>
      <PdfSectionTitle>
        {t("labels.hopsSecondaryEntryAssessmentTitle1", { ns: "hops_new" })}
      </PdfSectionTitle>
      {previousStudies.length > 0 ? (
        previousStudies.map((study, index) => (
          <View
            key={`${study.type}-${index}`}
            style={styles.groupedBlock}
            wrap={false}
          >
            <PdfInfoField
              label={t("labels.hopsSecondaryPreviousEducationStudyType", {
                ns: "hops_new",
              })}
              value={formatPreviousStudyType(t, study.type)}
            />
            <PdfInfoField
              label={t("labels.hopsSecondaryPreviousEducationStudyDuration", {
                ns: "hops_new",
              })}
              value={formatPreviousStudyDuration(t, study.duration)}
            />
            {study.moreInfo ? (
              <PdfInfoField
                label={t("labels.hopsSecondaryPreviousEducationMoreInfo", {
                  ns: "hops_new",
                })}
                value={study.moreInfo}
              />
            ) : null}
          </View>
        ))
      ) : (
        <Text style={styles.empty}>-</Text>
      )}

      <PdfSectionTitle>
        {t("labels.hopsSecondaryEntryAssessmentTitle2", { ns: "hops_new" })}
      </PdfSectionTitle>
      <PdfInfoField
        label={t("labels.hopsSecondaryNativeLanguage", { ns: "hops_new" })}
        value={form.nativeLanguage}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryStudiedLanguagesAtSchool", {
          ns: "hops_new",
        })}
        value={form.studiedLanguagesAtSchool}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryStudiedLanguagesOther", {
          ns: "hops_new",
        })}
        value={form.studiedLanguagesOther}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryLanguageLearningSkills", {
          ns: "hops_new",
        })}
        value={form.languageLearningSkills}
      />

      <PdfSectionTitle>
        {t("labels.hopsSecondarySelfAssessmentTitle1", { ns: "hops_new" })}
      </PdfSectionTitle>
      <PdfScaleRow
        label={t("labels.hopsSecondaryPositiveAttitude", { ns: "hops_new" })}
        value={form.positiveAttitude}
      />
      <PdfScaleRow
        label={t("labels.hopsSecondaryGoalSetting", { ns: "hops_new" })}
        value={form.goalSetting}
      />
      <PdfScaleRow
        label={t("labels.hopsSecondaryGoalMotivation", { ns: "hops_new" })}
        value={form.goalMotivation}
      />
      <PdfScaleRow
        label={t("labels.hopsSecondaryTaskCompletion", { ns: "hops_new" })}
        value={form.taskCompletion}
      />
      <PdfScaleRow
        label={t("labels.hopsSecondaryFocusAbility", { ns: "hops_new" })}
        value={form.focusAbility}
      />
      <PdfScaleRow
        label={t("labels.hopsSecondaryFollowInstructions", { ns: "hops_new" })}
        value={form.followInstructions}
      />
      <PdfScaleRow
        label={t("labels.hopsSecondarySelfAssessment", { ns: "hops_new" })}
        value={form.selfAssessment}
      />
      <PdfScaleRow
        label={t("labels.hopsSecondaryReceiveFeedback", { ns: "hops_new" })}
        value={form.receiveFeedback}
      />
      <PdfScaleRow
        label={t("labels.hopsSecondaryItSkills", { ns: "hops_new" })}
        value={form.itSkills}
      />
      <PdfScaleRow
        label={t("labels.hopsSecondaryIndependentLearningSkills", {
          ns: "hops_new",
        })}
        value={form.independentLearningSkills}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryMoreAboutSelfAssessment", {
          ns: "hops_new",
        })}
        value={form.moreAboutSelfAssessment}
      />
    </View>
  );
};

export default HopsPdfBackgroundSecondary;
