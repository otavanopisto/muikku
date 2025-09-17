import * as React from "react";
import { useTranslation } from "react-i18next";
import { IconButton } from "~/components/general/button";
import { LanguageProfileSample } from "~/generated/client";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";
import PromptDialog from "~/components/general/prompt-dialog";
import {
  deleteLanguageSample,
  updateLanguageSample,
} from "~/actions/main-function/language-profile";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";

/**
 * LanguageSampleProps
 * This interface defines the properties for the LanguageSample component.
 */
interface LanguageSampleProps {
  sample: LanguageProfileSample;
  candDelete?: boolean;
}

/**
 * Sample
 * This component renders a language profile sample based on its type (TEXT, FILE, AUDIO).
 * It provides functionality to delete it if necessary.
 * @param props LanguageSampleProps
 * @returns JSX.Element
 */
const Sample = (props: LanguageSampleProps) => {
  const { sample, candDelete = false } = props;
  const { t } = useTranslation(["languageProfile", "common"]);
  const dispatch = useDispatch();
  const { status } = useSelector((state: StateType) => state);
  const [editMode, setEditMode] = React.useState(false);
  const [textValue, setTextValue] = React.useState(sample.value);

  const handleTextSampleUpdate = () => {
    // Handle text sample update logic here
    dispatch(
      updateLanguageSample(status.userId, sample.id, {
        language: sample.language,
        value: textValue,
      })
    );
    setEditMode(false);
  };

  /**
   * RenderSample
   * @returns JSX.Element
   */
  const renderSample = () => {
    switch (sample.type) {
      case "TEXT":
        return (
          <div className="language-profile__text-sample">
            <textarea
              id={"sample-" + sample.id}
              disabled={!editMode}
              className="language-profile__textarea"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />
            <div
              aria-expanded={editMode}
              id={`sample-${sample.id}-controls`}
              className={`language-profile__button-container ${editMode ? "state-OPEN" : ""}`}
            >
              {editMode && (
                <div
                  aria-hidden={!editMode}
                  className="language-profile__sample-buttons language-profile__sample-buttons--edit-sample"
                >
                  <Button
                    buttonModifiers={["execute"]}
                    onClick={() => handleTextSampleUpdate()}
                  >
                    {t("actions.save", {
                      ns: "common",
                    })}
                  </Button>
                  <Button
                    buttonModifiers={["cancel"]}
                    onClick={() => setEditMode(false)}
                  >
                    {t("actions.cancel", {
                      ns: "common",
                    })}
                  </Button>
                </div>
              )}
            </div>
          </div>
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

  /**
   * Handle deletion of a language profile sample.
   * @param id the id of the sample to delete
   */
  const handleDelete = (id: number) => {
    dispatch(deleteLanguageSample(status.userId, id));
  };

  return (
    <div className="language-profile-container__row language-profile-container__row--sample">
      {renderSample()}
      {candDelete && (
        <div className="language-profile__sample-buttons">
          {sample.type === "TEXT" && (
            <IconButton
              onClick={() => setEditMode(true)}
              icon="pencil"
              aria-label={t("actions.edit", { ns: "common" })}
              aria-expanded={editMode}
              aria-controls={`sample-${sample.id}-controls`}
            />
          )}
          <PromptDialog
            title={t("labels.remove", {
              context: sample.type.toLowerCase(),
            })}
            content={t("content.removing", {
              context: sample.type.toLowerCase(),
            })}
            onExecute={() => handleDelete(sample.id)}
          >
            <IconButton icon="trash" />
          </PromptDialog>
        </div>
      )}
    </div>
  );
};

export default Sample;
