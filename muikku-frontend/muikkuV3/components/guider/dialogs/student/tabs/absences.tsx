// Absences tab for student dialog
import React from "react";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { GuiderStudentUserProfileType } from "~/reducers/main-function/guider";

interface AbsencesProps {
  userId: number;
}

const Absences: React.FC<AbsencesProps> = (props) => {
  const { userId } = props;
  const { absenceEvents } = useSelector(
    (state: StateType) =>
      state.guider?.currentStudent as GuiderStudentUserProfileType
  );

  return (
    <div>
      <h1>Absences</h1>
      <p>Absences for user {userId}</p>
      <p>Absences: {absenceEvents.length}</p>
    </div>
  );
};

export default Absences;
