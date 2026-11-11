import * as React from "react";
import { Text, View } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { styles } from "./hops-pdf-styles";
import { formatScaleValue, stripHtml } from "./hops-pdf-helpers";

/**
 * PdfInfoFieldProps
 */
interface PdfInfoFieldProps {
  label: string;
  value?: string | number | null;
}

/**
 * Shared label/value block for HOPS PDF sections.
 *
 * @param props props
 * @returns JSX.Element
 */
export const PdfInfoField = (props: PdfInfoFieldProps) => {
  const { label, value } = props;
  const displayValue =
    value === undefined || value === null || value === "" ? "-" : String(value);

  return (
    <View style={styles.infoFieldContainer} wrap={false}>
      <Text style={styles.infoFieldLabel}>{label}</Text>
      <Text style={styles.infoFieldValue}>{displayValue}</Text>
    </View>
  );
};

/**
 * PdfSectionTitleProps
 */
interface PdfSectionTitleProps {
  children: string;
}

/**
 * Subsection heading inside a HOPS PDF page.
 *
 * @param props props
 * @returns JSX.Element
 */
export const PdfSectionTitle = (props: PdfSectionTitleProps) => (
  <Text style={styles.sectionTitle}>{props.children}</Text>
);

/**
 * PdfScaleRowProps
 */
interface PdfScaleRowProps {
  label: string;
  value?: number;
}

/**
 * One self-assessment statement and its 1-5 value.
 *
 * @param props props
 * @returns JSX.Element
 */
export const PdfScaleRow = (props: PdfScaleRowProps) => {
  const { label, value } = props;
  return (
    <View style={styles.scaleRow} wrap={false}>
      <Text style={styles.scaleLabel}>{label}</Text>
      <Text style={styles.scaleValue}>{formatScaleValue(value)}</Text>
    </View>
  );
};

/**
 * PdfEligibilityRowProps
 */
interface PdfEligibilityRowProps {
  eligible: boolean;
  label?: string;
  description: string;
}
/**
 * One eligibility check: Yes/No, optional subject, description.
 *
 * @param props props
 * @returns JSX.Element
 */
export const PdfEligibilityRow = (props: PdfEligibilityRowProps) => {
  const { eligible, label, description } = props;
  const { t } = useTranslation(["common"]);
  return (
    <View style={styles.eligibilityRow} wrap={false}>
      <Text style={styles.eligibilityStatus}>
        {eligible
          ? t("labels.yes", { ns: "common" })
          : t("labels.no", { ns: "common" })}
      </Text>
      <View style={styles.eligibilityContent}>
        {label ? <Text style={styles.eligibilityLabel}>{label}</Text> : null}
        <Text style={styles.eligibilityDescription}>
          {stripHtml(description)}
        </Text>
      </View>
    </View>
  );
};

/**
 * PdfGuideTextProps
 */
interface PdfGuideTextProps {
  children: string;
}
/**
 * Instructional paragraph. Strips HTML from translation strings.
 *
 * @param props props
 * @returns JSX.Element
 */
export const PdfGuideText = (props: PdfGuideTextProps) => (
  <Text style={styles.guideText}>{stripHtml(props.children)}</Text>
);

/**
 * 1–5 self-assessment legend.
 *
 * @returns JSX.Element
 */
export const PdfScaleLegend = () => {
  const { t } = useTranslation(["hops_new"]);
  const levels = [1, 2, 3, 4, 5];
  return (
    <View wrap={false} style={styles.gradeLegend}>
      {levels.map((level) => (
        <View key={level} style={styles.gradeLegendItem}>
          <Text style={styles.gradeLegendCode}>{level}</Text>
          <Text style={styles.gradeLegendCode}>=</Text>
          <Text style={styles.gradeLegendName}>
            {t(`labels.hopsFormSelfAssessmentLevel${level}`, {
              ns: "hops_new",
              defaultValue: "",
            })}
          </Text>
        </View>
      ))}
    </View>
  );
};
