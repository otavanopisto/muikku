import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Link from "~/components/general/link";

import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";

import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListItemBody,
  ApplicationListItemFooter
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import { WorkspaceType, WorkspaceJournalType } from "~/reducers/workspaces";
import Avatar from "~/components/general/avatar";
import { getName } from "~/util/modifiers";
import DeleteJournal from "~/components/workspace/workspaceJournal/dialogs/delete-journal";
import EditJournal from "~/components/workspace/workspaceJournal/dialogs/new-edit-journal";

interface JournalProps {
  i18n: i18nType;
  status: StatusType;
  journal: WorkspaceJournalType;
  workspace: WorkspaceType;
}

interface JournalState {}

class Journal extends React.Component<JournalProps, JournalState> {
  render() {
    let student =
      this.props.workspace.students &&
      this.props.workspace.students.results.find(
        (s) => s.userEntityId === this.props.journal.userEntityId
      );
    return (
      <ApplicationListItem className="journal">
        <ApplicationListItemHeader className="application-list__item-header--journal-entry">
          {!this.props.status.isStudent ? (
            student ? (
              <Avatar
                id={student.userEntityId}
                firstName={student.firstName}
                hasImage={student.hasImage}
              />
            ) : null
          ) : null}
          <div className="application-list__item-header-main application-list__item-header-main--journal-entry">
            {!this.props.status.isStudent ? (
              <span className="application-list__item-header-main-content application-list__item-header-main-content--journal-entry-creator">
                {student ? getName(student, true) : this.props.journal.title}
              </span>
            ) : (
              <span className="application-list__item-header-main-content application-list__item-header-main-content--journal-entry-title">
                {this.props.journal.title}
              </span>
            )}
          </div>
          <div className="application-list__item-header-aside">
            <span>
              {this.props.i18n.time.format(this.props.journal.created, "L LT")}
            </span>
          </div>
        </ApplicationListItemHeader>
        <ApplicationListItemBody className="application-list__item-body">
          {!this.props.status.isStudent ? (
            student ? (
              <header className="application-list__item-content-header application-list__item-content-header--journal-entry">
                {this.props.journal.title}
              </header>
            ) : null
          ) : null}
          <article
            className="application-list__item-content-body application-list__item-content-body--journal-entry rich-text"
            dangerouslySetInnerHTML={{ __html: this.props.journal.content }}
          ></article>
        </ApplicationListItemBody>
        {this.props.journal.userEntityId === this.props.status.userId ? (
          <ApplicationListItemFooter className="application-list__item-footer--journal-entry">
            <EditJournal journal={this.props.journal}>
              <Link
                as="span"
                className="link link--application-list-item-footer"
              >
                {this.props.i18n.text.get(
                  "plugin.workspace.journal.editEntryButton.label"
                )}
              </Link>
            </EditJournal>
            <DeleteJournal journal={this.props.journal}>
              <Link
                as="span"
                className="link link--application-list-item-footer"
              >
                {this.props.i18n.text.get(
                  "plugin.workspace.journal.deleteEntryButton.label"
                )}
              </Link>
            </DeleteJournal>
          </ApplicationListItemFooter>
        ) : null}
      </ApplicationListItem>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Journal);
