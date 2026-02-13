import * as React from "react";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { Panel } from "~/components/general/panel";
import { useTranslation } from "react-i18next";
import DependantComponent from "./dependants/dependant";

/**
 * StudentsPanelProps
 */
interface DependantsPanelProps {}

/**
 * Workspace panel
 * @param props StudentsPanelProps
 * @returns  JSX.element
 */
const DependantsPanel: React.FC<DependantsPanelProps> = (props) => {
  const dependants = useSelector(
    (state: StateType) => state.guardian.dependants
  );
  const { t } = useTranslation(["frontPage", "common"]);

  return (
    <Panel
      icon="icon-users"
      modifier="dependants"
      header={t("labels.dependant", { count: dependants.length })}
    >
      {dependants.length ? (
        <Panel.BodyContent>
          {dependants.map((dependant) => (
            <DependantComponent
              key={dependant.identifier}
              dependant={dependant}
            />
          ))}
        </Panel.BodyContent>
      ) : (
        <Panel.BodyContent modifier="empty">
          {t("content.empty", { context: "users" })}
        </Panel.BodyContent>
      )}
    </Panel>
  );
};

export default DependantsPanel;
