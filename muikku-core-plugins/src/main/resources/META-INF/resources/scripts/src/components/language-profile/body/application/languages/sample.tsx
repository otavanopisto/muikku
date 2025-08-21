import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { LanguageProfileSample } from "~/generated/client";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";
import PromptDialog from "~/components/general/prompt-dialog";
import { deleteLanguageSample } from "~/actions/main-function/language-profile";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
/**
 * LanguageSampleProps
 * This interface defines the properties for the LanguageSample component.
 * It includes the sample data, a flag for removal, and functions for handling changes and deletions.
 */
interface LanguageSampleProps {
  sample: LanguageProfileSample;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    sample: LanguageProfileSample
  ) => void;
}

/**
 * Sample
 * This component renders a language profile sample based on its type (TEXT, FILE, AUDIO).
 * It provides functionality to edit the sample and delete it if necessary.
 * @param props LanguageSampleProps
 * @returns JSX.Element
 */
const Sample = (props: LanguageSampleProps) => {
  const { sample, onChange } = props;
  const { t } = useTranslation(["languageProfile", "common"]);
  const dispatch = useDispatch();
  const { status } = useSelector((state: StateType) => state);

  /**
   * RenderMemoizedSample
   * This function returns a memoized component based on the sample type.
   * It uses React.useMemo to optimize rendering performance by avoiding unnecessary re-renders.
   * @returns JSX.Element
   * @param sample The language profile sample to render.
   */
  const renderMemoizedSample = React.useMemo(() => {
    switch (sample.type) {
      case "TEXT":
        return (
          <textarea
            id={"sample-" + sample.id}
            className="language-profile__textarea"
            defaultValue={sample.value || ""}
            onChange={(e) => onChange(e, sample)}
          />
        );
      case "FILE":
        return (
          <div>
            <a
              className="language-profile__sample-link"
              href={`/languageProfileSampleServlet?sampleId=${sample.id}`}
            >
              {sample.fileName}
            </a>
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
  }, [sample, onChange]);

  /**
   * Handle deletion of a language profile sample.
   * @param id the id of the sample to delete
   */
  const handleDelete = (id: number) => {
    dispatch(deleteLanguageSample(status.userId, id));
  };

  return (
    <div className="language-profile-container__row language-profile-container__row--sample">
      {renderMemoizedSample}
      <div className="language-profile__sample-buttons">
        <PromptDialog
          title={t("labels.remove", {
            context: sample.type.toLowerCase(),
          })}
          content={t("content.removing", {
            context: sample.type.toLowerCase(),
          })}
          onExecute={() => handleDelete(sample.id)}
        >
          <Button icon="trash" />
        </PromptDialog>
      </div>
    </div>
  );
};

export default React.memo(Sample);
