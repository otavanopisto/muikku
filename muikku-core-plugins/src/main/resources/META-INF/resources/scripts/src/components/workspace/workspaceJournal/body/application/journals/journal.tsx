import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/Journal.scss';
import '~/sass/elements/rich-text.scss';
import '~/sass/elements/application-list.scss';

import { StatusType } from '~/reducers/base/status';
import {StateType} from '~/reducers';
import { ApplicationListItem, ApplicationListItemHeader, ApplicationListItemBody, ApplicationListItemFooter } from '~/components/general/application-list';
import Button from '~/components/general/button';
import { WorkspaceType, WorkspaceJournalType } from '~/reducers/workspaces';
import Avatar from '~/components/general/avatar';
import { getName } from '~/util/modifiers';

interface JournalProps {
  i18n: i18nType,
  status: StatusType,
  journal: WorkspaceJournalType,
  workspace: WorkspaceType
}

interface JournalState {
}

class Journal extends React.Component<JournalProps, JournalState>{
  render(){
    let student = this.props.workspace.students && this.props.workspace.students.find(s=>s.userEntityId === this.props.workspace.journals.userEntityId);
    return <ApplicationListItem className="journal">
      <ApplicationListItemHeader className="application-list__item-header--Journal">
        {student ? 
          <Avatar id={student.userEntityId} firstName={student.firstName} hasImage={student.hasImage}/> : null}
        <h2>{student ? getName(student, true) : this.props.journal.title}</h2>
        <span>{this.props.i18n.time.format(this.props.journal.created, "L LT")}</span>
      </ApplicationListItemHeader>
      <ApplicationListItemBody className="application-list__item-body--Journal">
        {!student ? <h2>{this.props.journal.title}</h2> : null}
        <article className="rich-text" dangerouslySetInnerHTML={{__html: this.props.journal.content}}></article>
      </ApplicationListItemBody>
      {this.props.journal.userEntityId === this.props.status.userId ? <ApplicationListItemFooter className="application-list__item-footer--Journal">
        <Button buttonModifiers={["primary-function-content ", "workspace-journals-action"]}>
          {this.props.i18n.text.get("plugin.workspace.journal.editEntryButton.label")}
        </Button>
        <Button buttonModifiers={["primary-function-content ", "workspace-journals-action"]}>
          {this.props.i18n.text.get("plugin.workspace.journal.deleteEntryButton.label")}
        </Button>
      </ApplicationListItemFooter> : null}
    </ApplicationListItem>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Journal);