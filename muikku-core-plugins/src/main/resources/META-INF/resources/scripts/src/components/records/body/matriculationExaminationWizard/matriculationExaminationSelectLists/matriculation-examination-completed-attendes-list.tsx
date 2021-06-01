import * as React from "react";
import "~/sass/elements/matriculation.scss";
import {
  ExaminationFinishedSubject,
  ExaminationEnrolledSubject,
} from "../../../../../@types/shared";
import { MatriculationExaminationCompletedSubjectsGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationCompletedSelectsListProps
 */
interface MatriculationExaminationCompletedSelectsListProps {
  onChange?: (
    modifiedExaminationCompletedSubjectList: ExaminationFinishedSubject[]
  ) => any;
  readOnly?: boolean;
  enrolledAttendances?: ExaminationEnrolledSubject[];
  examinationCompletedList: ExaminationFinishedSubject[];
  pastOptions?: JSX.Element[];
  onDeleteRow?: (index: number) => (e: React.MouseEvent) => void;
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
    readOnly,
  }) => {
    /**
     * Handles matriculation examation finished subject group change
     * @param key
     * @param value
     * @param index
     */
    const onMatriculationExaminationSubjectGroupChange = <
      T extends keyof ExaminationFinishedSubject
    >(
      key: T,
      value: ExaminationFinishedSubject[T],
      index: number
    ) => {
      let modifiedExaminationCompletedSubjectList = examinationCompletedList;

      modifiedExaminationCompletedSubjectList[index][key] = value;

      onChange(modifiedExaminationCompletedSubjectList);
    };

    /**
     * List of selected subject string keys
     */
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
              readOnly={readOnly}
            />
          </div>
        ))}
      </>
    );
  };
