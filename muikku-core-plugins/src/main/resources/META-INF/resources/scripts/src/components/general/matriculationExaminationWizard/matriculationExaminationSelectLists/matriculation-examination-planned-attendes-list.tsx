import * as React from "react";
import { MatriculationExamPlannedSubject } from "~/generated/client";
import { MatriculationExaminationPlannedInputGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationFutureSelectsListProps
 */
interface MatriculationExaminationPlannedAttendesListProps {
  onChange?: (
    modifiedExaminationFutureSubjectList: MatriculationExamPlannedSubject[]
  ) => void;
  readOnly?: boolean;
  useTermSelect?: boolean;
  useSubjectSelect?: boolean;
  useMandatorySelect?: boolean;
  examinationPlannedList: MatriculationExamPlannedSubject[];
  nextOptions: JSX.Element[];
  onDeleteRow?: (index: number) => (e: React.MouseEvent) => void;
}

const defaultUseSelectProps = {
  useTermSelect: true,
  useSubjectSelect: true,
  useMandatorySelect: true,
};

/**
 * MatriculationExaminationFutureSelectsList
 * @param props props
 * @returns JSX.Element
 */
export const MatriculationExaminationPlannedAttendesList: React.FC<
  MatriculationExaminationPlannedAttendesListProps
> = (props) => {
  props = { ...defaultUseSelectProps, ...props };

  const {
    onChange,
    examinationPlannedList,
    nextOptions,
    onDeleteRow,
    readOnly,
    ...useSelectProps
  } = props;

  /**
   * Handles matriculation examation planned subject group change
   * @param key key
   * @param value value
   * @param index index of the subject group
   */
  const handleMatriculationExaminationSubjectGroupChange = <
    T extends keyof MatriculationExamPlannedSubject,
  >(
    key: T,
    value: MatriculationExamPlannedSubject[T],
    index: number
  ) => {
    const modifiedExaminationPlannedList = examinationPlannedList;

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
              handleMatriculationExaminationSubjectGroupChange
            }
            onClickDeleteRow={onDeleteRow}
            {...useSelectProps}
          />
        </div>
      ))}
    </>
  );
};
