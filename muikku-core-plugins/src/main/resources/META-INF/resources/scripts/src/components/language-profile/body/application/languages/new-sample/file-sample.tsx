import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { FileSample } from "~/reducers/main-function/language-profile";
import { LanguageCode } from "~/@types/shared";

/**
 * FileSampleProps
 */
interface FileSampleProps {
  samples: FileSample[];
  language: LanguageCode;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDescriptionChange: (index: number, description: string) => void;
  onRemoveFile: (index: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * FileSample
 * @param props props
 * @returns JSX.Element
 */
const FileSample = (props: FileSampleProps) => {
  const { t } = useTranslation(["languageProfile", "common"]);
  const {
    samples,
    language,
    onFileChange,
    onFileDescriptionChange,
    onRemoveFile,
    onSave,
    onCancel,
  } = props;

  return (
    <>
      <label
        htmlFor="newLanguageFileSample"
        className="language-profile__label"
      >
        {t("labels.addSample", {
          ns: "languageProfile",
          context: "file",
        })}
      </label>
      <div className="language-profile__field-description">
        {t("content.addSample", {
          ns: "languageProfile",
          context: "file",
        })}
      </div>
      <div className="language-profile__file-uploader">
        <div className="language-profile__file-uploader-container">
          <div>{t("content.add", { ns: "materials", context: "file" })}</div>
          <input
            id={`newLanguageFileSample-${language}`}
            type="file"
            className="language-profile__file-uploader-field"
            onChange={onFileChange}
          />
        </div>
        <div className="language-profile__file-uploader-files">
          {samples.map((sample, index) => (
            <div
              className="language-profile__file-uploader-file"
              key={`file-${index}`}
            >
              <div className="language-profile__sample-file-description">
                <label htmlFor={`file-description-${language}-${index}`}>
                  {t("labels.fileDescription", {
                    ns: "languageProfile",
                  })}
                </label>
                <textarea
                  className="language-profile__file-description-input"
                  id={`file-description-${language}-${index}`}
                  value={sample.description}
                  onChange={(e) =>
                    onFileDescriptionChange(index, e.target.value)
                  }
                />
              </div>
              <div className="language-profile__sample-file">
                <span>{sample.file.name}</span>
                <a
                  className="language-profile__remove-button icon-trash"
                  onClick={() => onRemoveFile(index)}
                ></a>
              </div>
            </div>
          ))}
        </div>
      </div>
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
export default FileSample;
