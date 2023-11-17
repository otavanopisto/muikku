import * as React from "react";
import { connect } from "react-redux";
import Link from "~/components/general/link";
import { StateType } from "~/reducers";
import { Panel } from "~/components/general/panel";
import { useTranslation } from "react-i18next";
import { UserGuardiansDependant } from "~/generated/client";
import { getName } from "~/util/modifiers";
/**
 * StudentsPanelProps
 */
interface StudentsPanelProps {
  dependants: UserGuardiansDependant[];
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
        <div className="item-list item-list--panel-workspaces">
          {dependants.map((dependant) => (
            <Link
              key={dependant.identifier}
              className="item-list__item item-list__item--workspaces"
              href={`/guardian#${dependant.identifier}`}
            >
              <span className="item-list__icon item-list__icon--workspaces icon-user"></span>
              <span className="item-list__text-body">
                {getName(dependant, true)}
              </span>
            </Link>
          ))}
        </div>
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
