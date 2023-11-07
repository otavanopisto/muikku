import * as React from "react";
import { connect } from "react-redux";
import Link from "~/components/general/link";
import { StateType } from "~/reducers";
import { Panel } from "~/components/general/panel";
import { useTranslation } from "react-i18next";

/**
 * StudentsPanelProps
 */
interface StudentsPanelProps {
  // students: [];
}

/**
 * Workspace panel
 * @param props StudentsPanelProps
 * @returns  JSX.element
 */
const StudentsPanel: React.FC<StudentsPanelProps> = (props) => {
  const students = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ];
  const { t } = useTranslation(["frontPage", "common"]);

  return (
    <Panel
      icon="icon-books"
      modifier="workspaces"
      header={t("labels.students")}
    >
      {students.length ? (
        <div className="item-list item-list--panel-workspaces">
          {students.map((student) => (
            <Link
              key={student.id}
              className="item-list__item item-list__item--workspaces"
              href={``}
            >
              <span className="item-list__icon item-list__icon--workspaces icon-books"></span>
              <span className="item-list__text-body">{student.name}</span>
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
    // workspaces: state.workspaces.userWorkspaces,
  };
}

export default connect(mapStateToProps)(StudentsPanel);
