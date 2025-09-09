import * as React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ExamAttendance } from "~/generated/client";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import ExamTimer from "./exam-timer";
import "~/sass/elements/exam.scss";
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
    return <div className="exam loader-empty" />;
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
    <div className="exams">
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
    <div className="exam">
      {isEnded && <div className="exam__completed-marker" />}
      <h2 className="exam__header">
        <span>{exam.name}</span>
        <div className="exam__labels">
          {restartAllowed && (
            <span className="exam__label">Kokeen voi suorittaa uudestaan</span>
          )}
          {hasTimeLimit && (
            <span className="exam__label">
              Suoritusaika:{" "}
              <span className="exam__label-accent">
                {exam.minutes} minuuttia
              </span>
            </span>
          )}
        </div>
      </h2>
      <div className="exam__body">
        {/* Show exam status and time info */}
        <div className="exam__content">
          <CkeditorLoaderContent html={exam.description} />
        </div>
        <div className="exam__meta">
          {isEnded ? (
            <span className="exam__status exam__status--ended">
              Koe suoritettu {localize.date(exam.ended, "l, LT")}
            </span>
          ) : onGoing ? (
            <span className="exam__status exam__status--ongoing">
              Koe aloitettu {localize.date(exam.started, "l, LT")}
            </span>
          ) : (
            <span className="exam__status">Koetta ei ole aloitettu</span>
          )}
        </div>
      </div>

      {restartAllowed || !isEnded ? (
        <div className="exam__footer">
          <div className="exam__actions">
            <Link
              className={`exam__actions-button ${onGoing ? "exam__actions-button--ongoing" : ""}`}
              to={`/workspace/${workspaceUrl}/exams/${exam.folderId}`}
            >
              Avaa koe
            </Link>

            {hasTimeLimit && isStarted && !isEnded && <ExamTimer exam={exam} />}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExamsList;
