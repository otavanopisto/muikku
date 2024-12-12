import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  useStudyProgressContextState,
  useStudyProgressContextUpdater,
  useStudyProgressStaticDataContext,
} from "./context";
import SignUpBehalfStudentDialog from "./dialogs/sign-up-behalf-student";
import WorkspaceSignup from "~/components/coursepicker/dialogs/workspace-signup";
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

  const { t } = useTranslation("studyMatrix");

  const studyProgressStatic = useStudyProgressStaticDataContext();

  const { closeSignUpBehalfDialog } = useStudyProgressContextUpdater();

  const { signUpDialog } = useStudyProgressContextState();

  return (
    <>
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
        isOpen={signUpDialog && studyProgressStatic.user === "supervisor"}
        studentEntityId={signUpDialog && signUpDialog.studentEntityId}
        workspaceSuggestion={signUpDialog && signUpDialog.suggestion}
        onClose={closeSignUpBehalfDialog}
      />

      <WorkspaceSignup
        isOpen={signUpDialog && studyProgressStatic.user === "student"}
        workspaceSignUpDetails={
          signUpDialog && {
            id: signUpDialog.suggestion.id,
            name: signUpDialog.suggestion.name,
            nameExtension: signUpDialog.suggestion.nameExtension,
            urlName: signUpDialog.suggestion.urlName,
          }
        }
        onClose={closeSignUpBehalfDialog}
        redirectOnSuccess={false}
      />
    </>
  );
};

export default StudyProgress;
