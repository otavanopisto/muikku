import * as React from "react";
import { MaterialLoaderProps } from "~/components/base/material-loader";

interface MaterialLoaderCorrectAnswerCounterProps extends MaterialLoaderProps {
  answersChecked: boolean;
  answerRegistry: { [name: string]: any };
}

export function MaterialLoaderCorrectAnswerCounter(
  props: MaterialLoaderCorrectAnswerCounterProps
) {
  if (!props.answersChecked || !Object.keys(props.answerRegistry).length) {
    return null;
  }

  return (
    <div className="material-page__correct-answers">
      <span className="material-page__correct-answers-label">
        {props.i18n.text.get(
          "plugin.workspace.materialsLoader.correctAnswersCountLabel"
        )}
      </span>
      <span className="material-page__correct-answers-data">
        {
          Object.keys(props.answerRegistry).filter(
            (key) => props.answerRegistry[key]
          ).length
        }{" "}
        / {Object.keys(props.answerRegistry).length}
      </span>
    </div>
  );
}
