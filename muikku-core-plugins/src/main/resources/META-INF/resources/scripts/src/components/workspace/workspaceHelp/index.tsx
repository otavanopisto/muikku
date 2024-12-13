import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import Help from "./help";
import MaterialEditor from "~/components/base/material-editor";
import TableOfContentsComponent from "./content";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceHelpBodyProps
 */
interface WorkspaceHelpBodyProps {
  workspaceUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onActiveNodeIdChange: (newId: number) => any;
}

/**
 * WorkspaceHelpBody
 * @param props props
 */
const WorkspaceHelpBody = (props: WorkspaceHelpBodyProps) => {
  const { t } = useTranslation(["common", "workspace"]);
  const navigationComponent = <TableOfContentsComponent />;
  return (
    <div>
      <WorkspaceNavbar
        title={t("labels.instructions", { ns: "workspace" })}
        activeTrail="help"
        workspaceUrl={props.workspaceUrl}
      />
      <MaterialEditor locationPage="Help" />
      <Help
        navigation={navigationComponent}
        onActiveNodeIdChange={props.onActiveNodeIdChange}
      />
    </div>
  );
};

export default WorkspaceHelpBody;
