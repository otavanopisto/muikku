import * as React from "react";
import { useTranslation } from "react-i18next";
//import ProgressList from "../progress-list";
import HopsPlanningTable from "./components/progress-table-hops-planning";

/**
 * ProgressHopsPlanningProps
 */
interface ProgressHopsPlanningProps {
  studyProgrammeName: string;
  curriculumName: string;
}

/**
 * ProgressHopsPlanning
 * @param props props
 * @returns JSX.Element
 */
const ProgressHopsPlanning: React.FC<ProgressHopsPlanningProps> = (props) => {
  const { studyProgrammeName, curriculumName } = props;

  const { t } = useTranslation(["studyMatrix"]);

  return (
    <>
      <div className="hops-container__study-tool-indicators">
        <div className="hops-container__study-tool-indicator-container--legend-title">
          {t("labels.colorDescriptions", { ns: "studyMatrix" })}
        </div>
        <div className="hops-container__study-tool-indicator-container">
          <div className="hops-container__indicator-item hops-container__indicator-item--mandatory"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.mandatory", { ns: "studyMatrix" })}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--optional"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.optional", { ns: "studyMatrix" })}
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
          <div className="hops-container__indicator-item hops-container__indicator-item--inprogress"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.inProgress", { ns: "studyMatrix" })}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--selected"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.selected", { ns: "studyMatrix" })}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--suggested"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.guidanceCouncelorSuggestion", { ns: "studyMatrix" })}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--next"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.guidanceCouncelorSuggestionNext", { ns: "studyMatrix" })}
          </div>
        </div>
      </div>

      <div className="hops__form-element-container hops__form-element-container--pad-upforwards swiper-no-swiping">
        <div className="list">
          <HopsPlanningTable
            studyProgrammeName={studyProgrammeName}
            curriculumName={curriculumName}
            studentOptions={[]}
          />
        </div>
      </div>

      <div className="hops__form-element-container hops__form-element-container--mobile swiper-no-swiping">
        <div className="table">
          {/* <ProgressList
            curriculumName={curriculumName}
            studyProgrammeName={studyProgrammeName}
            editMode={false}
          /> */}
        </div>
      </div>
    </>
  );
};

export default ProgressHopsPlanning;
