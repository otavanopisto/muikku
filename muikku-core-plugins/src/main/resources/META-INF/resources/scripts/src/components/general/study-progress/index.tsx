import * as React from "react";
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
  studyProgrammeName: StudyProgrammeName;
}

/**
 * StudyProgress
 * @param props props
 * @returns JSX.Element
 */
const StudyProgress = (props: StudyProgressProps) => {
  const { studyProgrammeName, editMode } = props;

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
          Värien kuvaukset
        </div>
        <div className="hops-container__study-tool-indicator-container">
          <div className="hops-container__indicator-item hops-container__indicator-item--mandatory"></div>
          <div className="hops-container__indicator-item-label">Pakollinen</div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--optional"></div>
          <div className="hops-container__indicator-item-label">
            (*)-Valinnainen
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--approval"></div>
          <div className="hops-container__indicator-item-label">
            Hyväksiluettu
          </div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--completed"></div>
          <div className="hops-container__indicator-item-label">Suoritettu</div>
        </div>
        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--inprogress"></div>
          <div className="hops-container__indicator-item-label">Kesken</div>
        </div>

        {studyProgressStatic.useCase === "hops-planning" && (
          <>
            <div className="hops-container__study-tool-indicator-container ">
              <div className="hops-container__indicator-item hops-container__indicator-item--selected"></div>
              <div className="hops-container__indicator-item-label">
                Valittu
              </div>
            </div>
            <div className="hops-container__study-tool-indicator-container ">
              <div className="hops-container__indicator-item hops-container__indicator-item--suggested"></div>
              <div className="hops-container__indicator-item-label">
                Ohjaajan ehdottama
              </div>
            </div>
          </>
        )}

        <div className="hops-container__study-tool-indicator-container ">
          <div className="hops-container__indicator-item hops-container__indicator-item--next"></div>
          <div className="hops-container__indicator-item-label">
            Ohjaajan seuraavaksi ehdottama
          </div>
        </div>
      </div>

      <div className="hops__form-element-container hops__form-element-container--pad-upforwards swiper-no-swiping">
        <div className="list">
          <ProgressTable
            studyProgrammeName={studyProgrammeName}
            editMode={editMode}
          />
        </div>
      </div>

      <div className="hops__form-element-container hops__form-element-container--mobile swiper-no-swiping">
        <div className="table">
          <ProgressList
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
