import * as React from "react";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import { i18nType } from "~/reducers/base/i18n";

/**
 * MaterialLoaderTitleProps
 */
interface MaterialLoaderTitleProps extends MaterialLoaderProps {
  i18n: i18nType;
}

/* function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
} */

/**
 * MaterialLoaderTitle
 * @param props props
 */
export function MaterialLoaderTitle(props: MaterialLoaderTitleProps) {
  const hidden = props.material.hidden || (props.folder && props.folder.hidden);

  if (props.isInFrontPage) {
    return null;
  }

  if (props.invisible) {
    return (
      <>
        <h2 className="material-page__title">{props.material.title}</h2>
      </>
    );
  }

  /**
   * returnMaterialPageType
   * @returns page type
   */
  const returnMaterialPageType = () => {
    switch (props.material.assignmentType) {
      case "EXERCISE":
        return "exercise";

      case "EVALUATED":
        return "assignment";

      case "JOURNAL":
        return "journal";

      default:
        return "theory";
    }
  };

  /*   const modifiers: Array<string> =
    typeof props.modifiers === "string" ? [props.modifiers] : props.modifiers; */

  const materialPageType = returnMaterialPageType();

  return (
    <>
      <h2
        className={`material-page__title material-page__title--${materialPageType}`}
      >
        {props.material.title}
      </h2>
      {hidden &&
      (materialPageType === "exercise" || materialPageType === "assignment") ? (
        <div className="material-page__title-meta">
          {props.i18n.text.get(
            "plugin.workspace.materials." +
              materialPageType +
              "HiddenButAnswered"
          )}
        </div>
      ) : null}
    </>
  );
}
