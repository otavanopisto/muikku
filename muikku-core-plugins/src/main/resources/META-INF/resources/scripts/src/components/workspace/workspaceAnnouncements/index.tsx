/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import Application from "~/components/announcements/body/application";
import Aside from "~/components/announcements/body/aside";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceAnnouncementsBodyProps
 */
interface WorkspaceAnnouncementsBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceAnnouncementsBody
 * @param props props
 */
const WorkspaceAnnouncementsBody = (props: WorkspaceAnnouncementsBodyProps) => {
  const { t } = useTranslation(["common", "messaging"]);
  const aside = <Aside />;
  return (
    <div>
      <WorkspaceNavbar
        title={t("labels.announcements", { ns: "messaging" })}
        navigation={aside}
        activeTrail="workspace-announcements"
        workspaceUrl={props.workspaceUrl}
      />
      <Application aside={aside} />
    </div>
  );
};

export default WorkspaceAnnouncementsBody;
