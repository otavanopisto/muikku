import * as React from 'react';
import Autocomplete from '~/components/general/autocomplete';
import TagInput from '~/components/general/tag-input';
import promisify from '~/util/promisify';
import {filterHighlight} from '~/util/modifiers';
import mApi from '~/lib/mApi';
import {WorkspaceType} from '~/reducers/main-function/index/workspaces';
import { ContactRecepientType, UserRecepientType, UserGroupRecepientType, WorkspaceRecepientType, UserWithSchoolDataType, UserGroupType, ExtendedUserType, UserStaffType, StaffRecepientType } from '~/reducers/main-function/user-index';

export interface InputContactsAutofillProps {
  placeholder?: string,
  onChange: (newValue: ContactRecepientType[])=>any,
  modifier: string,
  selectedItems: ContactRecepientType[],
  hasGroupPermission?: boolean,
  hasUserPermission?: boolean,
  hasWorkspacePermission?: boolean,
  hasStaffPermission?: boolean,
  userPermissionIsOnlyDefaultUsers?: boolean,
  workspacePermissionIsOnlyMyWorkspaces?: boolean,
  showEmails?: boolean,
  autofocus?: boolean
}

export interface InputContactsAutofillState {
  autocompleteSearchItems: ContactRecepientType[],
  selectedItems: ContactRecepientType[],
  textInput: string,
  autocompleteOpened: boolean,
  fieldHeight?: number,
  isFocused: boolean
}

function checkHasPermission(which: boolean, defaultValue?: boolean){
  if (typeof which === "undefined"){
    return typeof defaultValue === "undefined" ? true : defaultValue;
  }
  return which;
}

export default class InputContactsAutofill extends React.Component<InputContactsAutofillProps, InputContactsAutofillState> {
  private blurTimeout:NodeJS.Timer;
  
  constructor(props: InputContactsAutofillProps){
    super(props);
    
    this.state = {
      autocompleteSearchItems: [],
      selectedItems: props.selectedItems || [],
      textInput: "",
      autocompleteOpened: false,
      fieldHeight: undefined,
      isFocused: this.props.autofocus === true
    }
    
    this.blurTimeout = null;
    
    this.onInputChange = this.onInputChange.bind(this);
    this.onAutocompleteItemClick = this.onAutocompleteItemClick.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  componentWillReceiveProps(nextProps: InputContactsAutofillProps){
    if (nextProps.selectedItems !== this.props.selectedItems){
      this.setState({selectedItems: nextProps.selectedItems})
    }
  }
  setHeight(){
    let fieldHeight = (this.refs["taginput"] as TagInput).getHeight();
    if (fieldHeight !== this.state.fieldHeight){
      this.setState({fieldHeight});
    }
  }
  onInputBlur(e: React.FocusEvent<any>){
    this.blurTimeout = setTimeout(()=>this.setState({isFocused: false}), 100);
  }
  onInputFocus(e: React.FocusEvent<any>){
    clearTimeout(this.blurTimeout);
    this.setState({isFocused: true});
  }
  async onInputChange(e: React.ChangeEvent<HTMLInputElement>){
    let textInput = e.target.value;
    this.setState({textInput, autocompleteOpened: true});
    
    if (textInput){
      let searchResults = await Promise.all(
        [
          checkHasPermission(this.props.hasUserPermission) ? promisify(mApi().user.users.read({
            searchString: textInput,
            onlyDefaultUsers: checkHasPermission(this.props.userPermissionIsOnlyDefaultUsers)
          }), 'callback')().then((result: any[]):any[] =>result || []).catch((err:any):any[]=>[]) : [],
          checkHasPermission(this.props.hasGroupPermission) ? promisify(mApi().usergroup.groups.read({
            searchString: textInput
          }), 'callback')().then((result: any[]) =>result || []).catch((err:any):any[]=>[]) : [],
          checkHasPermission(this.props.hasWorkspacePermission) ? promisify(mApi().coursepicker.workspaces.read({
            search: textInput,
            myWorkspaces: checkHasPermission(this.props.workspacePermissionIsOnlyMyWorkspaces),
          }), 'callback')().then((result: any[]) =>result || []).catch((err:any):any[] =>[]) : [],
          checkHasPermission(this.props.hasStaffPermission, false) ? promisify(mApi().user.staffMembers.read({
            searchString: textInput
          }), 'callback')().then((result: any[]) =>result || []).catch((err:any):any[] =>[]) : [],
        ]
      );
      
      let userItems:ContactRecepientType[] = searchResults[0].map((item: ExtendedUserType)=>({type: "user", value: item} as any as UserRecepientType));
      let userGroupItems:ContactRecepientType[] = searchResults[1].map((item: UserGroupType)=>({type: "usergroup", value: item} as any as UserGroupRecepientType));
      let workspaceItems:ContactRecepientType[] = searchResults[2].map((item: WorkspaceType)=>({type: "workspace", value: item} as any as WorkspaceRecepientType))
      let staffItems:ContactRecepientType[] = searchResults[3].map((item: UserStaffType)=>({type: "staff", value: item} as any as StaffRecepientType))
      let allItems:ContactRecepientType[]  = userItems.concat(userGroupItems).concat(workspaceItems).concat(staffItems);
      this.setState({
        autocompleteSearchItems: allItems
      });
    } else {
      this.setState({
        autocompleteSearchItems: []
      });
    }
  }
  onDelete(item: ContactRecepientType){
    clearTimeout(this.blurTimeout);
    let nfilteredValue = this.state.selectedItems.filter(selectedItem=>selectedItem.type !== item.type || selectedItem.value.id !== item.value.id);
    this.setState({
      selectedItems: nfilteredValue,
      isFocused: true
    }, this.setHeight);
    this.props.onChange(nfilteredValue);
  }
  onAutocompleteItemClick(item: ContactRecepientType, selected: boolean){
    clearTimeout(this.blurTimeout);
    if (!selected){
      let nvalue = this.state.selectedItems.concat([item]);
      this.setState({
        selectedItems: nvalue,
        autocompleteOpened: false,
        textInput: "",
        isFocused: true
      }, this.setHeight);
      this.props.onChange(nvalue);
    } else {
      this.setState({isFocused: true});
    }
  }
  render(){
    let selectedItems = this.state.selectedItems.map((item)=>{
      if (item.type === "user" || item.type === "staff"){
        return {
          node: <span className="text text--recepient-tag">
            <span className="text__icon icon-user"/>
            {
              (item.value.firstName + " " || "") + (item.value.lastName || "")
            } <i>{item.value.email}</i>
          </span>,
          value: item
        };
      } else if (item.type === "usergroup"){
        return {
          node: <span className="text text--recepient-tag">
            <span className="text__icon icon-members"/>{item.value.name}
          </span>,
          value: item
        };
      } else if (item.type === "workspace"){
        return {
          node: <span className="text text--recepient-tag">
            <span className="text__icon icon-books"/>{item.value.name}
          </span>,
          value: item
        };
      }
      
    });
    
    let autocompleteItems = this.state.autocompleteSearchItems.map((item)=>{
      let node;
      if (item.type === "user" || item.type === "staff"){
        node = <div className="text text--recepient-autocomplete">
          <span className="text__icon icon-user"></span>
          {
            filterHighlight((item.value.firstName + " " || "") + (item.value.lastName || ""), this.state.textInput)
          } {checkHasPermission(this.props.showEmails) ? <i>{item.value.email}</i> : null}
        </div>;
      } else if (item.type === "usergroup"){
        node = <div className="text text--recepient-autocomplete">
          <span className="text__icon icon-members"></span>
          {filterHighlight(item.value.name, this.state.textInput)}
        </div>;
      } else if (item.type === "workspace"){
        node = <div className="text text--recepient-autocomplete">
          <span className="text__icon icon-books"></span>
          {filterHighlight(item.value.name, this.state.textInput)}
        </div>;
      }
      return {
        value: item,
        selected: !!this.state.selectedItems.find(selectedItem=>selectedItem.type === item.type && selectedItem.value.id === item.value.id),
        node
      }
    });
    
    return <Autocomplete items={autocompleteItems} onItemClick={this.onAutocompleteItemClick}
      opened={this.state.autocompleteOpened} pixelsOffset={this.state.fieldHeight} modifier={this.props.modifier}>
      <TagInput ref="taginput" modifier={this.props.modifier}
        isFocused={this.state.isFocused} onBlur={this.onInputBlur} onFocus={this.onInputFocus}
        placeholder={this.props.placeholder}
        tags={selectedItems} onInputDataChange={this.onInputChange} inputValue={this.state.textInput} onDelete={this.onDelete}/>
    </Autocomplete>
      
  }
}