import * as React from "react";
import {
  ExaminationPlannedSubject,
  ExaminationEnrolledSubject,
} from "../../../../../@types/shared";
import { MatriculationExaminationFutureSubjectsGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationFutureSelectsListProps
 */
interface MatriculationExaminationFutureSelectsListProps {
  onChange?: (
    modifiedExaminationFutureSubjectList: ExaminationPlannedSubject[]
  ) => void;
  readOnly?: boolean;
  enrolledAttendances?: ExaminationEnrolledSubject[];
  examinationFutureList: ExaminationPlannedSubject[];
  nextOptions?: JSX.Element[];
  onDeleteRow?: (index: number) => (e: React.MouseEvent) => void;
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
    readOnly,
  }) => {
    /**
     * Handles matriculation examation planned subject group change
     * @param key
     * @param value
     * @param index
     */
    const onMatriculationExaminationSubjectGroupChange = <
      T extends keyof ExaminationPlannedSubject
    >(
      key: T,
      value: ExaminationPlannedSubject[T],
      index: number
    ) => {
      let modifiedExaminationFutureSubjectList = examinationFutureList;

      modifiedExaminationFutureSubjectList[index][key] = value;

      onChange(modifiedExaminationFutureSubjectList);
    };

    /**
     * List of selected subject string keys
     */
    const selectedSubjects = examinationFutureList.map(
      (sSubject) => sSubject.subject
    );

    return (
      <>
        {examinationFutureList.map((subject, index) => (
          <div
            key={index}
            className="matriculation-container__row matriculation-container__row--input-groups"
          >
            <MatriculationExaminationFutureSubjectsGroup
              index={index}
              readOnly={readOnly}
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
