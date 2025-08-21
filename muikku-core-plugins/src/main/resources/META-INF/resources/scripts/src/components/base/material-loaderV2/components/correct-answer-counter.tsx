import * as React from "react";
import { useTranslation } from "react-i18next";
//import { MaterialLoaderProps } from "~/components/base/material-loader";
import { RenderProps, RenderState } from "../types";

/**
 * MaterialLoaderCorrectAnswerCounterProps
 */
interface MaterialLoaderCorrectAnswerCounterProps
  extends RenderProps,
    RenderState {
  /* answersChecked: boolean;
  answerRegistry: { [name: string]: any }; */
}

/**
 * MaterialLoaderCorrectAnswerCounter
 * @param props props
 */
export function MaterialLoaderCorrectAnswerCounter(
  props: MaterialLoaderCorrectAnswerCounterProps
) {
  const { t } = useTranslation(["materials", "common"]);

  /*     if (!props.answersChecked || !Object.keys(props.answerRegistry).length) {
        return null;
      } */

  return (
    <div className="material-page__correct-answers">
      <span className="material-page__correct-answers-label">
        {t("labels.correctAnswers", { ns: "materials" })}
      </span>
      <span className="material-page__correct-answers-data">
        {/* {
          Object.keys(props.answerRegistry).filter(
            (key) => props.answerRegistry[key]
          ).length
        }{" "}
        / {Object.keys(props.answerRegistry).length} */}
      </span>
    </div>
  );
}
