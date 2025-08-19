import * as React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ApplicationList, {
  ApplicationListItem,
} from "~/components/general/application-list";
import { ExamAttendance } from "~/generated/client";
import { StateType } from "~/reducers";

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

  return (
    <ApplicationListItem>
      <div className="exam-list__item">
        <div className="exam-list__item-header">
          <div className="exam-list__item-header-main">
            <h2>{exam.name}</h2>
          </div>
          <div className="exam-list__item-header-secondary"></div>
        </div>
        <div className="exam-list__item-body">
          <div className="exam-list__item-body-main">
            <div className="exam-list__item-body-main-content">
              {exam.folderId}
            </div>
          </div>
        </div>
        <div className="exam-list__item-footer">
          <div className="exam-list__item-footer-actions">
            <Link to={`/workspace/${workspaceUrl}/exams/${exam.folderId}`}>
              Aloita koe
            </Link>
          </div>
        </div>
      </div>
    </ApplicationListItem>
  );
};

export default ExamsList;
