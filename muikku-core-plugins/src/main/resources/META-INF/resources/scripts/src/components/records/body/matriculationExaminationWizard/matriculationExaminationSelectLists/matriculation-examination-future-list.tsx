import * as React from "react";
import {
  ExaminationFutureSubject,
  ExaminationAttendedSubject,
} from "../../../../../@types/shared";
import { MatriculationExaminationFutureSubjectsGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationFutureSelectsListProps
 */
interface MatriculationExaminationFutureSelectsListProps {
  onChange?: (
    modifiedExaminationFutureSubjectList: ExaminationFutureSubject[]
  ) => void;
  enrolledAttendances: ExaminationAttendedSubject[];
  examinationFutureList: ExaminationFutureSubject[];
  nextOptions: JSX.Element[];
  onDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationFutureSelectsList
 * @param props
 * @returns
 */
export const MatriculationExaminationFutureSelectsList: React.FC<MatriculationExaminationFutureSelectsListProps> =
  ({
    onChange,
    examinationFutureList,
    enrolledAttendances,
    nextOptions,
    onDeleteRow,
  }) => {
    const onMatriculationExaminationSubjectGroupChange = <
      T extends keyof ExaminationFutureSubject
    >(
      key: T,
      value: ExaminationFutureSubject[T],
      index: number
    ) => {
      let modifiedExaminationFutureSubjectList = examinationFutureList;

      modifiedExaminationFutureSubjectList[index][key] = value;

      onChange(modifiedExaminationFutureSubjectList);
    };

    const selectedSubjects = examinationFutureList.map(
      (sSubject) => sSubject.subject
    );

    return (
      <>
        {examinationFutureList.map((subject, index) => (
          <div
            key={index}
            className="matriculation-row matriculation-row--input-groups"
          >
            <MatriculationExaminationFutureSubjectsGroup
              index={index}
              subject={subject}
              nextOptions={nextOptions}
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
