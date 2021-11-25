import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import * as queryString from 'query-string';
import GuiderToolbarLabels from './toolbar/labels';
import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-elements.scss';
import { GuiderType, GuiderStudentListType } from '~/reducers/main-function/guider';
import { StateType } from '~/reducers';
import { ApplicationPanelToolbar, ApplicationPanelToolbarActionsMain, ApplicationPanelToolsContainer } from '~/components/general/application-panel/application-panel';
import { ButtonPill } from '~/components/general/button';
import { SearchFormElement } from '~/components/general/form-element';
import NewMessage from '~/components/communicator/dialogs/new-message';
import { ContactRecipientType } from '~/reducers/user-index';
import { getName } from '~/util/modifiers';
import { StatusType } from '~/reducers/base/status';
import {
  removeFromGuiderSelectedStudents,
  RemoveFromGuiderSelectedStudentsTriggerType
} from "~/actions/main-function/guider";
import { bindActionCreators } from "redux";

interface GuiderToolbarProps {
  i18n: i18nType,
  guider: GuiderType
  status: StatusType
  removeFromGuiderSelectedStudents: RemoveFromGuiderSelectedStudentsTriggerType;
}

interface GuiderToolbarState {
  searchquery: string,
  focused: boolean
}

class GuiderToolbar extends React.Component<GuiderToolbarProps, GuiderToolbarState> {
  constructor(props: GuiderToolbarProps) {
    super(props);

    this.state = {
      searchquery: this.props.guider.activeFilters.query || "",
      focused: false
    }

    this.updateSearchWithQuery = this.updateSearchWithQuery.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
    this.getBackByHash = this.getBackByHash.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
  }

  getBackByHash(): string {
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", { arrayFormat: 'bracket' });
    delete locationData.c;
    let newHash = "#?" + queryString.stringify(locationData, { arrayFormat: 'bracket' });
    return newHash;
  }

  onGoBackClick(e: React.MouseEvent<HTMLAnchorElement>) {
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState) {
      let canGoBack = (!document.referrer || document.referrer.indexOf(window.location.host) !== -1) && (history.length);
      if (canGoBack) {
        history.back();
      } else {
        history.replaceState('', '', this.getBackByHash());
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      location.hash = this.getBackByHash();
    }
  }

  updateSearchWithQuery(query: string) {
    this.setState({
      searchquery: query
    });
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", { arrayFormat: 'bracket' });
    locationData.q = query;
    window.location.hash = "#?" + queryString.stringify(locationData, { arrayFormat: 'bracket' });
  }

  componentWillReceiveProps(nextProps: GuiderToolbarProps) {
    if (!this.state.focused && (nextProps.guider.activeFilters.query || "") !== this.state.searchquery) {
      this.setState({
        searchquery: nextProps.guider.activeFilters.query || ""
      });
    }
  }

  onInputFocus() {
    this.setState({ focused: true });
  }

  onInputBlur() {
    this.setState({ focused: false });
  }

  /**
   * turnSelectedUsersToContacts
   * @param users array of GuiderStudents
   * @returns {Array} an Array of ContactRecipientType
   */

  turnSelectedUsersToContacts = (users: GuiderStudentListType): ContactRecipientType[] => {
    let contacts: ContactRecipientType[] = [];
    users.map((user) => {
      contacts.push({
        type: "user",
        value: {
          id: user.userEntityId,
          name: getName(user, !this.props.status.isStudent),
          identifier: user.id,
          email: user.email
        }
      })
    });
    return contacts;
  }

  onContactsChange = (selectedUsers: ContactRecipientType[]) => {
    const selectedUserIds: string[] = selectedUsers.map((student) => student.value.identifier);
    const guiderSelectedStudentsIds = this.props.guider.selectedStudentsIds;
    let remainingStudentsId: string;

    if (selectedUserIds.length < guiderSelectedStudentsIds.length) {
      for (let i = 0; i < guiderSelectedStudentsIds.length; i++) {
        if (!selectedUserIds.find((id) => id === guiderSelectedStudentsIds[i])) {
          remainingStudentsId = guiderSelectedStudentsIds[i];
        }
      }
      let guiderSelectedStudent = this.props.guider.selectedStudents.find(user => user.id === remainingStudentsId);

      if (!!guiderSelectedStudent) {
        this.props.removeFromGuiderSelectedStudents(this.props.guider.selectedStudents.find(user => user.id === remainingStudentsId));
      }
    }
  }

  render() {
    return (
      <ApplicationPanelToolbar>
        <ApplicationPanelToolbarActionsMain>
          {this.props.guider.currentStudent ? <ButtonPill icon="back" buttonModifiers="go-back" onClick={this.onGoBackClick} disabled={this.props.guider.toolbarLock} /> :
            <NewMessage onRecipientChange={this.onContactsChange} initialSelectedItems={this.turnSelectedUsersToContacts(this.props.guider.selectedStudents)}><ButtonPill icon="envelope" buttonModifiers="new-message" disabled={false} /></NewMessage>}
          <GuiderToolbarLabels />
          {this.props.guider.currentStudent ? null :
            <ApplicationPanelToolsContainer>
              <SearchFormElement
                updateField={this.updateSearchWithQuery}
                name="guider-search"
                id="searchUsers"
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
                placeholder={this.props.i18n.text.get('plugin.guider.search.placeholder')}
                value={this.state.searchquery}
              />
            </ApplicationPanelToolsContainer>}
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
    )
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      removeFromGuiderSelectedStudents
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuiderToolbar);
