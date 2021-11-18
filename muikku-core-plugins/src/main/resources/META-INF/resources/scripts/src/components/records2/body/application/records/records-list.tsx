import Button from "~/components/general/button";
import * as React from "react";
import AnimateHeight from "react-animate-height";
import Avatar from "~/components/general/avatar";
import RecordsAssignmentsListDialog from "~/components/records2/dialogs/records-assignments-list-dialog";

export interface RecordSubject {
  name: string;
  courses: RecordSubjectCourse[];
}

export interface RecordSubjectCourse {
  name: string;

  evaluationDate: string;
  asessor: string;
  studies: {
    excerciseCount: number;
    maxExcercise: number;
    assigmentCount: number;
    maxAssigment: number;
  };
  status: "EVALUATED" | "SUPPLEMENTATION" | "ONGOING";
  grade?: string;
}

interface RecordsListProps {
  name: string;
}

export const RecordsList: React.FC<RecordsListProps> = ({ children, name }) => {
  const [open, setOpen] = React.useState(false);

  const animateHeight = open ? "auto" : 0;

  const arrowClass = open ? "arrow-down" : "arrow-right";

  return (
    <div className="studies-records__section-content-course-list">
      <div
        className="studies-records__section-content-course-list-subject"
        onClick={() => setOpen(!open)}
      >
        {name}
        <div className={arrowClass}></div>
      </div>
      <AnimateHeight
        className="studies-records__section-content-course-list-items"
        height={animateHeight}
      >
        {children}
      </AnimateHeight>
    </div>
  );
};

interface RecordsListItemProps extends RecordSubjectCourse {
  index: number;
  userEntityId: number;
}

export const RecordsListItem: React.FC<RecordsListItemProps> = ({
  index,
  userEntityId,
  ...course
}) => {
  const statusClassMod = () => {
    switch (course.status) {
      case "EVALUATED":
        return "studies-records__section-content-course-list-item-cell-box--status-evaluated";

      case "SUPPLEMENTATION":
        return "studies-records__section-content-course-list-item-cell-box--status-supplementation";

      case "ONGOING":
        return "studies-records__section-content-course-list-item-cell-box--status-ongoing";
    }
  };

  return (
    <div className="studies-records__section-content-course-list-item">
      <div className="studies-records__section-content-course-list-item-cell">
        <div className="studies-records__section-content-course-list-item-cell-box studies-records__section-content-course-list-item-cell-box--course-name">
          {course.name}
        </div>
      </div>
      <div className="studies-records__section-content-course-list-item-cell">
        <div className="studies-records__section-content-course-list-item-cell-box">
          {course.evaluationDate}
        </div>
      </div>
      <div className="studies-records__section-content-course-list-item-cell">
        <div className="studies-records__section-content-course-list-item-cell-box studies-records__section-content-course-list-item-cell-box--asessor">
          <div className="asessor-data">
            <div className="avatar">
              <Avatar hasImage={false} id={1} firstName="Eka" />
            </div>
            <div className="asessor">
              <div className="name">{course.asessor}</div>
              <div className="title">titteli</div>
            </div>
          </div>
        </div>
      </div>
      <div className="studies-records__section-content-course-list-item-cell">
        <div className="studies-records__section-content-course-list-item-cell-box">
          <div>
            <RecordsAssignmentsListDialog userEntityId={userEntityId}>
              <Button style={{ backgroundColor: "green" }}>Näytä</Button>
            </RecordsAssignmentsListDialog>
          </div>
        </div>
      </div>
      <div
        className={`studies-records__section-content-course-list-item-cell ${statusClassMod()}`}
      >
        <div className="studies-records__section-content-course-list-item-cell-box">
          {course.status}
        </div>
      </div>
      <div className="studies-records__section-content-course-list-item-cell">
        <div className="studies-records__section-content-course-list-item-cell-box">
          {course.grade ? course.grade : "-"}
        </div>
      </div>
    </div>
  );
};
