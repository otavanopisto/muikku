import * as React from "react";
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
  const noAnswerOrStateConfig = !props.answerable || !props.stateConfiguration;
  if (noAnswerOrStateConfig) {
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
          {props.i18n.text.get(
            props.answerCheckable &&
              props.material.assignmentType === "EXERCISE" &&
              (props.material.correctAnswers || "ALWAYS") === "ALWAYS"
              ? props.stateConfiguration["button-check-text"]
              : props.stateConfiguration["button-text"]
          )}
        </Button>
      ) : null}
      {props.stateConfiguration[
        "displays-hide-show-answers-on-request-button-if-allowed"
      ] && props.material.correctAnswers === "ON_REQUEST" ? (
        <Button
          buttonModifiers="muikku-show-correct-answers-button"
          onClick={props.onToggleAnswersVisible}
        >
          {props.i18n.text.get(
            props.answersVisible
              ? "plugin.workspace.materialsLoader.hideAnswers"
              : "plugin.workspace.materialsLoader.showAnswers"
          )}
        </Button>
      ) : null}
    </div>
  );
}
