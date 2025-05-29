import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";

/**
 * TextSampleProps
 */
interface TextSampleProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * TextSample
 * @param props props
 * @returns JSX.Element
 */
const TextSample = (props: TextSampleProps) => {
  const { t } = useTranslation("languageProfile");
  const { value, onChange, onSave, onCancel } = props;
  return (
    <form className="language-profile__text-sample">
      <textarea
        id="newLanguageSample"
        className="form-element__textarea"
        value={value}
        onChange={onChange}
      />
      <div className="form-actions">
        <Button onClick={onSave}>Tallenna</Button>
        <Button onClick={onCancel}>Peruuta</Button>
      </div>
    </form>
  );
};
export default TextSample;
