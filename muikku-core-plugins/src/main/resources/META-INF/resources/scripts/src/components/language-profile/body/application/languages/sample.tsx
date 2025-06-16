import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { LanguageProfileSample } from "~/generated/client";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";
import Dropdown from "~/components/general/dropdown";

/**
 * LanguageSampleProps
 * This interface defines the properties for the LanguageSample component.
 * It includes the sample data, a flag for removal, and functions for handling changes and deletions.
 */
interface LanguageSampleProps {
  sample: LanguageProfileSample;
  taggedForRemoval: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    sample: LanguageProfileSample
  ) => void;
  onDelete: (id: number) => void;
}

/**
 * Sample
 * This component renders a language profile sample based on its type (TEXT, FILE, AUDIO).
 * It provides functionality to edit the sample and delete it if necessary.
 * @param props LanguageSampleProps
 * @returns JSX.Element
 */
const Sample = (props: LanguageSampleProps) => {
  const { sample, taggedForRemoval, onChange, onDelete } = props;
  const { t } = useTranslation(["languageProfile", "common"]);

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
            disabled={taggedForRemoval}
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
  }, [sample, taggedForRemoval, onChange]);

  return (
    <div
      className={`language-profile-container__row language-profile-container__row--sample ${taggedForRemoval ? "language-profile-container__row--sample-tagged-for-removal" : ""}`}
    >
      {renderMemoizedSample}
      <div className="language-profile__sample-buttons">
        <Dropdown
          openByHover={true}
          content={
            taggedForRemoval
              ? t("actions.cancelRemove", { ns: "languageProfile" })
              : t("actions.removeSample", { ns: "languageProfile" })
          }
        >
          <Button
            buttonModifiers={
              taggedForRemoval ? "cancel-sample-removal" : "remove-sample"
            }
            icon={taggedForRemoval ? "undo" : "trash"}
            onClick={() => onDelete(sample.id)}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default React.memo(Sample);
