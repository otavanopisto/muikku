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
  const { t } = useTranslation("languageProfile");
  const { samples, onChange, onDelete, onSave, onCancel } = props;
  return (
    <div className="language-profile__audio-sample">
      <Recorder
        saveTempfile={false}
        values={samples}
        onDeleteAudio={onDelete}
        onChange={onChange}
      />
      <div className="form-actions">
        <Button onClick={onSave}>Tallenna</Button>
        <Button onClick={onCancel}>Peruuta</Button>
      </div>
    </div>
  );
};
export default TextSample;
