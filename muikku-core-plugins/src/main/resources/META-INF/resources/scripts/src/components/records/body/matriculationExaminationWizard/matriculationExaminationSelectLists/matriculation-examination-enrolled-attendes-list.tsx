import * as React from "react";
import { ExaminationEnrolledSubject } from "../../../../../@types/shared";
import "~/sass/elements/matriculation.scss";
import { MatriculationExaminationEnrolledInputGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationSubjectSelectsListProps
 */
interface MatriculationExaminationEnrolledAttendesListProps {
  onChange?: (
    modifiedExaminationAttendedSubjectList: ExaminationEnrolledSubject[]
  ) => void;
  readOnly?: boolean;
  useSubjectSelect?: boolean;
  useMandatorySelect?: boolean;
  useRepeatSelect?: boolean;
  examinationEnrolledList: ExaminationEnrolledSubject[];
  isConflictingMandatory?: (attendance: ExaminationEnrolledSubject) => boolean;
  conflictingAttendancesGroup?: string[][];
  isConflictingRepeat?: (attendance: ExaminationEnrolledSubject) => boolean;
  onDeleteRow?: (index: number) => (e: React.MouseEvent) => void;
}

const defaultUseSelectsProps = {
  useSubjectSelect: true,
  useMandatorySelect: true,
  useRepeatSelect: true,
};

/**
 * MatriculationExaminationSubjectSelectsList
 * @param props
 * @returns
 */
export const MatriculationExaminationEnrolledAttendesList: React.FC<MatriculationExaminationEnrolledAttendesListProps> =
  (props) => {
    props = { ...defaultUseSelectsProps, ...props };

    const {
      onChange,
      examinationEnrolledList,
      conflictingAttendancesGroup,
      onDeleteRow,
      children,
      readOnly,
      ...rest
    } = props;

    /**
     * Handles matriculation examation enrolled subject group change
     * @param key
     * @param value
     * @param index
     */
    const onMatriculationExaminationSubjectGroupChange = <
      T extends keyof ExaminationEnrolledSubject
    >(
      key: T,
      value: ExaminationEnrolledSubject[T],
      index: number
    ) => {
      let modifiedExaminationEnrolledList = examinationEnrolledList;

      modifiedExaminationEnrolledList[index][key] = value;

      onChange(modifiedExaminationEnrolledList);
    };

    /**
     * List of selected subject string keys
     */
    const selectedSubjects = examinationEnrolledList.map(
      (sSubject) => sSubject.subject
    );

    return (
      <>
        {examinationEnrolledList.map((subject, index) => {
          /**
           * Checks if course conflicts
           */
          const conflictedCourse =
            conflictingAttendancesGroup &&
            conflictingAttendancesGroup.some(
              (r) => r.indexOf(subject.subject) >= 0
            );

          return (
            <div
              key={index}
              className={`matriculation-container__row matriculation-container__row--input-groups ${
                conflictedCourse
                  ? "matriculation-container__row--input-groups--conflicted"
                  : ""
              }`}
            >
              <MatriculationExaminationEnrolledInputGroup
                index={index}
                readOnly={readOnly}
                subject={subject}
                selectedSubjectList={selectedSubjects}
                onSubjectGroupChange={
                  onMatriculationExaminationSubjectGroupChange
                }
                onClickDeleteRow={onDeleteRow}
                {...rest}
              />
            </div>
          );
        })}
      </>
    );
  };
