import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import Recorder from "~/components/general/voice-recorder/recorder";
import { RecordValue } from "~/@types/recorder";
/**
 * TextSampleProps
 */
interface FileSampleProps {
  samples: RecordValue[];
  onChange: (values: RecordValue[]) => void;
  onDelete: (index: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * TextSample
 * @param props props
 * @returns JSX.Element
 */
const TextSample = (props: FileSampleProps) => {
  const { t } = useTranslation(["languageProfile", "common"]);
  const { samples, onChange, onDelete, onSave, onCancel } = props;
  return (
    <>
      <label className="language-profile__label">
        {t("labels.addSample", {
          ns: "languageProfile",
          context: "audio",
        })}
      </label>
      <div className="language-profile__field-description">
        {t("content.addSample", {
          ns: "languageProfile",
          context: "audio",
        })}
      </div>
      <Recorder
        modifier="language-profile"
        saveTempfile={false}
        values={samples}
        onDeleteAudio={onDelete}
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
