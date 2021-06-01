import * as React from "react";
import { ExaminationEnrolledSubject } from "../../../../../@types/shared";
import "~/sass/elements/matriculation.scss";
import { MatriculationExaminationSubjectInputGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationSubjectSelectsListProps
 */
interface MatriculationExaminationSubjectSelectsListProps {
  onChange?: (
    modifiedExaminationAttendedSubjectList: ExaminationEnrolledSubject[]
  ) => void;
  readOnly?: boolean;
  examinationSubjectList: ExaminationEnrolledSubject[];
  isConflictingMandatory?: (attendance: ExaminationEnrolledSubject) => boolean;
  conflictingAttendancesGroup?: string[][];
  isConflictingRepeat?: (attendance: ExaminationEnrolledSubject) => boolean;
  onDeleteRow?: (index: number) => (e: React.MouseEvent) => void;
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
    readOnly,
    ...validationProps
  }) => {
    const onMatriculationExaminationSubjectGroupChange = <
      T extends keyof ExaminationEnrolledSubject
    >(
      key: T,
      value: ExaminationEnrolledSubject[T],
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
          const conflictedCourse =
            conflictingAttendancesGroup &&
            conflictingAttendancesGroup.some(
              (r) => r.indexOf(subject.subject) >= 0
            );

          return (
            <div
              key={index}
              className={`matriculation-row matriculation-row--input-groups ${
                conflictedCourse &&
                "matriculation-row--input-groups--conflicted"
              }`}
            >
              <MatriculationExaminationSubjectInputGroup
                index={index}
                readOnly={readOnly}
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
