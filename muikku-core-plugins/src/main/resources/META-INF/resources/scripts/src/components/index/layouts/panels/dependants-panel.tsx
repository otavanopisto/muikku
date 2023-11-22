import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { Panel } from "~/components/general/panel";
import { useTranslation } from "react-i18next";
import DependantComponent from "./dependants/dependant";
import { Dependant } from "~/reducers/main-function/dependants";

/**
 * StudentsPanelProps
 */
interface StudentsPanelProps {
  dependants: Dependant[];
}

/**
 * Workspace panel
 * @param props StudentsPanelProps
 * @returns  JSX.element
 */
const StudentsPanel: React.FC<StudentsPanelProps> = (props) => {
  const { dependants } = props;
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    dependants: state.dependants.list,
  };
}

export default connect(mapStateToProps)(StudentsPanel);
