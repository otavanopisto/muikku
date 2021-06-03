import * as React from "react";
import {
  ExaminationPlannedSubject,
  ExaminationEnrolledSubject,
} from "../../../../../@types/shared";
import { MatriculationExaminationPlannedInputGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationFutureSelectsListProps
 */
interface MatriculationExaminationPlannedAttendesListProps {
  onChange?: (
    modifiedExaminationFutureSubjectList: ExaminationPlannedSubject[]
  ) => void;
  readOnly?: boolean;
  examinationPlannedList: ExaminationPlannedSubject[];
  nextOptions: JSX.Element[];
  onDeleteRow?: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationFutureSelectsList
 * @param props
 * @returns
 */
export const MatriculationExaminationPlannedAttendesList: React.FC<MatriculationExaminationPlannedAttendesListProps> =
  ({
    onChange,
    examinationPlannedList,
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
      let modifiedExaminationPlannedList = examinationPlannedList;

      modifiedExaminationPlannedList[index][key] = value;

      onChange(modifiedExaminationPlannedList);
    };

    /**
     * List of selected subject string keys
     */
    const selectedPlannedSubjects = examinationPlannedList.map(
      (sSubject) => sSubject.subject
    );

    return (
      <>
        {examinationPlannedList.map((subject, index) => (
          <div
            key={index}
            className="matriculation-container__row matriculation-container__row--input-groups"
          >
            <MatriculationExaminationPlannedInputGroup
              index={index}
              readOnly={readOnly}
              subject={subject}
              nextOptions={nextOptions}
              selectedSubjectList={selectedPlannedSubjects}
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
