import * as React from 'react';
import Autocomplete from '~/components/general/autocomplete';
import TagInput from '~/components/general/tag-input';
import promisify from '~/util/promisify';
import {filterHighlight} from '~/util/modifiers';
import mApi from '~/lib/mApi';
import {WorkspaceType} from '~/reducers/main-function/workspaces';
import { ContactRecepientType, UserRecepientType, UserGroupRecepientType, WorkspaceRecepientType, UserWithSchoolDataType, UserGroupType, UserType, UserStaffType, StaffRecepientType } from '~/reducers/main-function/user-index';
import '~/sass/elements/autocomplete.scss';
import '~/sass/elements/glyph.scss';

export interface InputContactsAutofillLoaders {
  studentsLoader?: (searchString: string) => any,
  staffLoader?: (searchString: string) => any,
  userGroupsLoader?: (searchString: string) => any,
  workspacesLoader?: (searchString: string) => any  
}

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
  autofocus?: boolean,
  loaders?: InputContactsAutofillLoaders
}

export interface InputContactsAutofillState {
  autocompleteSearchItems: ContactRecepientType[],
  selectedItems: ContactRecepientType[],
  textInput: string,
  autocompleteOpened: boolean,

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
  private selectedHeight:number;

  constructor(props: InputContactsAutofillProps){
    super(props);
    
    this.state = {
      autocompleteSearchItems: [],
      selectedItems: props.selectedItems || [],
      textInput: "",
      autocompleteOpened: false,

      isFocused: this.props.autofocus === true
    }
    
    this.blurTimeout = null;
    this.selectedHeight= null;
    this.onInputChange = this.onInputChange.bind(this);
    this.onAutocompleteItemClick = this.onAutocompleteItemClick.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.setBodyMargin = this.setBodyMargin.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  componentWillReceiveProps(nextProps: InputContactsAutofillProps){
    if (nextProps.selectedItems !== this.props.selectedItems){
      this.setState({selectedItems: nextProps.selectedItems})
    }
  }
    
  setBodyMargin() {
    let selectedHeight = (this.refs["taginput"] as TagInput).getSelectedHeight();
    let prevSelectedHeight= this.selectedHeight;
    let currentBodyMargin = parseFloat(document.body.style.marginBottom);       
    let defaultBodyMargin = currentBodyMargin - prevSelectedHeight;
    
    if (selectedHeight !== this.selectedHeight){
      let bodyMargin = defaultBodyMargin + selectedHeight + "px";        
        document.body.style.marginBottom = bodyMargin;
        this.selectedHeight = selectedHeight;
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
      let loaders = this.props.loaders || {};
      
      let getStudentsLoader = () =>  {
        return loaders.studentsLoader ? loaders.studentsLoader(textInput) : promisify(mApi().user.users.read({
          searchString: textInput,
          onlyDefaultUsers: checkHasPermission(this.props.userPermissionIsOnlyDefaultUsers)
        }), 'callback');
      }
      let getUserGroupsLoader = () => { 
        return loaders.userGroupsLoader ? loaders.userGroupsLoader(textInput) : promisify(mApi().usergroup.groups.read({
          searchString: textInput
        }), 'callback');
      }
      let getWorkspacesLoader = () => { 
        return loaders.workspacesLoader ? loaders.workspacesLoader(textInput) : promisify(mApi().coursepicker.workspaces.read({
          searchString: textInput,
          myWorkspaces: checkHasPermission(this.props.workspacePermissionIsOnlyMyWorkspaces)
        }), 'callback');
      }
      let getStaffLoader = () => { 
        return loaders.staffLoader ? loaders.staffLoader(textInput) : promisify(mApi().user.staffMembers.read({
          searchString: textInput
        }), 'callback');
      }
      
      let searchResults = await Promise.all(
        [
          checkHasPermission(this.props.hasUserPermission) ? getStudentsLoader()().then((result: any[]):any[] =>result || []).catch((err:any):any[]=>[]) : [],
          checkHasPermission(this.props.hasGroupPermission) ? getUserGroupsLoader()().then((result: any[]) =>result || []).catch((err:any):any[]=>[]) : [],
          checkHasPermission(this.props.hasWorkspacePermission) ? getWorkspacesLoader()().then((result: any[]) =>result || []).catch((err:any):any[] =>[]) : [],
          checkHasPermission(this.props.hasStaffPermission, false) ? getStaffLoader()().then((result: any[]) =>result || []).catch((err:any):any[] =>[]) : [],
        ]
      );
      
      let userItems:ContactRecepientType[] = searchResults[0].map((item: UserType)=>({type: "user", value: item} as any as UserRecepientType));
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
    }, this.setBodyMargin
    );

    this.props.onChange(nfilteredValue);
  }
  onAutocompleteItemClick(item: ContactRecepientType, selected: boolean){
    clearTimeout(this.blurTimeout);
    this.setBodyMargin;
    if (!selected){
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
      this.setState({isFocused: true});
    }
  }
  
  componentDidMount () {
    let selectedHeight = (this.refs["taginput"] as TagInput).getSelectedHeight();
    this.selectedHeight = selectedHeight;        
  }
  
  render(){
    let selectedItems = this.state.selectedItems.map((item)=>{      
      if (item.type === "user" || item.type === "staff"){
        return {
          node: <span className="autocomplete__selected-item">
            <span className="glyph glyph--selected-recipient icon-user"/>
            {
              (item.value.firstName + " " || "") + (item.value.lastName || "")
            } {checkHasPermission(this.props.showEmails) ? <i>{item.value.email}</i> : null}
          </span>,
          value: item
        };
      } else if (item.type === "usergroup"){
        return {
          node: <span className="autocomplete__selected-item">
            <span className="glyph glyph--selected-recipient icon-members"/>{item.value.name}
          </span>,
          value: item
        };
      } else if (item.type === "workspace"){
        return {
          node: <span className="autocomplete__selected-item">
            <span className="glyph glyph--selected-recipient icon-books"/>{item.value.name}
          </span>,
          value: item
        };
      }
      
    });
    
    let autocompleteItems = this.state.autocompleteSearchItems.map((item)=>{
      let node;
      if (item.type === "user" || item.type === "staff"){
        node = <div className="autocomplete__recipient">
          <span className="glyph glyph--autocomplete-recipient icon-user"></span>
          {
            filterHighlight((item.value.firstName + " " || "") + (item.value.lastName || ""), this.state.textInput)
          } {checkHasPermission(this.props.showEmails) ? <i>{item.value.email}</i> : null}
        </div>;
      } else if (item.type === "usergroup"){
        node = <div className="autocomplete__recipient">
          <span className="glyph glyph--autocomplete-recipient icon-members"></span>
          {filterHighlight(item.value.name, this.state.textInput)}
        </div>;
      } else if (item.type === "workspace"){
        node = <div className="autocomplete__recipient">
          <span className="glyph glyph--autocomplete-recipient icon-books"></span>
          {filterHighlight(item.value.name + (item.value.nameExtension ? (" (" + item.value.nameExtension + ")") : ""), this.state.textInput)}
        </div>;
      }
      return {
        value: item,
        selected: !!this.state.selectedItems.find(selectedItem=>selectedItem.type === item.type && selectedItem.value.id === item.value.id),
        node
      }
    });
    
    return <Autocomplete items={autocompleteItems} onItemClick={this.onAutocompleteItemClick}
      opened={this.state.autocompleteOpened} modifier={this.props.modifier}>
      <TagInput ref="taginput" modifier={this.props.modifier}
        isFocused={this.state.isFocused} onBlur={this.onInputBlur} onFocus={this.onInputFocus}
        placeholder={this.props.placeholder}
        tags={selectedItems} onInputDataChange={this.onInputChange} inputValue={this.state.textInput} onDelete={this.onDelete}/>
    </Autocomplete>
      
  }
}