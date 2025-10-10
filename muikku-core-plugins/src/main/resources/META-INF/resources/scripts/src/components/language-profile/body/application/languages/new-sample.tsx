import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
/* eslint-disable camelcase */
import { unstable_batchedUpdates } from "react-dom";
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
  const [selectedFileSamples, setSelectedFileSamples] = React.useState<
    FileSample[]
  >([]);
  const dispatch = useDispatch();

  /**
   * Clears the input fields.
   * @returns void
   */
  const clearFields = () =>
    unstable_batchedUpdates(() => {
      setSample("");
      setAudioSamples([]);
      setSelectedFileSamples([]);
    });

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
  const removeFileFromQueue = React.useCallback((index: number) => {
    setSelectedFileSamples((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  /**
   * Handles changes to the file description.
   * @param index - The index of the file to update.
   * @param description - The new description for the file.
   */
  const handleFileDescriptionChange = (index: number, description: string) => {
    const filesUpdate = [...selectedFileSamples];
    filesUpdate[index].description = description;
    setSelectedFileSamples(filesUpdate);
  };

  /**
   * HandleFileChange handles the file input change event.
   * @param event - The change event from the file input.
   */
  const handleFileChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        setSelectedFileSamples((prevFiles) => [
          ...prevFiles,
          ...Array.from(files).map((file) => ({
            file,
            description: "",
          })),
        ]);
      }
    },
    [setSelectedFileSamples]
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
    clearFields();
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
          clearFields();
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
      createLanguageFileSamples(
        status.userId,
        selectedFileSamples,
        language,
        () => {
          clearFields();
          onClose();
        }
      )
    );
  }, [dispatch, status.userId, selectedFileSamples, language, onClose]);

  /**
   * handleAudioSave saves the audio samples to the server.
   */
  const handleAudioSave = React.useCallback(() => {
    dispatch(
      createLanguageAudioSamples(status.userId, audioSamples, language, () => {
        clearFields();
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
  const renderSampleCreationComponent = () => {
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
            samples={selectedFileSamples}
            language={language}
            onFileChange={handleFileChange}
            onFileDescriptionChange={handleFileDescriptionChange}
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
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="language-profile-container__row language-profile-container__row--new-sample">
      <div className="language-profile__form-element-container">
        {renderSampleCreationComponent()}
      </div>
    </div>
  );
};

export default React.memo(NewLanguageSample);
