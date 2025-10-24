import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderProps } from "~/components/base/material-loader";

/**
 * MaterialLoaderTitleProps
 */
interface MaterialLoaderTitleProps extends MaterialLoaderProps {}

/* function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
} */

/**
 * MaterialLoaderTitle
 * @param props props
 */
export function MaterialLoaderTitle(props: MaterialLoaderTitleProps) {
  const { t } = useTranslation(["materials", "common"]);

  const hidden = props.material.hidden || (props.folder && props.folder.hidden);

  if (props.isInFrontPage) {
    return null;
  }

  if (props.invisible) {
    return (
      <>
        <h2
          className="material-page__title"
          lang={
            props.material?.titleLanguage ||
            props.folder?.titleLanguage ||
            props.workspace.language
          }
        >
          {props.material.title}
        </h2>
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

      case "INTERIM_EVALUATION":
        return "interim-evaluation";

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
        lang={
          props.material?.titleLanguage ||
          props.folder?.titleLanguage ||
          props.workspace.language
        }
      >
        {props.material.title}
        {props.anchorElement ? (
          <span className="material-page__title-back-to-toc">
            {props.anchorElement}
          </span>
        ) : null}
        {props.readspeakerComponent ? props.readspeakerComponent : null}
      </h2>
      {hidden &&
      (materialPageType === "exercise" || materialPageType === "assignment") ? (
        <div className="material-page__title-meta">
          {t("content.hiddenButAnswered", {
            ns: "materials",
            context: materialPageType,
          })}
        </div>
      ) : null}
    </>
  );
}
