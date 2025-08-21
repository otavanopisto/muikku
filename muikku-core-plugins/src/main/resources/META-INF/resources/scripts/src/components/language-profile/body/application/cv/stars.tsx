import * as React from "react";
import { CVLanguage } from "~/reducers/main-function/language-profile";

/**
 * StarsProps
 */
interface StarsProps {
  label: string;
  name: keyof CVLanguage;
  skillLevels: CVLanguage;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}
/**
 * Stars component
 * @param props props
 * @returns JSX.Element
 */
const Stars = (props: StarsProps) => {
  const { label, skillLevels, name, onChange } = props;
  const stars = [...Array(5).keys()];
  const id = name + "-" + skillLevels.code;
  return (
    <div className="language-profile__stars">
      <label className="language-profile__label" id={id}>
        {label}
      </label>
      <div className="language-profile__stars-container">
        {stars.map((star) => {
          const isFull =
            (typeof skillLevels[name] === "string" &&
              star <= parseInt(skillLevels[name])) ||
            false;

          return (
            <input
              type="radio"
              className={`language-profile__star icon-star-${isFull ? "full" : "empty"}`}
              aria-labelledby={id}
              defaultValue={skillLevels.interaction || ""}
              checked={star.toString() === skillLevels[name]}
              onChange={(e) => onChange(e, name)}
              name={id}
              key={"star-" + id + "-" + star}
              value={star}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Stars;
