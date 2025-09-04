import * as React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ExamAttendance } from "~/generated/client";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import ExamTimer from "./exam-timer";
import "~/sass/elements/exam-list.scss";

/**
 * ExamsListProps
 */
interface ExamsListProps {}

/**
 * ExamsListProps
 * @param props props
 * @returns ExamsList
 */
const ExamsList = (props: ExamsListProps) => {
  const { exams, examsStatus } = useSelector((state: StateType) => state.exams);
  const currentWorkspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );

  if (!currentWorkspace || !exams || examsStatus === "LOADING") {
    return <div className="exam-list__item loader-empty" />;
  }

  if (examsStatus === "ERROR") {
    return (
      <div className="empty">
        <span>{"ERROR"}</span>
      </div>
    );
  } else if (exams.length === 0) {
    return (
      <div className="empty">
        <span>Kurssilla ei ole kokeita</span>
      </div>
    );
  }

  return (
    <div className="exam-list">
      {exams.map((exam) => (
        <ExamsListItem key={exam.folderId} exam={exam} />
      ))}
    </div>
  );
};

/**
 * ExamsListItemProps
 */
interface ExamsListItemProps {
  exam: ExamAttendance;
}

/**
 * ExamsListItemProps
 * @param props props
 * @returns ExamsListItem
 */
const ExamsListItem = (props: ExamsListItemProps) => {
  const { exam } = props;
  const { workspaceUrl } = useParams<{ workspaceUrl: string }>();

  // Check if exam has ended
  const isEnded = !!exam.ended;

  // Check if exam has been started
  const isStarted = !!exam.started;

  const hasTimeLimit = exam.minutes > 0;

  return (
    <div className="exam-list__item">
      <h2 className="exam-list__item-header">
        <span>{exam.name}</span>
        {exam.allowRestart && (
          <div className="exam-list__item-labels">
            <span className="exam-list__item-label">
              Kokeen voi suorittaa uudestaan
            </span>
          </div>
        )}
      </h2>
      <div className="exam-list__item-body">
        {/* Show exam status and time info */}
        <div className="exam-list__item-content">
          {exam.folderId} - Lorem ipsum dolor sit amet, consectetur adipiscing
          elit, sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
        </div>
        <div className="exam-list__item-meta">
          {isEnded ? (
            <span className="exam-list__item-status exam-list__item-status--ended">
              Koe suoritettu {localize.date(exam.ended, "l, LT")}
            </span>
          ) : isStarted ? (
            <span className="exam-list__item-status exam-list__item-status--started">
              Koe aloitettu {localize.date(exam.started, "l, LT")}
            </span>
          ) : (
            <span className="exam-list__item-status exam-list__item-status--not-started">
              Koetta ei ole aloitettu
            </span>
          )}
        </div>
      </div>
      {!isEnded && (
        <div className="exam-list__item-footer">
          <div className="exam-list__item-actions">
            <Link
              className={`exam-list__item-actions-button ${isStarted ? "exam-list__item-actions-button--started" : ""}`}
              to={`/workspace/${workspaceUrl}/exams/${exam.folderId}`}
            >
              {isStarted ? "Jatka koetta" : "Avaa koe"}
            </Link>

            {hasTimeLimit && !isStarted && (
              <span className="exam-list__item-duration">
                Kokeen suorittamiseen on aikaa
                <span className="exam-list__item-duration-accent">
                  {exam.minutes} minuuttia
                </span>
              </span>
            )}

            {hasTimeLimit && isStarted && <ExamTimer exam={exam} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamsList;
