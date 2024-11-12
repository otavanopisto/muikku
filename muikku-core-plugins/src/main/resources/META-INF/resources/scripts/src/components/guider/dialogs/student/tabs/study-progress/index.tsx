import * as React from "react";
import { useTranslation } from "react-i18next";
import { GuiderStudentStudyProgress } from "~/reducers/main-function/guider";
import GuiderStateOfStudiesList from "./components/progress-list-state-of-studies";
import SignUpBehalfStudentDialog from "./dialogs/sign-up-behalf-student";
import GuiderStateOfStudiesTable from "./components/progress-table-state-of-studies";
import { useState } from "react";
import { WorkspaceSuggestion } from "~/generated/client";

/**
 * ProgressHopsPlanningProps
 */
interface ProgressGuiderStateOfStudiesProps {
  studentIdentifier: string;
  studentUserEntityId: number;
  studyProgrammeName: string;
  curriculumName: string;
  studyProgress: GuiderStudentStudyProgress;
}

/**
 * ProgressGuiderStateOfStudies
 * @param props props
 * @returns JSX.Element
 */
const ProgressGuiderStateOfStudies: React.FC<
  ProgressGuiderStateOfStudiesProps
> = (props) => {
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
          <div className="hops-container__indicator-item hops-container__indicator-item--next"></div>
          <div className="hops-container__indicator-item-label">
            {t("labels.guidanceCouncelorSuggestionNext", { ns: "studyMatrix" })}
          </div>
        </div>
      </div>

      <div className="hops__form-element-container hops__form-element-container--pad-upforwards swiper-no-swiping">
        <div className="list">
          <GuiderStateOfStudiesTable
            studentIdentifier={studentIdentifier}
            studentUserEntityId={studentUserEntityId}
            studyProgrammeName={studyProgrammeName}
            curriculumName={curriculumName}
            suggestedNextList={studyProgress.suggestedNextList}
            onGoingList={studyProgress.onGoingList}
            transferedList={studyProgress.transferedList}
            gradedList={studyProgress.gradedList}
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
          <GuiderStateOfStudiesList
            studentIdentifier={studentIdentifier}
            studentUserEntityId={studentUserEntityId}
            curriculumName={curriculumName}
            studyProgrammeName={studyProgrammeName}
            suggestedNextList={studyProgress.suggestedNextList}
            onGoingList={studyProgress.onGoingList}
            transferedList={studyProgress.transferedList}
            gradedList={studyProgress.gradedList}
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

export default ProgressGuiderStateOfStudies;
