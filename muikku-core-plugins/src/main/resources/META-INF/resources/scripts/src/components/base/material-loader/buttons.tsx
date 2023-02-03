import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import Button from "~/components/general/button";

/**
 * MaterialLoaderButtonsProps
 */
interface MaterialLoaderButtonsProps extends MaterialLoaderProps {
  stateConfiguration: any;
  answerCheckable: boolean;
  answersVisible: boolean;
}

/**
 * MaterialLoaderButtons
 * @param props props
 */
export function MaterialLoaderButtons(props: MaterialLoaderButtonsProps) {
  const { t } = useTranslation(["materials", "common"]);

  const noAnswerOrStateConfig = !props.answerable || !props.stateConfiguration;
  if (
    noAnswerOrStateConfig ||
    props.material.assignmentType === "INTERIM_EVALUATION"
  ) {
    return null;
  }

  if (props.invisible) {
    return (
      <div className="material-page__buttonset">
        <a className="button button--muikku-check-exercises">a</a>
      </div>
    );
  }

  return (
    <div className="material-page__buttonset">
      {!props.stateConfiguration["button-disabled"] ? (
        <Button
          buttonModifiers={props.stateConfiguration["button-class"]}
          onClick={props.onPushAnswer}
        >
          {props.stateConfiguration["button-text"]}
        </Button>
      ) : null}
      {props.stateConfiguration[
        "displays-hide-show-answers-on-request-button-if-allowed"
      ] && props.material.correctAnswers === "ON_REQUEST" ? (
        <Button
          buttonModifiers="muikku-show-correct-answers-button"
          onClick={props.onToggleAnswersVisible}
        >
          {props.answersVisible
            ? t("actions.hide_answers", { ns: "materials" })
            : t("actions.show_anwers", { ns: "materials" })}
        </Button>
      ) : null}
    </div>
  );
}
