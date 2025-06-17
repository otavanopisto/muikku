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
    <>
      <label
        htmlFor="newLanguageTextSample"
        className="language-profile__label"
      >
        {t("labels.addNewSampleTitle", {
          ns: "languageProfile",
          context: "text",
        })}
      </label>
      <div className="language-profile__field-description">
        {t("content.addNewSampleDescription", {
          ns: "languageProfile",
          context: "text",
        })}
      </div>
      <textarea
        id="newLanguageTextSample"
        className="language-profile__textarea"
        value={value}
        onChange={onChange}
      />
      <div className="language-profile__sample-buttons language-profile__sample-buttons--add-sample">
        <Button buttonModifiers={["execute"]} onClick={onSave}>
          {t("actions.save", {
            ns: "common",
          })}
        </Button>
        <Button buttonModifiers={["cancel"]} onClick={onCancel}>
          {t("actions.cancel", {
            ns: "common",
          })}
        </Button>
      </div>
    </>
  );
};
export default TextSample;
