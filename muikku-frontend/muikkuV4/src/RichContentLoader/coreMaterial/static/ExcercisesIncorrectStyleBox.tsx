import { useAnswerCounts } from "../hooks/useAnswerCounts";

type ExercisesIncorrectStyleBoxProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

/**
 * ExercisesIncorrectStyleBox component. Converts data-name="excercises-incorrect-style-box"
 * into a div with data-show="true" if the answers are incorrect, otherwise "false".
 * @param props - The props for the ExercisesIncorrectStyleBox
 */
export function ExercisesIncorrectStyleBox(
  props: ExercisesIncorrectStyleBoxProps
) {
  const { answersChecked, total, correct } = useAnswerCounts();
  const show = answersChecked && total > 0 && correct !== total;
  return <div {...props} data-show={show ? "true" : "false"} />;
}
