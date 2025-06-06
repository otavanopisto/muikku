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
  const { t } = useTranslation(["languageProfile", "common"]);
  const { value, onChange, onSave, onCancel } = props;
  return (
    <form className="language-profile__text-sample">
      <textarea
        id="newLanguageSample"
        className="language-profile__textarea"
        value={value}
        onChange={onChange}
      />
      <div className="form-actions">
        <Button onClick={onSave}>
          {t("actions.save", {
            ns: "common",
          })}
        </Button>
        <Button onClick={onCancel}>
          {t("actions.cancel", {
            ns: "common",
          })}
        </Button>
      </div>
    </form>
  );
};
export default TextSample;
