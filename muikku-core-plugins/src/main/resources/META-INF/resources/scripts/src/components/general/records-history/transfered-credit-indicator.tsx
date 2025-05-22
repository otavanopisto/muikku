import * as React from "react";
import { localize } from "~/locales/i18n";
import { getShortenGradeExtension, shortenGrade } from "~/util/modifiers";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import { WorkspaceActivity } from "~/generated/client";

/**
 * TransfereCreditValueIndicatorProps
 */
interface TransfereCreditIndicatorProps {
  transferCredit: WorkspaceActivity;
}

/**
 * Creates indicator for transferecredit
 * @param props Component props
 * @returns React.JSX.Element
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
  const assessment = transferCredit.assessmentStates[0];

  return (
    <Dropdown
      openByHover
      content={
        <span>
          {t("content.transferCreditsDate", {
            ns: "studies",
            date: localize.date(assessment.date),
          }) + getShortenGradeExtension(assessment.grade)}
        </span>
      }
    >
      <span
        className={`application-list__indicator-badge application-list__indicator-badge-course ${
          assessment.passingGrade ? "state-PASSED" : "state-FAILED"
        }`}
      >
        {shortenGrade(assessment.grade)}
      </span>
    </Dropdown>
  );
};

export default TransferedCreditIndicator;
