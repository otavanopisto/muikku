import * as React from "react";
import { Text, View } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import {
  PostGraduateStudies,
  SecondaryStudiesHops,
  WhatNext,
} from "~/@types/hops";
import { styles } from "../hops-pdf-styles";
import { PdfInfoField, PdfSectionTitle } from "../hops-pdf-info-field";
import { formatPostGraduateStudies, formatWhatNext } from "../hops-pdf-helpers";

const WHAT_NEXT_ORDER: WhatNext[] = [
  "POSTGRADUATE_STUDIES",
  "WORKING_LIFE",
  "DONT_KNOW",
  "ELSE",
];

const POST_GRADUATE_STUDIES_ORDER: PostGraduateStudies[] = [
  "UNIVERSITY",
  "UNIVERSITY_OF_APPLIED_SCIENCES",
  "VOCATIONAL_SCHOOL",
  "ELSE",
];

/**
 * HopsPdfPostgraduateSecondaryProps
 */
interface HopsPdfPostgraduateSecondaryProps {
  form: SecondaryStudiesHops;
}

/**
 * Upper-secondary postgraduate fields for the HOPS PDF.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfPostgraduateSecondary = (
  props: HopsPdfPostgraduateSecondaryProps
) => {
  const { form } = props;
  const { t } = useTranslation(["hops_new"]);

  const selectedWhatNext = WHAT_NEXT_ORDER.filter((value) =>
    (form.whatNext || []).includes(value)
  );
  const selectedPostGraduateStudies = POST_GRADUATE_STUDIES_ORDER.filter(
    (value) => (form.postGraduateStudies || []).includes(value)
  );
  const showPostGraduateStudies = selectedWhatNext.includes(
    "POSTGRADUATE_STUDIES"
  );

  return (
    <View>
      <PdfSectionTitle>
        {t("labels.hopsSecondaryPostgraduateSubTitle1", { ns: "hops_new" })}
      </PdfSectionTitle>
      {selectedWhatNext.length > 0 ? (
        selectedWhatNext.map((value) => (
          <Text key={value} style={styles.listItem}>
            - {formatWhatNext(t, value)}
          </Text>
        ))
      ) : (
        <Text style={styles.empty}>-</Text>
      )}
      {selectedWhatNext.includes("ELSE") ? (
        <PdfInfoField
          label={t("labels.hopsSecondaryWhatNextElse", { ns: "hops_new" })}
          value={form.whatNextElse}
        />
      ) : null}
      {showPostGraduateStudies ? (
        <>
          {selectedPostGraduateStudies.length > 0 ? (
            selectedPostGraduateStudies.map((value) => (
              <Text key={value} style={styles.listItem}>
                - {formatPostGraduateStudies(t, value)}
              </Text>
            ))
          ) : (
            <Text style={styles.empty}>-</Text>
          )}
          {selectedPostGraduateStudies.includes("ELSE") ? (
            <PdfInfoField
              label={t("labels.hopsSecondaryPostGraduateStudiesElse", {
                ns: "hops_new",
              })}
              value={form.postGraduateStudiesElse}
            />
          ) : null}
        </>
      ) : null}

      <PdfSectionTitle>
        {t("labels.hopsSecondaryPostgraduateSubTitle2", { ns: "hops_new" })}
      </PdfSectionTitle>
      <PdfInfoField
        label={t("labels.hopsSecondaryWorkExperienceAndIntership", {
          ns: "hops_new",
        })}
        value={form.workExperienceAndInternships}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryHobbies", { ns: "hops_new" })}
        value={form.hobbies}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryOtherSkills", { ns: "hops_new" })}
        value={form.otherSkills}
      />
      <PdfInfoField
        label={t("labels.hopsSecondarySkillsFromHobbiesAndWorklife", {
          ns: "hops_new",
        })}
        value={form.skillsFromHobbiesAndWorklife}
      />

      <PdfSectionTitle>
        {t("labels.hopsSecondaryPostgraduateSubTitle3", { ns: "hops_new" })}
      </PdfSectionTitle>
      <PdfInfoField
        label={t("labels.hopsSecondarySuccesfullDuringHighSchool", {
          ns: "hops_new",
        })}
        value={form.successfulDuringHighSchool}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryChallangesDuringHighSchool", {
          ns: "hops_new",
        })}
        value={form.challengesDuringHighSchool}
      />

      <PdfSectionTitle>
        {t("labels.hopsSecondaryPostgraduateSubTitle4", { ns: "hops_new" })}
      </PdfSectionTitle>
      <PdfInfoField
        label={t("labels.hopsSecondaryInterestedIn", { ns: "hops_new" })}
        value={form.interestedIn}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryAmGood", { ns: "hops_new" })}
        value={form.goodAt}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryImportantInFutureWork", {
          ns: "hops_new",
        })}
        value={form.importantInFutureWork}
      />

      <PdfSectionTitle>
        {t("labels.hopsSecondaryPostgraduateSubTitle5", { ns: "hops_new" })}
      </PdfSectionTitle>
      <PdfInfoField
        label={t("labels.hopsSecondaryInterestedInFieldsOfStudy", {
          ns: "hops_new",
        })}
        value={form.interestedInFieldsOfStudy}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryWhereCanStudyFieldsOfInterest", {
          ns: "hops_new",
        })}
        value={form.whereCanStudyFieldsOfInterest}
      />
      <PdfInfoField
        label={t(
          "labels.hopsSecondaryBasisForPostgraduateStudyAndCareerChoice",
          {
            ns: "hops_new",
          }
        )}
        value={form.basisForPostgraduateStudyAndCareerChoice}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryThingsMakesYouThink", { ns: "hops_new" })}
        value={form.thingsMakesYouThink}
      />
      <PdfInfoField
        label={t("labels.hopsSecondaryPostGraduateGuidanceCouncelorComments", {
          ns: "hops_new",
        })}
        value={form.postGraduateGuidanceCouncelorComments}
      />
    </View>
  );
};

export default HopsPdfPostgraduateSecondary;
