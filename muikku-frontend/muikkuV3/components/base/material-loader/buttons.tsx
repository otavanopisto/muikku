import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import Button from "~/components/general/button";
import { StateConfig } from "./types";

/**
 * MaterialLoaderButtonsProps
 */
interface MaterialLoaderButtonsProps extends MaterialLoaderProps {
  stateConfiguration: StateConfig;
  answerCheckable: boolean;
  answersVisible: boolean;
}

/**
 * MaterialLoaderButtons
 * @param props props
 */
export function MaterialLoaderButtons(props: MaterialLoaderButtonsProps) {
  const { t } = useTranslation(["materials", "common"]);
  // eslint-disable-next-line jsdoc/require-jsdoc
  const namespace = () => {
    const p = props.stateConfiguration.assignmentType
      ? props.stateConfiguration.assignmentType
      : "";

    switch (p) {
      case "JOURNAL":
        return "journal";
      case "INTERIM_EVALUATION":
        return "workspace";
      default:
        return "materials";
    }
  };

  const noAnswerOrStateConfig = !props.answerable || !props.stateConfiguration;
  if (
    noAnswerOrStateConfig ||
    props.material.assignmentType === "INTERIM_EVALUATION"
  ) {
    return null;
  }

  if (props.invisible) {
    return (
      <div className="material-page__buttonset rs_skip_always">
        <a className="button button--muikku-check-exercises">a</a>
      </div>
    );
  }

  return (
    <div className="material-page__buttonset rs_skip_always">
      {!props.stateConfiguration.buttonDisabled ? (
        <Button
          buttonModifiers={props.stateConfiguration.buttonClass}
          onClick={props.onPushAnswer}
        >
          {t(props.stateConfiguration.buttonText, {
            ns: namespace(),
            defaultValue: props.stateConfiguration.buttonText,
          })}
        </Button>
      ) : null}
      {props.stateConfiguration.displaysHideShowAnswersButton &&
      props.material.correctAnswers === "ON_REQUEST" ? (
        <Button
          buttonModifiers="muikku-show-correct-answers-button"
          onClick={props.onToggleAnswersVisible}
        >
          {props.answersVisible
            ? t("actions.hide", { ns: "materials" })
            : t("actions.show", { ns: "materials" })}
        </Button>
      ) : null}
    </div>
  );
}
