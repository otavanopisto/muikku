import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderProps } from "~/components/base/material-loader";

/**
 * MaterialLoaderTitleProps
 */
interface MaterialLoaderAIProps extends MaterialLoaderProps {}

/* function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
} */

/**
 * MaterialLoaderAI
 * @param props props
 */
export function MaterialLoaderAI(props: MaterialLoaderAIProps) {
  const { t } = useTranslation(["materials"]);

  if (props.isInFrontPage) {
    return null;
  }

  return (
    <>
      {props.material.ai === "ALLOWED" ? (
        <div className="material-page__ai-warning-container material-page__ai-warning-container--allowed">
          <div className="material-page__ai-warning-icon"></div>
          <div className="material-page__ai-warning-text">
            {t("content.aiAllowed", {
              ns: "materials",
            })}
          </div>
        </div>
      ) : props.material.ai === "DISALLOWED" ? (
        <div className="material-page__ai-warning-container material-page__ai-warning-container--disallowed">
          <div className="material-page__ai-warning-icon"></div>
          <div className="material-page__ai-warning-text">
            {t("content.aiDisallowed", {
              ns: "materials",
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
