import * as React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ApplicationList, {
  ApplicationListItem,
} from "~/components/general/application-list";
import { ExamAttendance } from "~/generated/client";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import ExamTimer from "./exam-timer";

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
    return <ApplicationListItem className="loader-empty" />;
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
        <span>Ei kokeita</span>
      </div>
    );
  }

  return (
    <ApplicationList>
      {exams.map((exam) => (
        <ExamsListItem key={exam.folderId} exam={exam} />
      ))}
    </ApplicationList>
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
    <ApplicationListItem>
      <div className="exam-list__item">
        <div className="exam-list__item-header">
          <div className="exam-list__item-header-main">
            <h2>{exam.name}</h2>
          </div>
          <div className="exam-list__item-header-secondary">
            {/* Show timer if exam has time limit and has been started */}
            {hasTimeLimit && isStarted && <ExamTimer exam={exam} />}
          </div>
        </div>
        <div className="exam-list__item-body">
          <div className="exam-list__item-body-main">
            <div className="exam-list__item-body-main-content">
              {exam.folderId}
            </div>

            {/* Show exam status and time info */}
            <div className="exam-list__item-status">
              {isEnded ? (
                <span className="exam-status exam-status--ended">
                  Koe päättynyt {localize.date(exam.ended)}
                </span>
              ) : isStarted ? (
                <span className="exam-status exam-status--started">
                  Koe aloitettu {localize.date(exam.started)}
                </span>
              ) : (
                <span className="exam-status exam-status--not-started">
                  Koetta ei ole aloitettu
                </span>
              )}

              {hasTimeLimit && (
                <span className="exam-duration">
                  Kesto: {exam.minutes} minuuttia
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="exam-list__item-footer">
          <div className="exam-list__item-footer-actions">
            <Link to={`/workspace/${workspaceUrl}/exams/${exam.folderId}`}>
              Avaa koe
            </Link>
          </div>
        </div>
      </div>
    </ApplicationListItem>
  );
};

export default ExamsList;
