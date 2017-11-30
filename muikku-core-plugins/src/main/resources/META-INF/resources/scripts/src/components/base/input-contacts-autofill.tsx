import * as React from 'react';
import Autocomplete from '~/components/general/autocomplete';
import TagInput from '~/components/general/tag-input';
import promisify from '~/util/promisify';
import {filterHighlight} from '~/util/modifiers';
import mApi from '~/lib/mApi';
import {CommunicatorMessageItemRecepientType} from '~/reducers/main-function/communicator/communicator-messages';
import {WorkspaceType} from '~/reducers/main-function/index/workspaces';
import { UserRecepientType, UserGroupRecepientType, WorkspaceRecepientType } from '~/reducers/main-function/user-index';

export interface InputContactsAutofillProps {
  placeholder?: string,
  onChange: (newValue: CommunicatorMessageItemRecepientType[])=>any,
  modifier: string,
  selectedItems: CommunicatorMessageItemRecepientType[],
  hasGroupMessagingPermission?: boolean,
  hasUserMessagingPermission?: boolean,
  hasWorkspaceMessagingPermission?: boolean,
  autofocus?: boolean
}

export interface InputContactsAutofillState {
  autocompleteSearchItems: CommunicatorMessageItemRecepientType[],
  selectedItems: CommunicatorMessageItemRecepientType[],
  textInput: string,
  autocompleteOpened: boolean,
  fieldHeight?: number,
  isFocused: boolean
}

function checkHasPermission(which: boolean){
  return (which === true || typeof which === "undefined");
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
          checkHasPermission(this.props.hasUserMessagingPermission) ? promisify(mApi().user.users.read({
            searchString: textInput,
            onlyDefaultUsers: true
          }), 'callback')().then((result: any[]):any[] =>result || []).catch((err:any):any[]=>[]) : [],
          checkHasPermission(this.props.hasGroupMessagingPermission) ? promisify(mApi().usergroup.groups.read({
            searchString: textInput
          }), 'callback')().then((result: any[]) =>result || []).catch((err:any):any[]=>[]) : [],
          checkHasPermission(this.props.hasWorkspaceMessagingPermission) ? promisify(mApi().coursepicker.workspaces.read({
            search: textInput,
            myWorkspaces: true,
          }), 'callback')().then((result: any[]) =>result || []).catch((err:any):any[] =>[]) : [],
        ]
      );
      
      //TODO fix anies
      
      let userItems:CommunicatorMessageItemRecepientType[] = (searchResults[0] as any[]).map((item: any)=>({type: "user", value: item} as UserRecepientType));
      let userGroupItems:CommunicatorMessageItemRecepientType[] = (searchResults[1] as any[]).map((item: any)=>({type: "usergroup", value: item} as UserGroupRecepientType));
      let workspaceItems:CommunicatorMessageItemRecepientType[] = (searchResults[2] as WorkspaceType[]).map((item: WorkspaceType)=>({type: "workspace", value: item} as WorkspaceRecepientType))
      let allItems:CommunicatorMessageItemRecepientType[]  = userItems.concat(userGroupItems).concat(workspaceItems);
      this.setState({
        autocompleteSearchItems: allItems
      });
    } else {
      this.setState({
        autocompleteSearchItems: []
      });
    }
  }
  onDelete(item: CommunicatorMessageItemRecepientType){
    clearTimeout(this.blurTimeout);
    this.setState({
      selectedItems: this.state.selectedItems.filter(selectedItem=>selectedItem.type !== item.type || selectedItem.value.id !== item.value.id),
      isFocused: true
    }, this.setHeight);
  }
  onAutocompleteItemClick(item: CommunicatorMessageItemRecepientType, selected: boolean){
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
      if (item.type === "user"){
        return {
          node: <span className="text text--recepient-tag">
            <span className="icon icon-user"/>
            {
              (item.value.firstName + " " || "") + (item.value.lastName || "")
            } <i>{item.value.email}</i>
          </span>,
          value: item
        };
      } else if (item.type === "usergroup"){
        return {
          node: <span className="text text--recepient-tag">
            <span className="icon icon-members"/>{item.value.name}
          </span>,
          value: item
        };
      } else {
        return {
          node: <span className="text text--recepient-tag">
            <span className="icon icon-books"/>{item.value.name}
          </span>,
          value: item
        };
      }
      
    });
    
    let autocompleteItems = this.state.autocompleteSearchItems.map((item)=>{
      let node;
      if (item.type === "user"){
        node = <div className="text text--recepient-autocomplete">
          <span className="icon icon-user"></span>
          {
            filterHighlight((item.value.firstName + " " || "") + (item.value.lastName || ""), this.state.textInput)
          } <i>{item.value.email}</i>
        </div>;
      } else if (item.type === "usergroup"){
        node = <div className="text text--recepient-autocomplete">
          <span className="icon icon-members"></span>
          {filterHighlight(item.value.name, this.state.textInput)}
        </div>;
      } else {
        node = <div className="text text--recepient-autocomplete">
          <span className="icon icon-books"></span>
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