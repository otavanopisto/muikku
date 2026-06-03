import * as React from "react";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import { StateConfig } from "./types";
import { useTranslation } from "react-i18next";

/**
 * MaterialLoaderSyncInfoProps
 */
interface MaterialLoaderSyncInfoProps extends MaterialLoaderProps {
  stateConfiguration: StateConfig;
  fieldsHasSyncErrors: boolean;
}

/**
 * Material loader sync info, displays a notification if there are sync errors in the fields on the page
 * @param props props
 * @returns JSX.Element
 */
export function MaterialLoaderSyncInfo(props: MaterialLoaderSyncInfoProps) {
  const { t } = useTranslation(["materials"]);

  // If there are no sync errors, don't display anything
  if (!props.fieldsHasSyncErrors) {
    return null;
  }

  return (
    <div className="material-page__sync-info">
      {t("notifications.syncError", { ns: "materials" })}
    </div>
  );
}
