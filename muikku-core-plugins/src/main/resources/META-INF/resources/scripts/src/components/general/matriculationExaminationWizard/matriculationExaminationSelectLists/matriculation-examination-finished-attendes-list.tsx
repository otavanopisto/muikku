import * as React from "react";
import {
  MatriculationExamEnrolledSubject,
  MatriculationExamFinishedSubject,
} from "~/generated/client";
import "~/sass/elements/matriculation.scss";
import { MatriculationExaminationFinishedInputGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationCompletedSelectsListProps
 */
interface MatriculationExaminationFinishedAttendesListProps {
  onChange?: (
    modifiedExaminationCompletedSubjectList: MatriculationExamFinishedSubject[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => any;
  readOnly?: boolean;
  enrolledAttendances?: MatriculationExamEnrolledSubject[];
  examinationFinishedList: MatriculationExamFinishedSubject[];
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
 * @param props props
 * @returns JSX.Element
 */
export const MatriculationExaminationFinishedAttendesList: React.FC<
  MatriculationExaminationFinishedAttendesListProps
> = (props) => {
  const {
    onChange,
    examinationFinishedList,
    enrolledAttendances,
    pastOptions,
    onDeleteRow,
    readOnly,
    ...useSelectPropsRest
  } = props;

  const useSelectProps = { ...defaultUseSelectProps, ...useSelectPropsRest };

  /**
   * Handles matriculation examation finished subject group change
   * @param key key
   * @param value value
   * @param index index
   */
  const handleMatriculationExaminationSubjectGroupChange = <
    T extends keyof MatriculationExamFinishedSubject,
  >(
    key: T,
    value: MatriculationExamFinishedSubject[T],
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
