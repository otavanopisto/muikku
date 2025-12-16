import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import Help from "./help";
import TableOfContentsComponent from "./content";
import { useTranslation } from "react-i18next";
import { MaterialEditorV2 } from "~/components/base/material-editorV2";

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
      <MaterialEditorV2 />
      <Help
        navigation={navigationComponent}
        onActiveNodeIdChange={props.onActiveNodeIdChange}
      />
    </div>
  );
};

export default WorkspaceHelpBody;
