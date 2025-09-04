import * as React from "react";

/**
 * StarDisplayer
 */
interface StarsProps {
  value: number;
  amount?: number;
}
/**
 * Stars component
 * @param props props
 * @returns JSX.Element
 */
const StarDisplayer = (props: StarsProps) => {
  const { value, amount } = props;
  const stars = [...Array(amount ? amount : 5).keys()];

  return (
    <span>
      {stars.map((star) => {
        const isFull = star + 1 <= value;

        return (
          <span
            className={`language-profile__star icon-star-${isFull ? "full" : "empty"}`}
            key={"star-" + star}
          />
        );
      })}
    </span>
  );
};

export default StarDisplayer;
