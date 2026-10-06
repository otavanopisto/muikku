import { useAnswerCounts } from "../hooks/useAnswerCounts";

type ExercisesCorrectStyleBoxProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

/** data-name="excercises-correct-style-box" */
export function ExercisesCorrectStyleBox(props: ExercisesCorrectStyleBoxProps) {
  const { answersChecked, total, correct } = useAnswerCounts();
  const show = answersChecked && total > 0 && correct === total;
  return <div {...props} data-show={show ? "true" : "false"} />;
}
