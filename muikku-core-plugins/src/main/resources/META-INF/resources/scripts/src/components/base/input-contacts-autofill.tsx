import * as React from 'react';
import Autocomplete from '~/components/general/autocomplete';
import TagInput from '~/components/general/tag-input';
import promisify from '~/util/promisify';
import { filterHighlight, getName } from '~/util/modifiers';
import mApi from '~/lib/mApi';
import { WorkspaceType } from '~/reducers/workspaces';
import { ContactRecepientType, WorkspaceStaffListType, ContactRecipientType, UserRecepientUserType, UserGroupRecepientType, WorkspaceRecepientType, UserGroupType, UserType, UserStaffType, StaffRecepientType } from '~/reducers/user-index';
import '~/sass/elements/autocomplete.scss';
import '~/sass/elements/glyph.scss';
import { GuiderStudentType } from '~/reducers/main-function/guider';

export interface InputContactsAutofillLoaders {
  studentsLoader?: (searchString: string) => any,
  staffLoader?: (searchString: string) => any,
  userGroupsLoader?: (searchString: string) => any,
  workspacesLoader?: (searchString: string) => any
}

export interface InputContactsAutofillProps {
  placeholder?: string,
  label?: string,
  onChange: (newValue: ContactRecipientType[]) => void,
  modifier: string,
  selectedItems: ContactRecipientType[],
  hasGroupPermission?: boolean,
  hasUserPermission?: boolean,
  hasWorkspacePermission?: boolean,
  hasStaffPermission?: boolean,
  userPermissionIsOnlyDefaultUsers?: boolean,
  workspacePermissionIsOnlyMyWorkspaces?: boolean,
  showFullNames: boolean,
  showEmails?: boolean,
  autofocus?: boolean,
  loaders?: InputContactsAutofillLoaders,
  identifier: string,
}

export interface InputContactsAutofillState {
  autocompleteSearchItems: ContactRecipientType[],
  selectedItems: ContactRecipientType[],
  textInput: string,
  autocompleteOpened: boolean,
  isFocused: boolean
}

function checkHasPermission(which: boolean, defaultValue?: boolean) {
  if (typeof which === "undefined") {
    return typeof defaultValue === "undefined" ? true : defaultValue;
  }
  return which;
}

export default class c extends React.Component<InputContactsAutofillProps, InputContactsAutofillState> {
  private blurTimeout: NodeJS.Timer;
  private selectedHeight: number;
  private activeSearchId: number;
  private activeSearchTimeout: NodeJS.Timer;

  constructor(props: InputContactsAutofillProps) {
    super(props);

    this.state = {
      autocompleteSearchItems: [],
      selectedItems: props.selectedItems || [],
      textInput: "",
      autocompleteOpened: false,

      isFocused: this.props.autofocus === true
    }

    this.blurTimeout = null;
    this.selectedHeight = null;
    this.onInputChange = this.onInputChange.bind(this);
    this.autocompleteDataFromServer = this.autocompleteDataFromServer.bind(this);
    this.onAutocompleteItemClick = this.onAutocompleteItemClick.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.setBodyMargin = this.setBodyMargin.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.activeSearchId = null;
    this.activeSearchTimeout = null;
  }
  componentWillReceiveProps(nextProps: InputContactsAutofillProps) {
    if (nextProps.selectedItems !== this.props.selectedItems) {
      this.setState({ selectedItems: nextProps.selectedItems })
    }
  }

  setBodyMargin() {
    let selectedHeight = (this.refs["taginput"] as TagInput).getSelectedHeight();
    let prevSelectedHeight = this.selectedHeight;
    let currentBodyMargin = parseFloat(document.body.style.marginBottom);
    let defaultBodyMargin = currentBodyMargin - prevSelectedHeight;

    if (selectedHeight !== this.selectedHeight) {
      let bodyMargin = defaultBodyMargin + selectedHeight + "px";
      document.body.style.marginBottom = bodyMargin;
      this.selectedHeight = selectedHeight;
    }
  }
  onInputBlur(e: React.FocusEvent<any>) {
    this.blurTimeout = setTimeout(() => this.setState({ isFocused: false }), 100) as any;
  }
  onInputFocus(e: React.FocusEvent<any>) {
    clearTimeout(this.blurTimeout);
    this.setState({ isFocused: true });
  }
  onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let textInput = e.target.value;
    this.setState({ textInput, autocompleteOpened: true });
    clearTimeout(this.activeSearchTimeout);
    if (textInput) {
      this.activeSearchTimeout = setTimeout(this.autocompleteDataFromServer.bind(this, textInput), 100) as any;
    } else {
      this.setState({
        autocompleteSearchItems: []
      });
    }
  }

  async autocompleteDataFromServer(textInput: string) {
    let searchId = (new Date()).getTime();
    this.activeSearchId = searchId;
    let loaders = this.props.loaders || {};

    let getStudentsLoader = () => {
      return loaders.studentsLoader ? loaders.studentsLoader(textInput) : promisify(mApi().user.users.read({
        q: textInput,
        onlyDefaultUsers: checkHasPermission(this.props.userPermissionIsOnlyDefaultUsers)
      }), 'callback');
    }
    let getUserGroupsLoader = () => {
      return loaders.userGroupsLoader ? loaders.userGroupsLoader(textInput) : promisify(mApi().usergroup.groups.read({
        q: textInput
      }), 'callback');
    }
    let getWorkspacesLoader = () => {
      return loaders.workspacesLoader ? loaders.workspacesLoader(textInput) : promisify(mApi().coursepicker.workspaces.read({
        q: textInput,
        myWorkspaces: checkHasPermission(this.props.workspacePermissionIsOnlyMyWorkspaces)
      }), 'callback');
    }
    let getStaffLoader = () => {
      return loaders.staffLoader ? loaders.staffLoader(textInput) : promisify(mApi().user.staffMembers.read({
        q: textInput
      }), 'callback');
    }

    let searchResults = await Promise.all(
      [
        checkHasPermission(this.props.hasUserPermission) ? getStudentsLoader()().then((result: any[]) => result || []).catch((err: any): any[] => []) : [],
        checkHasPermission(this.props.hasGroupPermission) ? getUserGroupsLoader()().then((result: any[]) => result || []).catch((err: any): any[] => []) : [],
        checkHasPermission(this.props.hasWorkspacePermission) ? getWorkspacesLoader()().then((result: any[]) => result || []).catch((err: any): any[] => []) : [],
        checkHasPermission(this.props.hasStaffPermission, false) ? getStaffLoader()().then((result: WorkspaceStaffListType) => result.results || []).catch((err: any): any[] => []) : [],
      ]
    );

    let userItems: ContactRecipientType[] = searchResults[0].map((item: UserType): ContactRecipientType => ({
      type: "user",
      value: {
        id: item.id,
        name: getName(item, this.props.showFullNames),
        email: item.email
      }
    }));
    let userGroupItems: ContactRecipientType[] = searchResults[1].map((item: UserGroupType): ContactRecipientType => ({
      type: "usergroup",
      value: {
        id: item.id,
        name: item.name,
        organization: item.organization,
      }
    }));
    let workspaceItems: ContactRecipientType[] = searchResults[2].map((item: WorkspaceType): ContactRecipientType => ({
      type: "workspace",
      value: {
        id: item.id,
        name: item.name + (item.nameExtension ? (" (" + item.nameExtension + ")") : "")
      }
    }))
    let staffItems: ContactRecipientType[] = searchResults[3].map((item: UserStaffType): ContactRecipientType => ({
      type: "staff",
      value: {
        id: item.userEntityId,
        name: getName(item, this.props.showFullNames),
        email: item.email,
        identifier: item.id
      }
    }))
    let allItems: ContactRecipientType[] = userItems.concat(userGroupItems).concat(workspaceItems).concat(staffItems);

    //ensuring that the current search is the last search
    if (this.activeSearchId === searchId) {
      this.setState({
        autocompleteSearchItems: allItems
      });
    }
  }
  onDelete(item: ContactRecipientType) {
    clearTimeout(this.blurTimeout);
    let nfilteredValue = this.state.selectedItems.filter(selectedItem => selectedItem.type !== item.type || selectedItem.value.id !== item.value.id);
    this.setState({
      selectedItems: nfilteredValue,
      isFocused: true
    }, this.setBodyMargin
    );

    this.props.onChange(nfilteredValue);
  }
  onAutocompleteItemClick(item: ContactRecipientType, selected: boolean) {
    clearTimeout(this.blurTimeout);
    this.setBodyMargin;
    if (!selected) {
      let nvalue = this.state.selectedItems.concat([item]);
      this.setState({
        selectedItems: nvalue,
        autocompleteOpened: false,
        textInput: "",
        isFocused: true
      }, this.setBodyMargin
      );
      this.props.onChange(nvalue);
    } else {
      this.setState({ isFocused: true });
    }
  }

  componentDidMount() {
    let selectedHeight = (this.refs["taginput"] as TagInput).getSelectedHeight();
    this.selectedHeight = selectedHeight;
  }

  render() {
    let selectedItems = this.state.selectedItems.map((item) => {
      if (item.type === "user" || item.type === "staff") {
        return {
          node: <span className="autocomplete__selected-item">
            <span className="glyph glyph--selected-recipient icon-user" />
            {item.value.name}
            {checkHasPermission(this.props.showEmails) ? <i>{item.value.email}</i> : null}
          </span>,
          value: item
        };
      } else if (item.type === "usergroup") {
        return {
          node: <span className="autocomplete__selected-item">
            <span className="glyph glyph--selected-recipient icon-users" />{item.value.name}
            {item.value.organization ? " (" + item.value.organization.name + ")" : ""}
          </span>,
          value: item
        };
      } else if (item.type === "workspace") {
        return {
          node: <span className="autocomplete__selected-item">
            <span className="glyph glyph--selected-recipient icon-books" />{item.value.name}
          </span>,
          value: item
        };
      }
    });

    let autocompleteItems = this.state.autocompleteSearchItems.map((item) => {
      let node;
      if (item.type === "user" || item.type === "staff") {
        node = <div className="autocomplete__recipient">
          <span className="glyph glyph--autocomplete-recipient icon-user"></span>
          {
            filterHighlight(item.value.name, this.state.textInput)
          } {checkHasPermission(this.props.showEmails) ? <i>{item.value.email}</i> : null}
        </div>;
      } else if (item.type === "usergroup") {
        node = <div className="autocomplete__recipient">
          <span className="glyph glyph--autocomplete-recipient icon-users"></span>
          {filterHighlight(item.value.name, this.state.textInput)}
          {item.value.organization ? " (" + item.value.organization.name + ")" : ""}
        </div>;
      } else if (item.type === "workspace") {
        node = <div className="autocomplete__recipient">
          <span className="glyph glyph--autocomplete-recipient icon-books"></span>
          {filterHighlight(item.value.name, this.state.textInput)}
        </div>;
      }

      return {
        value: item,
        selected: !!this.state.selectedItems.find(selectedItem => selectedItem.type === item.type && selectedItem.value.id === item.value.id || selectedItem.value),
        node
      }
    });

    return <Autocomplete items={autocompleteItems} onItemClick={this.onAutocompleteItemClick}
      opened={this.state.autocompleteOpened} modifier={this.props.modifier}>
      <TagInput identifier={this.props.identifier} ref="taginput" modifier={this.props.modifier}
        isFocused={this.state.isFocused} onBlur={this.onInputBlur} onFocus={this.onInputFocus}
        label={this.props.label}
        tags={selectedItems} placeholder={this.props.placeholder} onInputDataChange={this.onInputChange} inputValue={this.state.textInput} onDelete={this.onDelete} />
    </Autocomplete>
  }
}
