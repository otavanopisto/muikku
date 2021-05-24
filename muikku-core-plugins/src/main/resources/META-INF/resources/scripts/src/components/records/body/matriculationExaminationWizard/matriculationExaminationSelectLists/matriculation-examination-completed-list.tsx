import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { ExaminationCompletedSubject } from "../../../../../@types/shared";
import { MatriculationExaminationCompletedSubjectsGroup } from "./matriculation-examination-selector-components";

/**
 * MatriculationExaminationCompletedSelectsListProps
 */
interface MatriculationExaminationCompletedSelectsListProps {
  onChange?: (
    modifiedExaminationCompletedSubjectList: ExaminationCompletedSubject[]
  ) => any;
  examinationCompletedList?: ExaminationCompletedSubject[];
  onDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationCompletedSelectsList
 * @param props
 * @returns
 */
export const MatriculationExaminationCompletedSelectsList: React.FC<MatriculationExaminationCompletedSelectsListProps> =
  ({ onChange, examinationCompletedList, onDeleteRow }) => {
    const onMatriculationExaminationSubjectGroupChange = <
      T extends keyof ExaminationCompletedSubject
    >(
      key: T,
      value: ExaminationCompletedSubject[T],
      index: number
    ) => {
      let modifiedExaminationCompletedSubjectList = examinationCompletedList;

      modifiedExaminationCompletedSubjectList[index][key] = value;

      onChange(modifiedExaminationCompletedSubjectList);
    };

    return (
      <div>
        {examinationCompletedList.map((subject, index) => (
          <MatriculationExaminationCompletedSubjectsGroup
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
