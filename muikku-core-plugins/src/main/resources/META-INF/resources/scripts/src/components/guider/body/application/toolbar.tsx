import * as React from "react";
import { connect } from "react-redux";
import * as queryString from "query-string";
import GuiderToolbarLabels from "./toolbar/labels";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import { GuiderState } from "~/reducers/main-function/guider";
import { StateType } from "~/reducers";
import {
  ApplicationPanelToolbar,
  ApplicationPanelToolbarActionsMain,
  ApplicationPanelToolsContainer,
} from "~/components/general/application-panel/application-panel";
import { ButtonPill } from "~/components/general/button";
import { SearchFormElement } from "~/components/general/form-element";
import NewMessage from "~/components/communicator/dialogs/new-message";
import NewContactEvent from "~/components/general/contact-logs-dialog";
import { StatusType } from "~/reducers/base/status";

import {
  removeFromGuiderSelectedStudents,
  RemoveFromGuiderSelectedStudentsTriggerType,
  toggleAllStudents,
  ToggleAllStudentsTriggerType,
  createNote,
  CreateNoteTriggerType,
} from "~/actions/main-function/guider";
import MApi from "~/api/api";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";
import { turnSelectedUsersToContacts } from "~/util/users";
import { GuiderContext } from "../../context";
import NotesItemNew from "~/components/general/notes//notes-item-new";
import { CreateNoteRequest } from "~/generated/client";
import { ContactRecipientType } from "~/reducers/user-index";
/**
 * GuiderToolbarProps
 */
interface GuiderToolbarProps extends WithTranslation {
  guider: GuiderState;
  status: StatusType;
  createNote: CreateNoteTriggerType;
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
    this.updateSearchWithQuery = this.updateSearchWithQuery.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.autofillLoaders = this.autofillLoaders.bind(this);
  }

    // These are required to make the types work in the context
    static contextType = GuiderContext;
    context!: React.ContextType<typeof GuiderContext>;

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
   * handleNoteCreation
   * @param request
   * @param onSuccess
   */
  handleNoteCreation = (request: CreateNoteRequest) => {
    this.props.createNote(request);
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
   * autofillLoaders
   */
  autofillLoaders() {
    const guiderApi = MApi.getGuiderApi();

    return {
      /**
       * studentsLoader
       * @param searchString searchString
       */
      studentsLoader: (searchString: string) => () =>
        guiderApi.getGuiderStudents({
          q: searchString,
          maxResults: 10,
        }),
    };
  }

  /**
   * render
   */
  render() {
    const view = this.context.view;
    if (view === "notes") {
      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <NotesItemNew onNotesItemSaveClick={this.handleNoteCreation}>
              <ButtonPill
                buttonModifiers={["add-note", "within-content"]}
                icon="plus"
                aria-label={this.props.i18n.t("wcag.createNewNote", {
                  ns: "tasks",
                })}
              />
            </NotesItemNew>
          </ApplicationPanelToolbarActionsMain>
        </ApplicationPanelToolbar>
      );
    } else if (view === "students") {
      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <NewMessage
              extraNamespace="guider"
              refreshInitialSelectedItemsOnOpen
              onRecipientChange={this.onContactsChange}
              initialSelectedItems={turnSelectedUsersToContacts(
                this.props.guider.selectedStudents,
                !this.props.status.isStudent
              )}
            >
              <ButtonPill
                disabled={this.props.guider.selectedStudentsIds.length < 1}
                icon="envelope"
                buttonModifiers="new-message"
              />
            </NewMessage>
            <NewContactEvent
              userIdentifier={this.props.status.userSchoolDataIdentifier}
              selectedItems={turnSelectedUsersToContacts(
                this.props.guider.selectedStudents,
                !this.props.status.isStudent
              )}
              status={this.props.status}
            >
              <ButtonPill
                icon="bubbles"
                buttonModifiers="create-contact-log-entry"
              />
            </NewContactEvent>
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
                placeholder={this.props.i18n.t("labels.search", {
                  ns: "users",
                  context: "students",
                })}
                value={this.state.searchquery}
              />
            </ApplicationPanelToolsContainer>
          </ApplicationPanelToolbarActionsMain>
        </ApplicationPanelToolbar>
      );
    }
  }
}

GuiderToolbar.contextType = GuiderContext;
/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    guider: state.guider,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      removeFromGuiderSelectedStudents,
      toggleAllStudents,
      createNote,
    },
    dispatch
  );
}

export default withTranslation(["guider"])(
  connect(mapStateToProps, mapDispatchToProps)(GuiderToolbar)
);
