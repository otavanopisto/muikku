import * as React from "react";
import "~/sass/elements/matriculation.scss";
import {
  ExaminationCompletedSubject,
  ExaminationAttendedSubject,
} from "../../../../../@types/shared";
import { MatriculationExaminationCompletedSubjectsGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationCompletedSelectsListProps
 */
interface MatriculationExaminationCompletedSelectsListProps {
  onChange?: (
    modifiedExaminationCompletedSubjectList: ExaminationCompletedSubject[]
  ) => any;
  enrolledAttendances: ExaminationAttendedSubject[];
  examinationCompletedList: ExaminationCompletedSubject[];
  pastOptions: JSX.Element[];
  onDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationCompletedSelectsList
 * @param props
 * @returns
 */
export const MatriculationExaminationCompletedSelectsList: React.FC<MatriculationExaminationCompletedSelectsListProps> =
  ({
    onChange,
    examinationCompletedList,
    enrolledAttendances,
    pastOptions,
    onDeleteRow,
  }) => {
    const onMatriculationExaminationSubjectGroupChange = <
      T extends keyof ExaminationCompletedSubject
    >(
      key: T,
      value: ExaminationCompletedSubject[T],
      index: number
    ) => {
      let modifiedExaminationCompletedSubjectList = examinationCompletedList;

      modifiedExaminationCompletedSubjectList[index][key] = value;

      onChange(modifiedExaminationCompletedSubjectList);
    };

    const selectedSubjects = examinationCompletedList.map(
      (sSubject) => sSubject.subject
    );

    return (
      <>
        {examinationCompletedList.map((subject, index) => (
          <div
            key={index}
            className="matriculation-container__row matriculation-container__row--input-groups"
          >
            <MatriculationExaminationCompletedSubjectsGroup
              index={index}
              subject={subject}
              pastTermOptions={pastOptions}
              selectedSubjectList={selectedSubjects}
              enrolledAttendances={enrolledAttendances}
              onSubjectGroupChange={
                onMatriculationExaminationSubjectGroupChange
              }
              onClickDeleteRow={onDeleteRow}
            />
          </div>
        ))}
      </>
    );
  };
