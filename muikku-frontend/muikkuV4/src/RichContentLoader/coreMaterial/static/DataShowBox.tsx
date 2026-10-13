import { useMaterialContentContext } from "../MaterialContentProvider";

type DataShowBoxProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};
/** Generic data-show div (non exercise-named) */
export function DataShowBox(props: DataShowBoxProps) {
  const { answersChecked, answersVisible } = useMaterialContentContext();
  const show = answersChecked && answersVisible;
  return <div {...props} data-show={show ? "true" : "false"} />;
}
