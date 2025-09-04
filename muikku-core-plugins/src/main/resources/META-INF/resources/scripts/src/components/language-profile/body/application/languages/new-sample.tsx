import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import {
  createLanguageSample,
  createLanguageFileSamples,
  createLanguageAudioSamples,
} from "~/actions/main-function/language-profile";
import { SampleTypes } from "./language";
import { LanguageCode } from "~/@types/shared";
import { RecordValue } from "~/@types/recorder";
import TextSample from "./new-sample/text-sample";
import FileSample from "./new-sample/file-sample";
import AudioSample from "./new-sample/audio-sample";

/**
 * LanguageSampleProps
 */
interface LanguageSampleProps {
  visible: boolean;
  sampleType: SampleTypes;
  language: LanguageCode;
  onClose: () => void;
}

/**
 * NewLanguageSample
 * @param props component properties
 * @returns JSX.Element
 */
const NewLanguageSample = (props: LanguageSampleProps) => {
  const [sample, setSample] = React.useState("");
  const { visible, language, onClose, sampleType } = props;
  const { status } = useSelector((state: StateType) => state);
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
  const renderSampleCreationComponent = React.useMemo(() => {
    switch (sampleType) {
      case "TEXT":
        return (
          <TextSample
            value={sample}
            onSave={handleSave}
            onCancel={handleCancel}
            onChange={handleFieldChange}
          />
        );
      case "FILE":
        return (
          <FileSample
            files={selectedFiles}
            onFileChange={handleFileChange}
            onRemoveFile={removeFileFromQueue}
            onSave={handleFilesSave}
            onCancel={handleCancel}
          />
        );

      case "AUDIO":
        return (
          <AudioSample
            samples={audioSamples}
            onChange={handleRecorderChange}
            onDelete={handleDeleteAudio}
            onSave={handleAudioSave}
            onCancel={handleCancel}
          />
        );
      default:
        return null;
    }
  }, [
    sampleType,
    sample,
    selectedFiles,
    audioSamples,
    handleFieldChange,
    handleSave,
    handleCancel,
    handleFileChange,
    handleAudioSave,
    handleFilesSave,
    handleRecorderChange,
    handleDeleteAudio,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <div className="language-profile-container__row language-profile-container__row--new-sample">
      <div className="language-profile__form-element-container">
        {renderSampleCreationComponent}
      </div>
    </div>
  );
};

export default React.memo(NewLanguageSample);
