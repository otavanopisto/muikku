import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import {
  createLanguageSample,
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleRecorderChange = (recordedAudio: RecordValue[]) => {
    setAudioSamples(recordedAudio);
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    onClose();
  };

  const handleSave = () => {
    dispatch(
      createLanguageSample(status.userId, { language: language, value: sample })
    );
  };

  const handleAudioSave = () => {
    dispatch(createLanguageAudioSamples(status.userId, audioSamples, language));
    setAudioSamples([]);
    onClose();
  };

  const handleDeleteAudio = (index: number) => {
    setAudioSamples((prevSamples) => {
      const newSamples = [...prevSamples];
      newSamples.splice(index, 1);
      return newSamples;
    });
  };

  if (!visible) {
    return null;
  }

  const SampleCreationComponent = () => {
    switch (sampleType) {
      case "TEXT":
        return (
          <form className="language-profile__text-sample">
            <textarea
              id="newLanguageSample"
              className="form-element__textarea"
              onChange={(e) => handleFieldChange(e)}
            />
            <Button onClick={handleSave}>Tallenna</Button>
            <Button onClick={handleCancel}>Peruuta</Button>
          </form>
        );
      case "FILE":
        return (
          <form className="language-profile__file-uploader">
            <input
              aria-labelledby={"filesample-" + language}
              type="file"
              className="language-profile__file-uploader-field"
              onChange={handleFileChange}
            />
            <div className="language-profile__file-uploader-files">
              {selectedFiles.map((file, index) => (
                <span key={"file" + index}>{file.name}</span>
              ))}
            </div>
            <Button onClick={handleCancel}>Peruuta</Button>
          </form>
        );
      case "AUDIO":
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
      default:
        return null;
    }

    //   <FileUploader
    //   // emptyText={
    //   //   this.props.readOnly ? t("content.empty", { ns: "files" }) : null
    //   // }
    //   // readOnly={this.props.readOnly}
    //   // url={this.props.status.contextPath + "/tempFileUploadServlet"}
    //   displayNotificationOnError
    //   // formDataGenerator={formDataGenerator}
    //   onFileSuccess={(file: File, data: any) => {
    //     onFileAdded(file, data);
    //   }}
    //   hintText={t("content.add", { ns: "materials", context: "file" })}
    //   fileTooLargeErrorText={t("notifications.sizeTooLarge", {
    //     ns: "files",
    //   })}
    //   // deleteFileText={t("actions.remove")}
    //   // downloadFileText={t("actions.download")}
    //   files={[]}
    //   fileIdKey="fileId"
    //   fileNameKey="name"
    //   fileUrlGenerator={(f) => `/rest/workspace/fileanswer/${f.fileId}`}
    //   fileDownloadAllUrlGenerator={(f) =>
    //     "/rest/workspace/allfileanswers/" +
    //     f[0].fileId +
    //     "?archiveName=" +
    //     t("labels.zipFileName", { ns: "files" })
    //   }
    //   fileDownloadAllLabel={t("actions.download", {
    //     ns: "common",
    //     context: "all",
    //   })}
    //   deleteDialogElement={<div>Muu</div>}
    //   // deleteDialogElementProps={{ onConfirm: this.removeFile }}
    //   modifier="taskfield"
    //   uploadingTextProcesser={(percent: number) =>
    //     t("content.statusUploading", {
    //       ns: "materials",
    //       progress: percent,
    //     })
    //   }
    //   // invisible={this.props.invisible}
    //   notificationOfSuccessText={t("notifications.uploadSuccess", {
    //     ns: "files",
    //   })}
    //   displayNotificationOnSuccess
    // />
  };

  return (
    <div className="language-profile__new-sample">
      <h2>Uusi näyte</h2>
      <div>
        <SampleCreationComponent />
      </div>
    </div>
  );
};

export default NewLanguageSample;
