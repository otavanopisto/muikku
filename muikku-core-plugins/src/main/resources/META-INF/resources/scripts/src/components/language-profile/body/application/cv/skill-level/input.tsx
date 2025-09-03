import * as React from "react";

/**
 * SkillLevelInputProps component props
 */
interface SkillLevelInputProps {
  label: string;
  type: HTMLInputElement["type"];
  value: string;
  id: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid?: boolean;
}

const SkillLevelInputProps = (props: SkillLevelInputProps) => {
  const { label, value, onChange, type, id, name, isValid = true } = props;
  const [inputValue, setInputValue] = React.useState(value);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onChange(e);
    }, 500);
  };

  return (
    <div className="language-profile__input-container">
      <label htmlFor={id} className="language-profile__label">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={inputValue}
        id={name}
        className={`language-profile__input ${isValid ? "" : "INVALID"}`}
        onChange={handleChange}
      />
    </div>
  );
};

export default SkillLevelInputProps;
