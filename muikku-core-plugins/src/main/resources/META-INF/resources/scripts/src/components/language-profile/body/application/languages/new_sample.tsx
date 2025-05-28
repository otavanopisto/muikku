import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import {
  createLanguageSample,
  createLanguageFileSamples,
  createLanguageAudioSamples,
} from "~/actions/main-function/language-profile";
import { SampleTypes } from "./language";
import { LanguageCode } from "~/@types/shared";
import Recorder from "~/components/general/voice-recorder/recorder";
import { RecordValue } from "~/@types/recorder";
interface LanguageSampleProps {
  visible: boolean;
  sampleType: SampleTypes;
  language: LanguageCode;
  onClose: () => void;
}

const NewLanguageSample = (props: LanguageSampleProps) => {
  const { t } = useTranslation("languageProfile");
  const [sample, setSample] = React.useState("");
  const { visible, language, onClose, sampleType } = props;
  const { status, languageProfile } = useSelector((state: StateType) => state);
  const [audioSamples, setAudioSamples] = React.useState<RecordValue[]>([]);

  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const dispatch = useDispatch();

  /**
   * Handles changes in the text area for text samples.
   * Updates the sample state with the new value.
   */
  const handleFieldChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setSample(e.target.value);
    },
    [setSample]
  );

  /**
   * removeFileFromQueue removes a file from the selected files queue.
   * @param index - The index of the file to remove.
   */
  const removeFileFromQueue = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  /**
   * HandleFileChange handles the file input change event.
   * @param event - The change event from the file input.
   */
  const handleFileChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
      }
    },
    [setSelectedFiles]
  );
  /**
   * handleRecorderChange handles changes in the audio recorder component.
   * @param recordedAudio
   */
  const handleRecorderChange = React.useCallback(
    (recordedAudio: RecordValue[]) => {
      setAudioSamples(recordedAudio);
    },
    [setAudioSamples]
  );

  /**
   * handleCancel resets the state and closes the modal.
   */
  const handleCancel = React.useCallback(() => {
    setAudioSamples([]);
    setSample("");
    setSelectedFiles([]);
    onClose();
  }, [onClose]);

  /**
   * handleSave saves the text sample to the server.
   */
  const handleSave = React.useCallback(() => {
    dispatch(
      createLanguageSample(
        status.userId,
        {
          language: language,
          value: sample,
        },
        () => {
          setAudioSamples([]);
          setSample("");
          setSelectedFiles([]);
          onClose();
        }
      )
    );
  }, [dispatch, status.userId, language, sample, onClose]);

  /**
   * handleFilesSave saves the selected files as language samples.
   */
  const handleFilesSave = React.useCallback(() => {
    dispatch(
      createLanguageFileSamples(status.userId, selectedFiles, language, () => {
        setAudioSamples([]);
        setSample("");
        setSelectedFiles([]);
        onClose();
      })
    );
  }, [dispatch, status.userId, selectedFiles, language, onClose]);

  /**
   * handleAudioSave saves the audio samples to the server.
   */
  const handleAudioSave = React.useCallback(() => {
    dispatch(
      createLanguageAudioSamples(status.userId, audioSamples, language, () => {
        setAudioSamples([]);
        setSample("");
        setSelectedFiles([]);
        onClose();
      })
    );
  }, [dispatch, status.userId, audioSamples, language, onClose]);

  /**
   * handleDeleteAudio removes an audio sample from the list.
   * @param index - The index of the audio sample to remove.
   */
  const handleDeleteAudio = React.useCallback(
    (index: number) => {
      setAudioSamples((prevSamples) => {
        const newSamples = [...prevSamples];
        newSamples.splice(index, 1);
        return newSamples;
      });
    },
    [setAudioSamples]
  );

  /**
   * SampleComponent renders the appropriate sample input form based on the sampleType.
   * It uses React.memo to optimize rendering.
   */
  const SampleComponent = React.useMemo(() => {
    if (sampleType === "TEXT") {
      return (
        <form className="language-profile__text-sample">
          <textarea
            id="newLanguageSample"
            className="form-element__textarea"
            value={sample}
            onChange={handleFieldChange}
          />
          <Button onClick={handleSave}>Tallenna</Button>
          <Button onClick={handleCancel}>Peruuta</Button>
        </form>
      );
    } else if (sampleType === "FILE") {
      return (
        <form className="language-profile__file-uploader">
          <div className="language-profile__file-uploader-container">
            <div>{t("content.add", { ns: "materials", context: "file" })}</div>
            <input
              type="file"
              className="language-profile__file-uploader-field"
              onChange={handleFileChange}
            />
          </div>
          <div className="language-profile__file-uploader-files">
            {selectedFiles.map((file, index) => (
              <div
                className="language-profile__sample-file"
                key={"file" + index}
              >
                <span>{file.name}</span>
                <a
                  className="language-profile__remove-button icon-trash"
                  onClick={() => removeFileFromQueue(index)}
                ></a>
              </div>
            ))}
          </div>
          <Button onClick={handleFilesSave}>Tallenna</Button>
          <Button onClick={handleCancel}>Peruuta</Button>
        </form>
      );
    } else if (sampleType === "AUDIO") {
      return (
        <div>
          <Recorder
            saveTempfile={false}
            values={audioSamples}
            onDeleteAudio={handleDeleteAudio}
            onChange={handleRecorderChange}
          />
          <Button onClick={handleAudioSave}>Tallenna</Button>
          <Button onClick={handleCancel}>Peruuta</Button>
        </div>
      );
    }
    return null;
  }, [
    sampleType,
    sample,
    selectedFiles,
    audioSamples,
    handleFieldChange,
    handleSave,
    handleCancel,
    t,
    handleFileChange,
    handleFilesSave,
    handleRecorderChange,
    handleAudioSave,
    handleDeleteAudio,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <div className="language-profile__new-sample">
      <h2>Uusi näyte</h2>
      <div>{SampleComponent}</div>
    </div>
  );
};

export default React.memo(NewLanguageSample);
