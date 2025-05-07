import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import { createLanguageSample } from "~/actions/main-function/language-profile";
import { LanguageCode } from "~/@types/shared";

interface LanguageSampleProps {
  visible: boolean;
  language: LanguageCode;
}

const NewLanguageSample = (props: LanguageSampleProps) => {
  const { t } = useTranslation("languageProfile");
  const [sample, setSample] = React.useState("");
  const { visible, language } = props;
  const { status, languageProfile } = useSelector((state: StateType) => state);
  const dispatch = useDispatch();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      setSample(e.target.value);
    }, 300); // 300ms debounce time
  };

  const handleSave = () => {
    dispatch(
      createLanguageSample(status.userId, { language: language, value: sample })
    );
  };

  return (
    <div className="language-profile__language-sample">
      <h2>Uusi näyte</h2>
      <div>
        <textarea
          id="newLanguageSample"
          className="form-element__textarea"
          onChange={(e) => handleFieldChange(e)}
        />
      </div>
      <Button onClick={handleSave}>Tallenna</Button>
    </div>
  );
};

export default NewLanguageSample;
