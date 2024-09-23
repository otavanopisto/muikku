import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import Application from "~/components/announcer/body/application";
import Aside from "~/components/announcer/body/aside";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceAnnouncerBodyProps
 */
interface WorkspaceAnnouncerBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceAnnouncerBody
 * @param props props
 */
const WorkspaceAnnouncerBody = (props: WorkspaceAnnouncerBodyProps) => {
  const { t } = useTranslation(["common"]);

  const aside = <Aside />;
  return (
    <div>
      <WorkspaceNavbar
        title={t("labels.announcer")}
        navigation={aside}
        activeTrail="workspace-announcer"
        workspaceUrl={props.workspaceUrl}
      />
      <Application aside={aside} />
    </div>
  );
};

export default WorkspaceAnnouncerBody;
