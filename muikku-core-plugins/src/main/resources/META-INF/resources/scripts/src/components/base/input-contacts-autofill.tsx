/* eslint-disable react/no-string-refs */

/**
 * Deprecated resfs should be refactored
 */

import * as React from "react";
import Autocomplete from "~/components/general/autocomplete";
import TagInput from "~/components/general/tag-input";
import promisify from "~/util/promisify";
import { filterHighlight, getName } from "~/util/modifiers";
import mApi from "~/lib/mApi";
import { WorkspaceType } from "~/reducers/workspaces";
import {
  WorkspaceStaffListType,
  ContactRecipientType,
  UserGroupType,
  UserType,
  UserStaffType,
} from "~/reducers/user-index";
import "~/sass/elements/autocomplete.scss";
import "~/sass/elements/glyph.scss";

/**
 * InputContactsAutofillLoaders
 */
export interface InputContactsAutofillLoaders {
  studentsLoader?: (searchString: string) => any;
  staffLoader?: (searchString: string) => any;
  userGroupsLoader?: (searchString: string) => any;
  workspacesLoader?: (searchString: string) => any;
}

/**
 * InputContactsAutofillProps
 */
export interface InputContactsAutofillProps {
  placeholder?: string;
  label?: string;
  onChange: (newValue: ContactRecipientType[]) => void;
  modifier: string;
  selectedItems: ContactRecipientType[];
  hasGroupPermission?: boolean;
  hasUserPermission?: boolean;
  hasWorkspacePermission?: boolean;
  hasStaffPermission?: boolean;
  userPermissionIsOnlyDefaultUsers?: boolean;
  workspacePermissionIsOnlyMyWorkspaces?: boolean;
  showFullNames: boolean;
  showEmails?: boolean;
  autofocus?: boolean;
  loaders?: InputContactsAutofillLoaders;
  identifier: string;
}

/**
 * InputContactsAutofillState
 */
export interface InputContactsAutofillState {
  autocompleteSearchItems: ContactRecipientType[];
  selectedItems: ContactRecipientType[];
  textInput: string;
  autocompleteOpened: boolean;
  isFocused: boolean;
}

/**
 * checkHasPermission
 * @param which which
 * @param defaultValue defaultValue
 */
function checkHasPermission(which: boolean, defaultValue?: boolean) {
  if (typeof which === "undefined") {
    return typeof defaultValue === "undefined" ? true : defaultValue;
  }
  return which;
}

/**
 * c
 */
export default class c extends React.Component<
  InputContactsAutofillProps,
  InputContactsAutofillState
> {
  private blurTimeout: NodeJS.Timer;
  private selectedHeight: number;
  private activeSearchId: number;
  private activeSearchTimeout: NodeJS.Timer;

  /**
   * constructor
   * @param props props
   */
  constructor(props: InputContactsAutofillProps) {
    super(props);

    this.state = {
      autocompleteSearchItems: [],
      selectedItems: props.selectedItems || [],
      textInput: "",
      autocompleteOpened: false,

      isFocused: this.props.autofocus === true,
    };

    this.blurTimeout = null;
    this.selectedHeight = null;
    this.onInputChange = this.onInputChange.bind(this);
    this.autocompleteDataFromServer =
      this.autocompleteDataFromServer.bind(this);
    this.onAutocompleteItemClick = this.onAutocompleteItemClick.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.setBodyMargin = this.setBodyMargin.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.activeSearchId = null;
    this.activeSearchTimeout = null;
  }

  /**
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  componentWillReceiveProps(nextProps: InputContactsAutofillProps) {
    if (nextProps.selectedItems !== this.props.selectedItems) {
      this.setState({ selectedItems: nextProps.selectedItems });
    }
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    const selectedHeight = (
      this.refs["taginput"] as TagInput
    ).getSelectedHeight();
    this.selectedHeight = selectedHeight;
  }

  /**
   * setBodyMargin
   */
  setBodyMargin() {
    const selectedHeight = (
      this.refs["taginput"] as TagInput
    ).getSelectedHeight();
    const prevSelectedHeight = this.selectedHeight;
    const currentBodyMargin = parseFloat(document.body.style.marginBottom);
    const defaultBodyMargin = currentBodyMargin - prevSelectedHeight;

    if (selectedHeight !== this.selectedHeight) {
      const bodyMargin = defaultBodyMargin + selectedHeight + "px";
      document.body.style.marginBottom = bodyMargin;
      this.selectedHeight = selectedHeight;
    }
  }
  /**
   * onInputBlur
   * @param e e
   */
  onInputBlur(e: React.FocusEvent<any>) {
    this.blurTimeout = setTimeout(
      () => this.setState({ isFocused: false }),
      100
    ) as any;
  }

  /**
   * onInputFocus
   * @param e e
   */
  onInputFocus(e: React.FocusEvent<any>) {
    clearTimeout(this.blurTimeout);
    this.setState({ isFocused: true });
  }
  /**
   * onInputChange
   * @param e e
   */
  onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const textInput = e.target.value;
    this.setState({ textInput, autocompleteOpened: true });
    clearTimeout(this.activeSearchTimeout);
    if (textInput) {
      this.activeSearchTimeout = setTimeout(
        this.autocompleteDataFromServer.bind(this, textInput),
        100
      ) as any;
    } else {
      this.setState({
        autocompleteSearchItems: [],
      });
    }
  }

  /**
   * autocompleteDataFromServer
   * @param textInput textInput
   */
  async autocompleteDataFromServer(textInput: string) {
    const searchId = new Date().getTime();
    this.activeSearchId = searchId;
    const loaders = this.props.loaders || {};

    /**
     * getStudentsLoader
     */
    const getStudentsLoader = () =>
      loaders.studentsLoader
        ? loaders.studentsLoader(textInput)
        : promisify(
            mApi().user.users.read({
              q: textInput,
              onlyDefaultUsers: checkHasPermission(
                this.props.userPermissionIsOnlyDefaultUsers
              ),
            }),
            "callback"
          );

    /**
     * getUserGroupsLoader
     */
    const getUserGroupsLoader = () =>
      loaders.userGroupsLoader
        ? loaders.userGroupsLoader(textInput)
        : promisify(
            mApi().usergroup.groups.read({
              q: textInput,
            }),
            "callback"
          );

    /**
     * getWorkspacesLoader
     */
    const getWorkspacesLoader = () =>
      loaders.workspacesLoader
        ? loaders.workspacesLoader(textInput)
        : promisify(
            mApi().coursepicker.workspaces.read({
              q: textInput,
              myWorkspaces: checkHasPermission(
                this.props.workspacePermissionIsOnlyMyWorkspaces
              ),
            }),
            "callback"
          );

    /**
     * getStaffLoader
     */
    const getStaffLoader = () =>
      loaders.staffLoader
        ? loaders.staffLoader(textInput)
        : promisify(
            mApi().user.staffMembers.read({
              q: textInput,
            }),
            "callback"
          );

    const searchResults = await Promise.all([
      checkHasPermission(this.props.hasUserPermission)
        ? getStudentsLoader()()
            .then((result: any[]) => result || [])
            .catch((err: any): any[] => [])
        : [],
      checkHasPermission(this.props.hasGroupPermission)
        ? getUserGroupsLoader()()
            .then((result: any[]) => result || [])
            .catch((err: any): any[] => [])
        : [],
      checkHasPermission(this.props.hasWorkspacePermission)
        ? getWorkspacesLoader()()
            .then((result: any[]) => result || [])
            .catch((err: any): any[] => [])
        : [],
      checkHasPermission(this.props.hasStaffPermission, false)
        ? getStaffLoader()()
            .then((result: WorkspaceStaffListType) => result.results || [])
            .catch((err: any): any[] => [])
        : [],
    ]);

    const userItems: ContactRecipientType[] = searchResults[0].map(
      (item: UserType): ContactRecipientType => ({
        type: "user",
        value: {
          id: item.id,
          name: getName(item, this.props.showFullNames),
          email: item.email,
        },
      })
    );
    const userGroupItems: ContactRecipientType[] = searchResults[1].map(
      (item: UserGroupType): ContactRecipientType => ({
        type: "usergroup",
        value: {
          id: item.id,
          name: item.name,
          organization: item.organization,
        },
      })
    );
    const workspaceItems: ContactRecipientType[] = searchResults[2].map(
      (item: WorkspaceType): ContactRecipientType => ({
        type: "workspace",
        value: {
          id: item.id,
          name:
            item.name +
            (item.nameExtension ? " (" + item.nameExtension + ")" : ""),
        },
      })
    );
    const staffItems: ContactRecipientType[] = searchResults[3].map(
      (item: UserStaffType): ContactRecipientType => ({
        type: "staff",
        value: {
          id: item.userEntityId,
          name: getName(item, this.props.showFullNames),
          email: item.email,
          identifier: item.id,
        },
      })
    );
    const allItems: ContactRecipientType[] = userItems
      .concat(userGroupItems)
      .concat(workspaceItems)
      .concat(staffItems);

    //ensuring that the current search is the last search
    if (this.activeSearchId === searchId) {
      this.setState({
        autocompleteSearchItems: allItems,
      });
    }
  }

  /**
   * onDelete
   * @param item item
   */
  onDelete(item: ContactRecipientType) {
    clearTimeout(this.blurTimeout);
    const nfilteredValue = this.state.selectedItems.filter(
      (selectedItem) =>
        selectedItem.type !== item.type ||
        selectedItem.value.id !== item.value.id
    );
    this.setState(
      {
        selectedItems: nfilteredValue,
        isFocused: true,
      },
      this.setBodyMargin
    );

    this.props.onChange(nfilteredValue);
  }

  /**
   * onAutocompleteItemClick
   * @param item item
   * @param selected selected
   */
  onAutocompleteItemClick(item: ContactRecipientType, selected: boolean) {
    clearTimeout(this.blurTimeout);
    this.setBodyMargin;
    if (!selected) {
      const nvalue = this.state.selectedItems.concat([item]);
      this.setState(
        {
          selectedItems: nvalue,
          autocompleteOpened: false,
          textInput: "",
          isFocused: true,
        },
        this.setBodyMargin
      );
      this.props.onChange(nvalue);
    } else {
      this.setState({ isFocused: true });
    }
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const selectedItems = this.state.selectedItems.map((item) => {
      if (item.type === "user" || item.type === "staff") {
        return {
          node: (
            <span className="autocomplete__selected-item">
              <span className="glyph glyph--selected-recipient icon-user" />
              {item.value.name}
              {checkHasPermission(this.props.showEmails) ? (
                <i>{item.value.email}</i>
              ) : null}
            </span>
          ),
          value: item,
        };
      } else if (item.type === "usergroup") {
        return {
          node: (
            <span className="autocomplete__selected-item">
              <span className="glyph glyph--selected-recipient icon-users" />
              {item.value.name}
              {item.value.organization
                ? " (" + item.value.organization.name + ")"
                : ""}
            </span>
          ),
          value: item,
        };
      } else if (item.type === "workspace") {
        return {
          node: (
            <span className="autocomplete__selected-item">
              <span className="glyph glyph--selected-recipient icon-books" />
              {item.value.name}
            </span>
          ),
          value: item,
        };
      }
    });

    const autocompleteItems = this.state.autocompleteSearchItems.map((item) => {
      let node;
      if (item.type === "user" || item.type === "staff") {
        node = (
          <div className="autocomplete__recipient">
            <span className="glyph glyph--autocomplete-recipient icon-user"></span>
            {filterHighlight(item.value.name, this.state.textInput)}{" "}
            {checkHasPermission(this.props.showEmails) ? (
              <i>{item.value.email}</i>
            ) : null}
          </div>
        );
      } else if (item.type === "usergroup") {
        node = (
          <div className="autocomplete__recipient">
            <span className="glyph glyph--autocomplete-recipient icon-users"></span>
            {filterHighlight(item.value.name, this.state.textInput)}
            {item.value.organization
              ? " (" + item.value.organization.name + ")"
              : ""}
          </div>
        );
      } else if (item.type === "workspace") {
        node = (
          <div className="autocomplete__recipient">
            <span className="glyph glyph--autocomplete-recipient icon-books"></span>
            {filterHighlight(item.value.name, this.state.textInput)}
          </div>
        );
      }

      return {
        value: item,
        selected: !!this.state.selectedItems.find(
          (selectedItem) =>
            selectedItem.type === item.type &&
            selectedItem.value.id === item.value.id
        ),
        node,
      };
    });

    return (
      <Autocomplete
        items={autocompleteItems}
        onItemClick={this.onAutocompleteItemClick}
        opened={this.state.autocompleteOpened}
        modifier={this.props.modifier}
      >
        <TagInput
          identifier={this.props.identifier}
          ref="taginput"
          modifier={this.props.modifier}
          isFocused={this.state.isFocused}
          onBlur={this.onInputBlur}
          onFocus={this.onInputFocus}
          label={this.props.label}
          tags={selectedItems}
          placeholder={this.props.placeholder}
          onInputDataChange={this.onInputChange}
          inputValue={this.state.textInput}
          onDelete={this.onDelete}
        />
      </Autocomplete>
    );
  }
}
