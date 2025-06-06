import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";

/**
 * FileSampleProps
 */
interface FileSampleProps {
  files: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  const { files, onFileChange, onRemoveFile, onSave, onCancel } = props;
  return (
    <form className="language-profile__file-uploader">
      <div className="language-profile__file-uploader-container">
        <div>{t("content.add", { ns: "materials", context: "file" })}</div>
        <input
          type="file"
          className="language-profile__file-uploader-field"
          onChange={onFileChange}
        />
      </div>
      <div className="language-profile__file-uploader-files">
        {files.map((file, index) => (
          <div className="language-profile__sample-file" key={`file-${index}`}>
            <span>{file.name}</span>
            <a
              className="language-profile__remove-button icon-trash"
              onClick={() => onRemoveFile(index)}
            ></a>
          </div>
        ))}
      </div>
      <div className="language-profile__buttons">
        <Button onClick={onSave}>
          {t("actions.save", {
            ns: "common",
          })}
        </Button>
        <Button onClick={onCancel}>
          {t("actions.cancel", {
            ns: "common",
          })}
        </Button>
      </div>
    </form>
  );
};
export default FileSample;
