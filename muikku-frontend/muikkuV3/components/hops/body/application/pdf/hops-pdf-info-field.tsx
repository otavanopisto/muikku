import * as React from "react";
import { Text, View } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { styles } from "./hops-pdf-styles";
import { formatScaleValue } from "./hops-pdf-helpers";

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
  const { t } = useTranslation(["hops_new"]);

  return (
    <View style={styles.scaleRow} wrap={false}>
      <Text style={styles.scaleLabel}>{label}</Text>
      <Text style={styles.scaleValue}>{formatScaleValue(t, value)}</Text>
    </View>
  );
};
