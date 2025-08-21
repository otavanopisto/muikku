import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { RenderProps, RenderState } from "../types";

/**
 * MaterialLoaderButtonsProps
 */
interface MaterialLoaderButtonsProps extends RenderProps, RenderState {}

/**
 * MaterialLoaderButtons
 * @param props props
 */
export function MaterialLoaderButtons(props: MaterialLoaderButtonsProps) {
  const { t } = useTranslation(["materials", "common"]);
  // eslint-disable-next-line jsdoc/require-jsdoc
  const namespace = () => {
    const p = props.assignmentType;

    switch (p) {
      case "JOURNAL":
        return "journal";
      case "INTERIM_EVALUATION":
        return "workspace";
      default:
        return "materials";
    }
  };

  const noAnswerOrStateConfig = !props.canSubmit || !props.stateConfiguration;
  if (noAnswerOrStateConfig || props.assignmentType === "INTERIM_EVALUATION") {
    return null;
  }

  /* if (props.invisible) {
    return (
      <div className="material-page__buttonset rs_skip_always">
        <a className="button button--muikku-check-exercises">a</a>
      </div>
    );
  } */

  return (
    <div className="material-page__buttonset rs_skip_always">
      {!props.stateConfiguration?.button.disabled ? (
        <Button
          buttonModifiers={props.stateConfiguration?.button.className}
          onClick={props.onSubmit}
        >
          {t(props.stateConfiguration?.button.text, {
            ns: namespace(),
            defaultValue: props.stateConfiguration?.button.text,
          })}
        </Button>
      ) : null}
      {props.stateConfiguration?.behavior.displaysHideShowAnswersButton &&
      props.material.correctAnswers === "ON_REQUEST" ? (
        <Button
          buttonModifiers="muikku-show-correct-answers-button"
          //onClick={props.onToggleAnswersVisible}
        >
          asd
          {/* {props.answersVisible
            ? t("actions.hide", { ns: "materials" })
            : t("actions.show", { ns: "materials" })} */}
        </Button>
      ) : null}
    </div>
  );
}
