import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Link from "~/components/general/link";
import { EvaluationAssessmentRequest } from "~/generated/client";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import EvaluationNoteEditor from "./editors/evaluation-note-editor";
import SlideDrawer from "./slide-drawer";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import DeleteEvaluationNote from "~/components/evaluation/dialogs/delete-evaluation-note";

/**
 * Evaluation Notes List Props
 */
interface EvaluationNotesListProps {
  selectedAssessment: EvaluationAssessmentRequest;
}

/**
 * Evaluation Notes List
 * @param props props
 */
const EvaluationNotesList: React.FC<EvaluationNotesListProps> = (props) => {
  const { selectedAssessment } = props;

  const { t } = useTranslation();

  const [evaluationNoteEditorOpen, setEvaluationNoteEditorOpen] =
    React.useState(false);

  const { evaluationNotes } = useSelector(
    (state: StateType) => state.evaluations
  );

  /**
   * Handle evaluation note editor state click
   */
  const handleEvaluationNoteEditorStateClick = () => {
    setEvaluationNoteEditorOpen(!evaluationNoteEditorOpen);
  };

  const evaluationNoteIsReady = evaluationNotes.state === "READY";

  // For now we only support one evaluation note even though API supports multiple
  // Could be changed easily to support multiple evaluation notes
  const evaluationNote = evaluationNotes.data?.[0];

  return (
    <div className="evaluation-modal__content">
      <div className="evaluation-modal__content-title">
        {t("labels.evaluationNotes", { ns: "evaluation" })}
      </div>

      {evaluationNoteIsReady ? (
        evaluationNote ? (
          <div className="evaluation-modal__content-body">
            <div className="evaluation-modal__item">
              <div className="evaluation-modal__item-journal-feedback">
                <div className="evaluation-modal__item-journal-feedback-data rich-text rich-text--evaluation-literal">
                  <CkeditorContentLoader html={evaluationNote.note} />
                </div>
              </div>
              <div className="evaluation-modal__item-meta">
                <div className="evaluation-modal__item-meta-item">
                  <span className="evaluation-modal__item-meta-item-label">
                    {`${t("labels.evaluationNoteCreationDate", {
                      ns: "evaluation",
                    })}:`}
                  </span>
                  <span className="evaluation-modal__item-meta-item-data">
                    {localize.date(evaluationNote.created)}
                  </span>
                </div>
                {evaluationNote.lastModified &&
                  evaluationNote.lastModifierName && (
                    <div className="evaluation-modal__item-meta-item">
                      <span className="evaluation-modal__item-meta-item-label">
                        {`${t("labels.evaluationNoteLastModified", {
                          ns: "evaluation",
                          date: localize.date(evaluationNote.lastModified),
                          name: evaluationNote.lastModifierName,
                        })}:`}
                      </span>
                      <span className="evaluation-modal__item-meta-item-data">
                        {`${localize.date(evaluationNote.lastModified)}, ${evaluationNote.lastModifierName}`}
                      </span>
                    </div>
                  )}
              </div>
              <div className="evaluation-modal__item-actions">
                <Link
                  className="link link--evaluation"
                  onClick={handleEvaluationNoteEditorStateClick}
                  disabled={evaluationNoteEditorOpen}
                >
                  {t("actions.edit", { ns: "common" })}
                </Link>

                {!evaluationNoteEditorOpen && (
                  <DeleteEvaluationNote
                    evaluationNote={evaluationNote}
                    workspaceUserEntityId={
                      selectedAssessment.workspaceUserEntityId
                    }
                  >
                    <Link className="link link--evaluation link--evaluation-delete">
                      {t("actions.remove", { ns: "notebook" })}
                    </Link>
                  </DeleteEvaluationNote>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="evaluation-modal__content-body">
            <div className="evaluation-modal__item">
              <div className="evaluation-modal__item-body rich-text">
                <p>
                  {t("content.empty", {
                    ns: "notebook",
                  })}
                </p>
              </div>
              <div className="evaluation-modal__item-actions evaluation-modal__item-actions--journal-feedback">
                <Link
                  className="link link--evaluation"
                  onClick={handleEvaluationNoteEditorStateClick}
                  disabled={evaluationNoteEditorOpen}
                >
                  {t("actions.add", { ns: "notebook" })}
                </Link>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="empty-loader" />
      )}

      {/* If multiple evaluation notes are needed, we can add actions to control them here */}
      {/* <div className="evaluation-modal__content-actions"></div> */}

      {/* If multiple evaluation notes are needed, we can add them here */}
      {/* <div className="evaluation-modal__content-body"></div> */}

      <SlideDrawer
        show={evaluationNoteEditorOpen}
        title={t("labels.evaluationNote", { ns: "evaluation" })}
        onClose={handleEvaluationNoteEditorStateClick}
      >
        <EvaluationNoteEditor
          evaluationNote={evaluationNotes.data?.[0]}
          userEntityId={selectedAssessment.userEntityId}
          workspaceEntityId={selectedAssessment.workspaceEntityId}
          workspaceUserEntityId={selectedAssessment.workspaceUserEntityId}
          onClose={handleEvaluationNoteEditorStateClick}
        />
      </SlideDrawer>
    </div>
  );
};

export default EvaluationNotesList;
