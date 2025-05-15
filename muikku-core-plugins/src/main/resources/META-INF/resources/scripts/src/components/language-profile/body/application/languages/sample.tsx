import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useSelector, useDispatch } from "react-redux";
import { LanguageProfileSample } from "~/generated/client";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";

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

  const DisplaySample = () => {
    switch (sample.type) {
      case "TEXT":
        return (
          <textarea
            id={"sample-" + sample.id}
            disabled={taggedForRemoval}
            className={`form-element__textarea ${taggedForRemoval ? "form-element__textarea--disabled" : ""}`}
            defaultValue={sample.value || ""}
            onChange={(e) => onChange(e, sample)}
          />
        );

      case "FILE":
        return (
          <div>
            <span>{sample.fileName}</span>
            <Button onClick={() => onDelete(sample.id)}>
              {taggedForRemoval
                ? t("actions.cancel", { ns: "common" })
                : t("actions.remove", { ns: "common" })}
            </Button>
          </div>
        );
      case "AUDIO":
        return (
          <AudioPoolComponent
            controls
            src={`/languageProfileSampleServlet?sampleId=${sample.id}`}
            preload="metadata"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <DisplaySample />
      <Button onClick={() => onDelete(sample.id)}>
        {taggedForRemoval
          ? t("actions.cancel", { ns: "common" })
          : t("actions.remove", { ns: "common" })}
      </Button>
    </div>
  );
};

export default Sample;
