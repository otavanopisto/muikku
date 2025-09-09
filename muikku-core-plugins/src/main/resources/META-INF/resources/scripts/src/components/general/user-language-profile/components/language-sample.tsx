import * as React from "react";
import { LanguageProfileSample } from "~/generated/client";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";

/**
 * LanguageSampleProps
 * This interface defines the properties for the LanguageSample component.
 */
interface LanguageSampleProps {
  sample: LanguageProfileSample;
}

/**
 * Sample
 * This component renders a language profile sample based on its type (TEXT, FILE, AUDIO).
 * @param props LanguageSampleProps
 * @returns JSX.Element
 */
const Sample = (props: LanguageSampleProps) => {
  const { sample } = props;

  /**
   * RenderSample
   * @returns JSX.Element
   */
  const renderSample = () => {
    switch (sample.type) {
      case "TEXT":
        return (
          <textarea
            id={"sample-" + sample.id}
            disabled
            className="language-profile__textarea"
            defaultValue={sample.value}
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
  };

  return (
    <div className="language-profile-container__row language-profile-container__row--sample">
      {renderSample()}
    </div>
  );
};

export default Sample;
