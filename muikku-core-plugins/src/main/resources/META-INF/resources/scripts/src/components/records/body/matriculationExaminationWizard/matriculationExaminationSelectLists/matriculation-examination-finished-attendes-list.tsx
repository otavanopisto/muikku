import * as React from "react";
import "~/sass/elements/matriculation.scss";
import {
  ExaminationFinishedSubject,
  ExaminationEnrolledSubject,
} from "../../../../../@types/shared";
import { MatriculationExaminationFinishedInputGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationCompletedSelectsListProps
 */
interface MatriculationExaminationFinishedAttendesListProps {
  onChange?: (
    modifiedExaminationCompletedSubjectList: ExaminationFinishedSubject[]
  ) => any;
  readOnly?: boolean;
  enrolledAttendances?: ExaminationEnrolledSubject[];
  examinationFinishedList: ExaminationFinishedSubject[];
  pastOptions: JSX.Element[];
  onDeleteRow?: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationCompletedSelectsList
 * @param props
 * @returns
 */
export const MatriculationExaminationFinishedAttendesList: React.FC<MatriculationExaminationFinishedAttendesListProps> =
  ({
    onChange,
    examinationFinishedList,
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
      let modifiedExaminationFinishedList = examinationFinishedList;

      modifiedExaminationFinishedList[index][key] = value;

      onChange(modifiedExaminationFinishedList);
    };

    /**
     * List of selected subject string keys
     */
    const selectedSubjects = examinationFinishedList.map(
      (sSubject) => sSubject.subject
    );

    return (
      <>
        {examinationFinishedList.map((subject, index) => (
          <div
            key={index}
            className="matriculation-container__row matriculation-container__row--input-groups"
          >
            <MatriculationExaminationFinishedInputGroup
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
