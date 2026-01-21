import * as React from "react";
import { localize } from "~/locales/i18n";
import { getShortenGradeExtension, shortenGrade } from "~/util/modifiers";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import { StudyActivityItem } from "~/generated/client";

/**
 * TransfereCreditValueIndicatorProps
 */
interface TransfereCreditIndicatorProps {
  transferCredit: StudyActivityItem;
}

/**
 * Creates indicator for transferecredit
 * @param props Component props
 * @returns JSX.Element
 */
const TransferedCreditIndicator: React.FC<TransfereCreditIndicatorProps> = (
  props
) => {
  const { transferCredit } = props;

  const { t } = useTranslation(["studies", "common"]);

  // this shouldn't come to this, but just in case
  if (transferCredit === null) {
    return <div className="application-list__header-secondary" />;
  }

  //Transfred credits have only one assessment to describe them
  //const assessment = transferCredit.assessmentStates[0];

  return (
    <Dropdown
      openByHover
      content={
        <span>
          {t("content.transferCreditsDate", {
            ns: "studies",
            date: localize.date(transferCredit.date),
          }) + getShortenGradeExtension(transferCredit.grade)}
        </span>
      }
    >
      <span
        className={`application-list__indicator-badge application-list__indicator-badge-course ${
          transferCredit.passing ? "state-PASSED" : "state-FAILED"
        }`}
      >
        {shortenGrade(transferCredit.grade)}
      </span>
    </Dropdown>
  );
};

export default TransferedCreditIndicator;
