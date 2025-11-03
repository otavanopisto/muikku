import * as React from "react";
import { useTranslation } from "react-i18next";
import { GuiderStudentStudyProgress } from "~/reducers/main-function/guider";
import ProgressList from "./components/progress-list";
import SignUpBehalfStudentDialog from "./dialogs/sign-up-behalf-student";
import ProgressTable from "./components/progress-table";
import { useState } from "react";
import { WorkspaceSuggestion } from "~/generated/client";

/**
 * ProgressHopsPlanningProps
 */
interface StudyProgressProps {
  studentIdentifier: string;
  studentUserEntityId: number;
  studyProgrammeName: string;
  curriculumName: string;
  studyProgress: GuiderStudentStudyProgress;
}

/**
 * StudyProgress
 * @param props props
 * @returns JSX.Element
 */
const StudyProgress: React.FC<StudyProgressProps> = (props) => {
  const {
    studentIdentifier,
    studentUserEntityId,
    studyProgrammeName,
    curriculumName,
    studyProgress,
  } = props;

  const [workspaceToSignUp, setWorkspaceToSignUp] =
    useState<WorkspaceSuggestion | null>(null);

  /**
   * Handles sign up behalf
   * @param workspaceToSignUp workspaceToSignUp
   */
  const handleSignUpBehalf = (workspaceToSignUp: WorkspaceSuggestion) => {
    setWorkspaceToSignUp(workspaceToSignUp);
  };

  const { t } = useTranslation(["studyMatrix"]);

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
            {t("labels.suggestedNext", { ns: "studyMatrix" })}
          </div>
        </div>
      </div>

      <div className="hops__form-element-container hops__form-element-container--pad-upforwards swiper-no-swiping">
        <div className="list">
          <ProgressTable
            studentIdentifier={studentIdentifier}
            studentUserEntityId={studentUserEntityId}
            studyProgrammeName={studyProgrammeName}
            curriculumName={curriculumName}
            suggestedNextList={studyProgress.suggestedNextList}
            onGoingList={studyProgress.onGoingList}
            transferedList={studyProgress.transferedList}
            gradedList={studyProgress.gradedList}
            needSupplementationList={studyProgress.needSupplementationList}
            skillsAndArt={studyProgress.skillsAndArt}
            otherLanguageSubjects={studyProgress.otherLanguageSubjects}
            otherSubjects={studyProgress.otherSubjects}
            studentOptions={studyProgress.options}
            onSignUpBehalf={handleSignUpBehalf}
          />
        </div>
      </div>

      <div className="hops__form-element-container hops__form-element-container--mobile swiper-no-swiping">
        <div className="table">
          <ProgressList
            studentIdentifier={studentIdentifier}
            studentUserEntityId={studentUserEntityId}
            curriculumName={curriculumName}
            studyProgrammeName={studyProgrammeName}
            suggestedNextList={studyProgress.suggestedNextList}
            onGoingList={studyProgress.onGoingList}
            transferedList={studyProgress.transferedList}
            gradedList={studyProgress.gradedList}
            needSupplementationList={studyProgress.needSupplementationList}
            skillsAndArt={studyProgress.skillsAndArt}
            otherLanguageSubjects={studyProgress.otherLanguageSubjects}
            otherSubjects={studyProgress.otherSubjects}
            studentOptions={studyProgress.options}
            onSignUpBehalf={handleSignUpBehalf}
          />
        </div>
      </div>

      <SignUpBehalfStudentDialog
        isOpen={!!workspaceToSignUp}
        studentEntityId={studentUserEntityId}
        workspaceSuggestion={workspaceToSignUp}
        onClose={() => setWorkspaceToSignUp(null)}
      />
    </>
  );
};

export default StudyProgress;
