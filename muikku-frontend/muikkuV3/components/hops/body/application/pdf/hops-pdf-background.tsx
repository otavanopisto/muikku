import * as React from "react";
import { Page, Text } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { HopsForm, isCompulsoryStudiesHops } from "~/@types/hops";
import { styles } from "./hops-pdf-styles";
import HopsPdfBackgroundCompulsory from "./background/hops-pdf-background-compulsory";
import HopsPdfBackgroundSecondary from "./background/hops-pdf-background-secondary";

/**
 * HopsPdfBackgroundProps
 */
interface HopsPdfBackgroundProps {
  pageHeader: React.ReactNode;
  form: HopsForm | null;
}

/**
 * Background section of the HOPS PDF. One Page; react-pdf splits overflow.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfBackground = (props: HopsPdfBackgroundProps) => {
  const { pageHeader, form } = props;
  const { t } = useTranslation(["hops_new", "common"]);

  return (
    <Page style={styles.body} size="A4">
      {pageHeader}
      <Text style={styles.pageTitle}>
        {t("labels.hopsBackground", { ns: "hops_new" })}
      </Text>
      {!form ? (
        <Text style={styles.empty}>{t("content.empty", { ns: "common" })}</Text>
      ) : isCompulsoryStudiesHops(form) ? (
        <HopsPdfBackgroundCompulsory form={form} />
      ) : (
        <HopsPdfBackgroundSecondary form={form} />
      )}
    </Page>
  );
};

export default HopsPdfBackground;
