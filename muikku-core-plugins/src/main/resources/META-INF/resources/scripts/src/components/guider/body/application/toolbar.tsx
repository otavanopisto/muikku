import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import * as queryString from "query-string";
import GuiderToolbarLabels from "./toolbar/labels";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import {
  GuiderType,
  GuiderStudentListType,
} from "~/reducers/main-function/guider";
import { StateType } from "~/reducers";
import {
  ApplicationPanelToolbar,
  ApplicationPanelToolbarActionsMain,
  ApplicationPanelToolsContainer,
} from "~/components/general/application-panel/application-panel";
import { ButtonPill } from "~/components/general/button";
import { SearchFormElement } from "~/components/general/form-element";
import NewMessage from "~/components/communicator/dialogs/new-message";
import { ContactRecipientType } from "~/reducers/user-index";
import { getName } from "~/util/modifiers";
import { StatusType } from "~/reducers/base/status";

import {
  removeFromGuiderSelectedStudents,
  RemoveFromGuiderSelectedStudentsTriggerType,
  toggleAllStudents,
  ToggleAllStudentsTriggerType,
} from "~/actions/main-function/guider";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * GuiderToolbarProps
 */
interface GuiderToolbarProps extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  guider: GuiderType;
  status: StatusType;
  toggleAllStudents: ToggleAllStudentsTriggerType;
  removeFromGuiderSelectedStudents: RemoveFromGuiderSelectedStudentsTriggerType;
}

/**
 * GuiderToolbarState
 */
interface GuiderToolbarState {
  searchquery: string;
  focused: boolean;
}

/**
 * GuiderToolbar
 */
class GuiderToolbar extends React.Component<
  GuiderToolbarProps,
  GuiderToolbarState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: GuiderToolbarProps) {
    super(props);

    this.state = {
      searchquery: this.props.guider.activeFilters.query || "",
      focused: false,
    };

    this.updateSearchWithQuery = this.updateSearchWithQuery.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   * @param prevState prevState
   */
  componentDidUpdate(
    prevProps: Readonly<GuiderToolbarProps>,
    prevState: Readonly<GuiderToolbarState>
  ) {
    if (
      !this.state.focused &&
      this.props.guider.activeFilters.query !== this.state.searchquery
    ) {
      this.setState({
        searchquery: this.props.guider.activeFilters.query,
      });
    }
  }

  /**
   * getBackByHash
   * @returns hash
   */
  getBackByHash(): string {
    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );
    delete locationData.c;
    const newHash =
      "#?" + queryString.stringify(locationData, { arrayFormat: "bracket" });
    return newHash;
  }

  /**
   * onGoBackClick
   */
  onGoBackClick() {
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState) {
      const canGoBack =
        (!document.referrer ||
          document.referrer.indexOf(window.location.host) !== -1) &&
        history.length;
      if (canGoBack) {
        history.back();
      } else {
        history.replaceState("", "", this.getBackByHash());
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      location.hash = this.getBackByHash();
    }
  }

  /**
   * updateSearchWithQuery
   * @param query query
   */
  updateSearchWithQuery(query: string) {
    this.setState({
      searchquery: query,
    });
    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );
    locationData.q = query;
    window.location.hash =
      "#?" + queryString.stringify(locationData, { arrayFormat: "bracket" });
  }

  /**
   * onInputFocus
   */
  onInputFocus() {
    this.setState({ focused: true });
  }

  /**
   * onInputBlur
   */
  onInputBlur() {
    this.setState({ focused: false });
  }

  /**
   * turnSelectedUsersToContacts
   * @param users array of GuiderStudents
   * @returns {Array} an Array of ContactRecipientType
   */
  turnSelectedUsersToContacts = (
    users: GuiderStudentListType
  ): ContactRecipientType[] => {
    const contacts: ContactRecipientType[] = [];
    users.map((user) => {
      contacts.push({
        type: "user",
        value: {
          id: user.userEntityId,
          name: getName(user, !this.props.status.isStudent),
          identifier: user.id,
          email: user.email,
        },
      });
    });
    return contacts;
  };

  /**
   * Removes a user from redux state when the user is removed from a new message dialog on a contacts change
   * @param selectedUsers is an Array of ContactRecipientType
   */
  onContactsChange = (selectedUsers: ContactRecipientType[]): void => {
    // We need the arrays of ids for comparison from the dialog and the redux state

    const selectedUserIds: number[] = selectedUsers.map(
      (student) => student.value.id
    );
    const guiderSelectedStudentsIds: number[] =
      this.props.guider.selectedStudents.map((student) => student.userEntityId);

    // whatever id will be left from the iteration, will be stored here

    let remainingStudentsId: number;

    for (let i = 0; i < guiderSelectedStudentsIds.length; i++) {
      if (!selectedUserIds.find((id) => id === guiderSelectedStudentsIds[i])) {
        remainingStudentsId = guiderSelectedStudentsIds[i];
      }
    }

    // Check if the leftover id is actually a user in the redux state and if it is, remove it

    const selectedUser = this.props.guider.selectedStudents.find(
      (user) => user.userEntityId === remainingStudentsId
    );
    const isGuiderSelectedStudent = !!selectedUser;

    if (isGuiderSelectedStudent) {
      this.props.removeFromGuiderSelectedStudents(selectedUser);
    }
  };

  /**
   * render
   */
  render() {
    return (
      <ApplicationPanelToolbar>
        <ApplicationPanelToolbarActionsMain>
          <NewMessage
            extraNamespace="guider"
            refreshInitialSelectedItemsOnOpen
            onRecipientChange={this.onContactsChange}
            initialSelectedItems={this.turnSelectedUsersToContacts(
              this.props.guider.selectedStudents
            )}
          >
            <ButtonPill
              disabled={this.props.guider.selectedStudentsIds.length < 1}
              icon="envelope"
              buttonModifiers="new-message"
            />
          </NewMessage>

          <ButtonPill
            buttonModifiers="toggle"
            icon="check"
            disabled={this.props.guider.students.length < 1}
            onClick={this.props.toggleAllStudents}
          />
          <GuiderToolbarLabels />
          <ApplicationPanelToolsContainer>
            <SearchFormElement
              updateField={this.updateSearchWithQuery}
              name="guider-search"
              id="searchUsers"
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              placeholder={this.props.i18nOLD.text.get(
                "plugin.guider.search.placeholder"
              )}
              value={this.state.searchquery}
            />
          </ApplicationPanelToolsContainer>
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
    guider: state.guider,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      removeFromGuiderSelectedStudents,
      toggleAllStudents,
    },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(GuiderToolbar)
);
