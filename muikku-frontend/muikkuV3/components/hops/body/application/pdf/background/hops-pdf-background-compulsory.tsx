import * as React from "react";
import { Text, View } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { CompulsoryStudiesHops } from "~/@types/hops";
import { Education } from "~/@types/shared";
import { styles } from "../hops-pdf-styles";
import {
  PdfInfoField,
  PdfScaleLegend,
  PdfScaleRow,
  PdfSectionTitle,
} from "../hops-pdf-info-field";
import {
  displayText,
  formatLanguageGrade,
  formatPreviousEducation,
  formatWorkExperience,
} from "../hops-pdf-helpers";

/**
 * HopsPdfBackgroundCompulsoryProps
 */
interface HopsPdfBackgroundCompulsoryProps {
  form: CompulsoryStudiesHops;
}

/**
 * Compulsory-studies Background fields for the HOPS PDF.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfBackgroundCompulsory = (
  props: HopsPdfBackgroundCompulsoryProps
) => {
  const { form } = props;
  const { t } = useTranslation(["hops_new"]);

  const supportItems = [
    form.fromFamilyMember &&
      t("labels.hopsCompulsoryFromFamilyMember", { ns: "hops_new" }),
    form.fromFriend && t("labels.hopsCompulsoryFromFriend", { ns: "hops_new" }),
    form.fromSupportPerson &&
      t("labels.hopsCompulsoryFromSupportPerson", { ns: "hops_new" }),
    form.noSupport && t("labels.hopsCompulsoryNoSupport", { ns: "hops_new" }),
    form.studySupportSomethingElse &&
      t("labels.hopsCompulsoryStudySupportSomethingElse", { ns: "hops_new" }),
  ].filter((item): item is string => Boolean(item));

  const languageRows = (form.previousLanguageExperience || []).filter(
    (language) => language.name
  );

  return (
    <View>
      <View style={styles.section}>
        <PdfSectionTitle>
          {t("labels.hopsCompulsoryEntryAssessmentTitle1", { ns: "hops_new" })}
        </PdfSectionTitle>
        <PdfInfoField
          label={t("labels.hopsCompulsoryPreviousEducation", {
            ns: "hops_new",
          })}
          value={formatPreviousEducation(t, form.previousEducation)}
        />
        {form.previousEducation === Education.SOMETHING_ELSE ? (
          <PdfInfoField
            label={t("labels.hopsCompulsoryPreviousEducationElse", {
              ns: "hops_new",
            })}
            value={form.previousEducationElse}
          />
        ) : null}
        <PdfInfoField
          label={t("labels.hopsCompulsoryPreviousYearsUsedInStudies", {
            ns: "hops_new",
          })}
          value={form.previousYearsUsedInStudies}
        />
        <PdfInfoField
          label={t("labels.hopsCompulsoryPreviousWorkExperience", {
            ns: "hops_new",
          })}
          value={formatWorkExperience(t, form.previousWorkExperience)}
        />
        <PdfInfoField
          label={t("labels.hopsCompulsoryPreviousWorkExperienceField", {
            ns: "hops_new",
          })}
          value={form.previousWorkExperienceField}
        />
      </View>

      <View style={styles.section}>
        <PdfSectionTitle>
          {t("labels.hopsCompulsoryEntryAssessmentTitle2", { ns: "hops_new" })}
        </PdfSectionTitle>
        {languageRows.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableRow} wrap={false}>
              <Text style={styles.tableHeaderCellMain}>
                {t("labels.hopsCompulsoryLanguageTableLang", {
                  ns: "hops_new",
                })}
              </Text>
              <Text style={styles.tableHeaderCellAside}>
                {t("labels.hopsCompulsoryPreviousLanguageExperience", {
                  ns: "hops_new",
                })}
              </Text>
            </View>
            {languageRows.map((language, index) => (
              <View
                key={`${language.name}-${index}`}
                style={styles.tableRow}
                wrap={false}
              >
                <Text style={styles.tableCellMain}>{language.name}</Text>
                <Text style={styles.tableCellAside}>
                  {formatLanguageGrade(t, language.grade)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>-</Text>
        )}
      </View>

      <View style={styles.section}>
        <PdfSectionTitle>
          {t("labels.hopsCompulsorySelfAssessmentTitle1", { ns: "hops_new" })}
        </PdfSectionTitle>

        <PdfScaleLegend />

        <View style={styles.scaleRowContainer}>
          <PdfScaleRow
            label={t("labels.hopsCompulsoryByReadingMaterials", {
              ns: "hops_new",
            })}
            value={form.byReadingMaterials}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryByTakingNotes", { ns: "hops_new" })}
            value={form.byTakingNotes}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryByDoingExercises", {
              ns: "hops_new",
            })}
            value={form.byDoingExercises}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryByMemorizing", { ns: "hops_new" })}
            value={form.byMemorizing}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryByWatchingVideos", {
              ns: "hops_new",
            })}
            value={form.byWatchingVideos}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryByListeningTeaching", {
              ns: "hops_new",
            })}
            value={form.byListeningTeaching}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryByExplaining", { ns: "hops_new" })}
            value={form.byExplaining}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryByDiscussing", { ns: "hops_new" })}
            value={form.byDiscussing}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryByWatchingOrDoingExamples", {
              ns: "hops_new",
            })}
            value={form.byWatchingOrDoingExamples}
          />
        </View>

        <PdfInfoField
          label={t("labels.hopsCompulsorySomeOtherWay", { ns: "hops_new" })}
          value={form.someOtherWay}
        />
      </View>

      <View style={styles.section}>
        <PdfSectionTitle>
          {t("labels.hopsCompulsorySelfAssessmentTitle2", { ns: "hops_new" })}
        </PdfSectionTitle>
        {supportItems.length > 0 ? (
          supportItems.map((item) => (
            <Text key={item} style={styles.listItem}>
              - {item}
            </Text>
          ))
        ) : (
          <Text style={styles.listItem}>-</Text>
        )}
        {form.studySupportSomethingElse ? (
          <PdfInfoField
            label={t("labels.hopsCompulsoryStudySupportSomethingElseWhat", {
              ns: "hops_new",
            })}
            value={form.studySupportSomethingElseWhat}
          />
        ) : null}
      </View>

      <View style={styles.section}>
        <PdfSectionTitle>
          {t("labels.hopsCompulsorySelfAssessmentTitle3", { ns: "hops_new" })}
        </PdfSectionTitle>

        <PdfScaleLegend />

        <View style={styles.scaleRowContainer}>
          <PdfScaleRow
            label={t("labels.hopsCompulsoryLikeStudying", { ns: "hops_new" })}
            value={form.likeStudying}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryHaveGoals", { ns: "hops_new" })}
            value={form.haveGoals}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryReadyToAchieveGoals", {
              ns: "hops_new",
            })}
            value={form.readyToAchieveGoals}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryAlwaysFinishJobs", {
              ns: "hops_new",
            })}
            value={form.alwaysFinishJobs}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryBePedantic", { ns: "hops_new" })}
            value={form.bePedantic}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryStudyingConcentration", {
              ns: "hops_new",
            })}
            value={form.studyingConcentration}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryAffectedByNoise", {
              ns: "hops_new",
            })}
            value={form.affectedByNoise}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryCanFollowInstructions", {
              ns: "hops_new",
            })}
            value={form.canFollowInstructions}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryCanEvaluateOwnWork", {
              ns: "hops_new",
            })}
            value={form.canEvaluateOwnWork}
          />
          <PdfScaleRow
            label={t("labels.hopsCompulsoryCanTakeFeedback", {
              ns: "hops_new",
            })}
            value={form.canTakeFeedback}
          />
          <PdfScaleRow
            label={t(
              "labels.hopsCompulsoryCanUseBasicComputerFunctionalities",
              {
                ns: "hops_new",
              }
            )}
            value={form.canUseBasicComputerFunctionalities}
          />
        </View>

        <PdfInfoField
          label={t("labels.hopsCompulsorySelfImageSomethingElse", {
            ns: "hops_new",
          })}
          value={displayText(form.selfImageSomethingElse)}
        />
        <PdfInfoField
          label={t("labels.hopsCompulsoryWishesForTeachersAndSupervisors", {
            ns: "hops_new",
          })}
          value={displayText(form.wishesForTeachersAndSupervisors)}
        />
      </View>
    </View>
  );
};

export default HopsPdfBackgroundCompulsory;
