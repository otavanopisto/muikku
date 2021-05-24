import * as React from "react";
import { ExaminationFutureSubject } from "../../../../../@types/shared";
import { MatriculationExaminationFutureSubjectsGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationFutureSelectsListProps
 */
interface MatriculationExaminationFutureSelectsListProps {
  onChange?: (
    modifiedExaminationFutureSubjectList: ExaminationFutureSubject[]
  ) => void;
  examinationFutureList?: ExaminationFutureSubject[];
  onDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationFutureSelectsList
 * @param props
 * @returns
 */
export const MatriculationExaminationFutureSelectsList: React.FC<MatriculationExaminationFutureSelectsListProps> =
  ({ onChange, examinationFutureList, onDeleteRow }) => {
    const onMatriculationExaminationSubjectGroupChange = <
      T extends keyof ExaminationFutureSubject
    >(
      key: T,
      value: ExaminationFutureSubject[T],
      index: number
    ) => {
      let modifiedExaminationFutureSubjectList = examinationFutureList;

      modifiedExaminationFutureSubjectList[index][key] = value;

      onChange(modifiedExaminationFutureSubjectList);
    };

    return (
      <div>
        {examinationFutureList.map((subject, index) => (
          <MatriculationExaminationFutureSubjectsGroup
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
