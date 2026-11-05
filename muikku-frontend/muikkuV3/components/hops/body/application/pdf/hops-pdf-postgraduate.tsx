import * as React from "react";
import { Page, Text } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { HopsForm, isCompulsoryStudiesHops } from "~/@types/hops";
import { styles } from "./hops-pdf-styles";
import HopsPdfPostgraduateCompulsory from "./postgraduate/hops-pdf-postgraduate-compulsory";
import HopsPdfPostgraduateSecondary from "./postgraduate/hops-pdf-postgraduate-secondary";

/**
 * HopsPdfPostgraduateProps
 */
interface HopsPdfPostgraduateProps {
  pageHeader: React.ReactNode;
  form: HopsForm | null;
}

/**
 * Postgraduate section of the HOPS PDF. One Page; react-pdf splits overflow.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfPostgraduate = (props: HopsPdfPostgraduateProps) => {
  const { pageHeader, form } = props;
  const { t } = useTranslation(["hops_new", "common"]);

  return (
    <Page style={styles.body} size="A4">
      {pageHeader}
      <Text style={styles.pageTitle}>
        {t("labels.hopsPostgraduate", { ns: "hops_new" })}
      </Text>
      {!form ? (
        <Text style={styles.empty}>{t("content.empty", { ns: "common" })}</Text>
      ) : isCompulsoryStudiesHops(form) ? (
        <HopsPdfPostgraduateCompulsory form={form} />
      ) : (
        <HopsPdfPostgraduateSecondary form={form} />
      )}
    </Page>
  );
};

export default HopsPdfPostgraduate;
