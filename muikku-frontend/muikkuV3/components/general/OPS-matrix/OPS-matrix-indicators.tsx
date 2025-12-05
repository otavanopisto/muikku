import * as React from "react";
import { useTranslation } from "react-i18next";

/**
 * OPS matrix indicators props
 */
interface OPSMatrixIndicatorsProps {}

/**
 * OPS matrix indicators component
 * @param props props
 * @returns JSX.Element
 */
const OPSMatrixIndicators: React.FC<OPSMatrixIndicatorsProps> = (props) => {
  const { t } = useTranslation(["studyMatrix"]);

  return (
    <div className="hops-container__study-tool-indicators">
      <div className="hops-container__study-tool-indicator-container--legend-title">
        {t("labels.legendDescriptions", { ns: "studyMatrix" })}
      </div>
      <div className="hops-container__study-tool-indicator-container">
        <div className="hops-container__indicator-item hops-container__indicator-item--mandatory">
          {t("labels.mandatoryShorthand", { ns: "studyMatrix" })}
        </div>
        <div className="hops-container__indicator-item-label">
          {t("labels.mandatory", { ns: "studyMatrix" })}
        </div>
      </div>
      <div className="hops-container__study-tool-indicator-container">
        <div className="hops-container__indicator-item hops-container__indicator-item--mandatory hops-container__indicator-item--not-available">
          {t("labels.mandatoryShorthand", { ns: "studyMatrix" })}
        </div>
        <div className="hops-container__indicator-item-label">
          {t("labels.mandatoryNotAvailable", { ns: "studyMatrix" })}
        </div>
      </div>
      <div className="hops-container__study-tool-indicator-container ">
        <div className="hops-container__indicator-item hops-container__indicator-item--optional">
          {t("labels.optionalShorthand", { ns: "studyMatrix" })}
          <sup>*</sup>
        </div>
        <div className="hops-container__indicator-item-label">
          {t("labels.optional", { ns: "studyMatrix" })}
        </div>
      </div>
      <div className="hops-container__study-tool-indicator-container ">
        <div className="hops-container__indicator-item hops-container__indicator-item--optional hops-container__indicator-item--not-available">
          {t("labels.optionalShorthand", { ns: "studyMatrix" })}
          <sup>*</sup>
        </div>
        <div className="hops-container__indicator-item-label">
          {t("labels.optionalNotAvailable", { ns: "studyMatrix" })}
        </div>
      </div>
      <div className="hops-container__study-tool-indicator-container ">
        <div className="hops-container__indicator-item hops-container__indicator-item--approval"></div>
        <div className="hops-container__indicator-item-label">
          {t("labels.transferred", { ns: "studyMatrix" })}
        </div>
      </div>
      <div className="hops-container__study-tool-indicator-container ">
        <div className="hops-container__indicator-item hops-container__indicator-item--completed"></div>
        <div className="hops-container__indicator-item-label">
          {t("labels.completed", { ns: "studyMatrix" })}
        </div>
      </div>
      <div className="hops-container__study-tool-indicator-container ">
        <div className="hops-container__indicator-item hops-container__indicator-item--aborted">
          {t("labels.abortedShorthand", { ns: "studyMatrix" })}
        </div>
        <div className="hops-container__indicator-item-label">
          {t("labels.aborted", { ns: "studyMatrix" })}
        </div>
      </div>
      <div className="hops-container__study-tool-indicator-container ">
        <div className="hops-container__indicator-item hops-container__indicator-item--supplementationrequest">
          {t("labels.supplementationRequestShorthand", { ns: "studyMatrix" })}
        </div>
        <div className="hops-container__indicator-item-label">
          {t("labels.supplementationRequest", { ns: "studyMatrix" })}
        </div>
      </div>
      <div className="hops-container__study-tool-indicator-container ">
        <div className="hops-container__indicator-item hops-container__indicator-item--inprogress"></div>
        <div className="hops-container__indicator-item-label">
          {t("labels.inProgress", { ns: "studyMatrix" })}
        </div>
      </div>
      <div className="hops-container__study-tool-indicator-container ">
        <div className="hops-container__indicator-item hops-container__indicator-item--next"></div>
        <div className="hops-container__indicator-item-label">
          {t("labels.suggestedNext", { ns: "studyMatrix" })}
        </div>
      </div>
    </div>
  );
};

export default OPSMatrixIndicators;
