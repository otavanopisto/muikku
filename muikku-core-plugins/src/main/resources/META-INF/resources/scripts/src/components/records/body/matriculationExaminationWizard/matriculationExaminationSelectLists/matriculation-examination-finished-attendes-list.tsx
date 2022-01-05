import * as React from "react";
import "~/sass/elements/matriculation.scss";
import {
  ExaminationFinishedSubject,
  ExaminationEnrolledSubject,
} from "~/@types/shared";
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
  useTermSelect?: boolean;
  useSubjectSelect?: boolean;
  useMandatorySelect?: boolean;
  useGradeSelect?: boolean;
  useFundingSelect?: boolean;
  useFailedReasonSelect?: boolean;
  onDeleteRow?: (index: number) => (e: React.MouseEvent) => void;
}

const defaultUseSelectProps = {
  useTermSelect: true,
  useSubjectSelect: true,
  useMandatorySelect: true,
  useGradeSelect: true,
  useFundingSelect: false,
};

/**
 * MatriculationExaminationCompletedSelectsList
 * @param props
 * @returns
 */
export const MatriculationExaminationFinishedAttendesList: React.FC<
  MatriculationExaminationFinishedAttendesListProps
> = ({
  onChange,
  examinationFinishedList,
  enrolledAttendances,
  pastOptions,
  onDeleteRow,
  readOnly,
  ...useSelectProps
}) => {
  useSelectProps = { ...defaultUseSelectProps, ...useSelectProps };

  /**
   * Handles matriculation examation finished subject group change
   * @param key
   * @param value
   * @param index
   */
  const handleMatriculationExaminationSubjectGroupChange = <
    T extends keyof ExaminationFinishedSubject
  >(
    key: T,
    value: ExaminationFinishedSubject[T],
    index: number
  ) => {
    const modifiedExaminationFinishedList = examinationFinishedList;

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
              handleMatriculationExaminationSubjectGroupChange
            }
            onClickDeleteRow={onDeleteRow}
            readOnly={readOnly}
            {...useSelectProps}
          />
        </div>
      ))}
    </>
  );
};
