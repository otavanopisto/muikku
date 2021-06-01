import * as React from "react";
import { ExaminationAttendedSubject } from "../../../../../@types/shared";
import "~/sass/elements/matriculation.scss";
import { MatriculationExaminationSubjectInputGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationSubjectSelectsListProps
 */
interface MatriculationExaminationSubjectSelectsListProps {
  onChange?: (
    modifiedExaminationAttendedSubjectList: ExaminationAttendedSubject[]
  ) => void;
  examinationSubjectList: ExaminationAttendedSubject[];
  isConflictingMandatory: (attendance: ExaminationAttendedSubject) => boolean;
  conflictingAttendancesGroup: string[][];
  isConflictingRepeat: (attendance: ExaminationAttendedSubject) => boolean;
  onDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationSubjectSelectsList
 * @param props
 * @returns
 */
export const MatriculationExaminationSubjectSelectsList: React.FC<MatriculationExaminationSubjectSelectsListProps> =
  ({
    onChange,
    examinationSubjectList,
    conflictingAttendancesGroup,
    onDeleteRow,
    children,
    ...validationProps
  }) => {
    const onMatriculationExaminationSubjectGroupChange = <
      T extends keyof ExaminationAttendedSubject
    >(
      key: T,
      value: ExaminationAttendedSubject[T],
      index: number
    ) => {
      let modifiedExaminationAttendedSubjectList = examinationSubjectList;

      modifiedExaminationAttendedSubjectList[index][key] = value;

      onChange(modifiedExaminationAttendedSubjectList);
    };

    const selectedSubjects = examinationSubjectList.map(
      (sSubject) => sSubject.subject
    );

    return (
      <>
        {examinationSubjectList.map((subject, index) => {
          const conflictedCourse = conflictingAttendancesGroup.some(
            (r) => r.indexOf(subject.subject) >= 0
          );

          return (
            <div
              key={index}
              className={`matriculation-container__row matriculation-container__row--input-groups ${
                conflictedCourse ?
                "matriculation-container__row--input-groups--conflicted"
                : ""
              }`}
            >
              <MatriculationExaminationSubjectInputGroup
                index={index}
                subject={subject}
                selectedSubjectList={selectedSubjects}
                onSubjectGroupChange={
                  onMatriculationExaminationSubjectGroupChange
                }
                onClickDeleteRow={onDeleteRow}
                {...validationProps}
              />
            </div>
          );
        })}
      </>
    );
  };
