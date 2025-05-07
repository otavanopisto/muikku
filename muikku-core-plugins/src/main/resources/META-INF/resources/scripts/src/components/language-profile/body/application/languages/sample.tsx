import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useSelector, useDispatch } from "react-redux";
import { LanguageProfileSample } from "~/generated/client";

interface LanguageSampleProps {
  sample: LanguageProfileSample;
  taggedForRemoval: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    sample: LanguageProfileSample
  ) => void;
  onDelete: (id: number) => void;
}

const Sample = (props: LanguageSampleProps) => {
  const { sample, taggedForRemoval, onChange, onDelete } = props;
  const { t } = useTranslation("languageProfile");

  return (
    <div>
      <textarea
        id={"sample-" + sample.id}
        disabled={taggedForRemoval}
        className={`form-element__textarea ${taggedForRemoval ? "form-element__textarea--disabled" : ""}`} 
        defaultValue={sample.value || ""}
        onChange={(e) => onChange(e, sample)}
      />
      <Button onClick={() => onDelete(sample.id)}>
        {taggedForRemoval
          ? t("actions.cancel", { ns: "common" })
          : t("actions.remove", { ns: "common" })}
      </Button>
    </div>
  );
};

export default Sample;
