import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  useStudyProgressContextState,
  useStudyProgressContextUpdater,
  useStudyProgressStaticDataContext,
} from "./context";
import SignUpBehalfStudentDialog from "./dialogs/sign-up-behalf-student";
import ProgressList from "./progress-list";
import ProgressTable from "./progress-table";

export type StudyProgrammeName = "Nettilukio" | "Nettiperuskoulu";

/**
 * StudyProgressProps
 */
interface StudyProgressProps {
  editMode: boolean;
  studyProgrammeName: string;
  curriculumName: string;
}

/**
 * StudyProgress
 * @param props props
 * @returns JSX.Element
 */
const StudyProgress = (props: StudyProgressProps) => {
  const { curriculumName, studyProgrammeName, editMode } = props;

  const { t } = useTranslation("studymatrix");

  const studyProgressStatic = useStudyProgressStaticDataContext();

  const { closeSignUpBehalfDialog } = useStudyProgressContextUpdater();

  const { signUpDialog } = useStudyProgressContextState();

  {
    // TODO: lokalisointi
  }
  return (
    <>
      <div className="hops-container__study-tool-indicators">
        <div className="hops-container__study-tool-indicator-container--legend-title">
          {t("labels.colorDescriptions")}
        </div>
        <div className="hops-container__study-tool-indicator-container">
          <div className="hops-container__indicator-item hops-container__indicator-item--mandatory"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.mandatory")}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--optional"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.optional")}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--approval"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.transfered")}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--completed"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.completed")}
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--inprogress"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.inprogress")}
          </div>
        </div>

        {studyProgressStatic.useCase === "hops-planning" && (
          <>
            <div className="hops-container__study-tool-indicator-container ">
              <div className="hops-container__indicator-item hops-container__indicator-item--selected"></div>
              <div className="hops-container__indicator-item-label">
                {t("labels.selected")}
              </div>
            </div>
            <div className="hops-container__study-tool-indicator-container ">
              <div className="hops-container__indicator-item hops-container__indicator-item--suggested"></div>
              <div className="hops-container__indicator-item-label">
                {t("labels.guidanceCouncelorSuggestion")}
              </div>
            </div>
          </>
        )}

        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--next"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.guidanceCouncelorSuggestionNext")}
          </div>
        </div>
      </div>

      <div className="hops__form-element-container hops__form-element-container--pad-upforwards swiper-no-swiping">
        <div className="list">
          <ProgressTable
            curriculumName={curriculumName}
            studyProgrammeName={studyProgrammeName}
            editMode={editMode}
          />
        </div>
      </div>

      <div className="hops__form-element-container hops__form-element-container--mobile swiper-no-swiping">
        <div className="table">
          <ProgressList
            curriculumName={curriculumName}
            studyProgrammeName={studyProgrammeName}
            editMode={editMode}
          />
        </div>
      </div>

      <SignUpBehalfStudentDialog
        studentEntityId={signUpDialog && signUpDialog.studentEntityId}
        workspaceSuggestion={signUpDialog && signUpDialog.suggestion}
        onClose={closeSignUpBehalfDialog}
      />
    </>
  );
};

export default StudyProgress;
