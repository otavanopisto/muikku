import * as React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ExamAttendance } from "~/generated/client";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import ExamTimer from "./exam-timer";
import "~/sass/elements/exam-list.scss";
import CkeditorLoaderContent from "~/components/base/ckeditor-loader/content";

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

  const restartAllowed = exam.allowRestart;

  const onGoing = isStarted && !isEnded;

  return (
    <div className="exam-list__item">
      <h2 className="exam-list__item-header">
        <span>{exam.name}</span>
        <div className="exam-list__item-labels">
          {restartAllowed && (
            <span className="exam-list__item-label">
              Kokeen voi suorittaa uudestaan
            </span>
          )}
          {hasTimeLimit && (
            <span className="exam-list__item-label">
              Suoritusaika:{" "}
              <span className="exam-list__item-label-accent">
                {exam.minutes} minuuttia
              </span>
            </span>
          )}
        </div>
      </h2>
      <div className="exam-list__item-body">
        {/* Show exam status and time info */}
        <div className="exam-list__item-content">
          <CkeditorLoaderContent html={exam.description} />
        </div>
        <div className="exam-list__item-meta">
          {isEnded ? (
            <span className="exam-list__item-status exam-list__item-status--ended">
              Koe suoritettu {localize.date(exam.ended, "l, LT")}
            </span>
          ) : onGoing ? (
            <span className="exam-list__item-status exam-list__item-status--ongoing">
              Koe aloitettu {localize.date(exam.started, "l, LT")}
            </span>
          ) : (
            <span className="exam-list__item-status">
              Koetta ei ole aloitettu
            </span>
          )}
        </div>
      </div>

      {restartAllowed || !isEnded ? (
        <div className="exam-list__item-footer">
          <div className="exam-list__item-actions">
            <Link
              className={`exam-list__item-actions-button ${onGoing ? "exam-list__item-actions-button--ongoing" : ""}`}
              to={`/workspace/${workspaceUrl}/exams/${exam.folderId}`}
            >
              Avaa koe
            </Link>

            {hasTimeLimit && isStarted && !restartAllowed && !isEnded && (
              <ExamTimer exam={exam} />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExamsList;
