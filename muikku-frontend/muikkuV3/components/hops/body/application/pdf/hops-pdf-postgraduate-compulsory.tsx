import * as React from "react";
import { View } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { CompulsoryStudiesHops } from "~/@types/hops";
import { PdfInfoField, PdfSectionTitle } from "./hops-pdf-info-field";
import {
  formatPostGraduateStudies,
  formatVocationalStudySector,
  formatWhatNext,
} from "./hops-pdf-helpers";

/**
 * HopsPdfPostgraduateCompulsoryProps
 */
interface HopsPdfPostgraduateCompulsoryProps {
  form: CompulsoryStudiesHops;
}

/**
 * Compulsory-studies postgraduate fields for the HOPS PDF.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfPostgraduateCompulsory = (
  props: HopsPdfPostgraduateCompulsoryProps
) => {
  const { form } = props;
  const { t } = useTranslation(["hops_new"]);

  const showPostGraduateStudies = form.whatNext === "POSTGRADUATE_STUDIES";
  const showPostGraduateStudiesElse =
    showPostGraduateStudies && form.postGraduateStudies === "ELSE";
  const showVocationalSector =
    showPostGraduateStudies && form.postGraduateStudies === "VOCATIONAL_SCHOOL";
  const showVocationalSectorElse =
    showVocationalSector &&
    form.vocationalPostGraduateStudySector === "SOMETHING_ELSE";

  return (
    <View>
      <PdfSectionTitle>
        {t("labels.hopsCompulsoryPostgraduateSubTitle1", { ns: "hops_new" })}
      </PdfSectionTitle>
      <PdfInfoField
        label={t("labels.hopsCompulsoryWhatNext", { ns: "hops_new" })}
        value={formatWhatNext(t, form.whatNext)}
      />
      {showPostGraduateStudies ? (
        <PdfInfoField
          label={t("labels.hopsCompulsoryWhereApply", { ns: "hops_new" })}
          value={formatPostGraduateStudies(t, form.postGraduateStudies)}
        />
      ) : null}
      {showPostGraduateStudiesElse ? (
        <PdfInfoField
          label={t("labels.hopsTellMore", { ns: "hops_new" })}
          value={form.postGraduateStudiesElse}
        />
      ) : null}
      {showVocationalSector ? (
        <PdfInfoField
          label={t("labels.hopsCompulsoryVocationalSector", { ns: "hops_new" })}
          value={formatVocationalStudySector(
            t,
            form.vocationalPostGraduateStudySector
          )}
        />
      ) : null}
      {showVocationalSectorElse ? (
        <PdfInfoField
          label={t("labels.hopsTellMore", { ns: "hops_new" })}
          value={form.vocationalPostGraduateStudySectorElse}
        />
      ) : null}
      <PdfInfoField
        label={t("labels.hopsCompulsoryTellMoreFuturePlan", { ns: "hops_new" })}
        value={form.futurePlans}
      />
    </View>
  );
};

export default HopsPdfPostgraduateCompulsory;
