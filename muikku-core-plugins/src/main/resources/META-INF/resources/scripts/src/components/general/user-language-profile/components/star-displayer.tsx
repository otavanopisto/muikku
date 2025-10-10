import * as React from "react";

/**
 * StarDisplayer
 */
interface StarDisplayerProps {
  label?: string;
  value: number;
  amount?: number;
}
/**
 * Stars component
 * @param props props
 * @returns JSX.Element
 */
const StarDisplayer = (props: StarDisplayerProps) => {
  const { label, value, amount } = props;
  const stars = [...Array(amount ? amount : 5).keys()];

  return (
    <div className="user-language-profile__star-displayer">
      {label && (
        <div className="user-language-profile__star-label">{label}</div>
      )}
      <div>
        {stars.map((star) => {
          const isFull = star + 1 <= value;

          return (
            <span
              className={`user-language-profile__star icon-star-${isFull ? "full" : "empty"}`}
              key={"star-" + star}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StarDisplayer;
