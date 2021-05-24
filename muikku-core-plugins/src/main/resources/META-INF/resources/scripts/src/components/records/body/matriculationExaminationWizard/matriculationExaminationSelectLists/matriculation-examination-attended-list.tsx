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
  examinationSubjectList?: ExaminationAttendedSubject[];
  onDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationSubjectSelectsList
 * @param props
 * @returns
 */
export const MatriculationExaminationSubjectSelectsList: React.FC<MatriculationExaminationSubjectSelectsListProps> =
  ({ onChange, examinationSubjectList, onDeleteRow }) => {
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

    return (
      <div>
        {examinationSubjectList.map((subject, index) => (
          <MatriculationExaminationSubjectInputGroup
            key={index}
            index={index}
            subject={subject}
            onSubjectGroupChange={onMatriculationExaminationSubjectGroupChange}
            onClickDeleteRow={onDeleteRow}
          />
        ))}
      </div>
    );
  };
