import * as React from 'react';
import * as PropTypes from 'prop-types';
import Autocomplete from '~/components/general/autocomplete.tsx';
import TagInput from '~/components/general/tag-input.tsx';
import promisify from '~/util/promisify';
import {filterHighlight} from '~/util/modifiers';

export default class InputContactsAutofill extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(["workspace", "user", "usergroup"]).isRequired,
      value: PropTypes.any.isRequired
    })).isRequired,
    classNameExtension: PropTypes.string.isRequired,
    classNameSuffix: PropTypes.string.isRequired,
    hasGroupMessagingPermission: PropTypes.bool.isRequired,
    autofocus: PropTypes.bool
  }
  constructor(props){
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
  componentWillReceiveProps(nextProps){
    if (nextProps.selectedItems !== this.props.selectedItems){
      this.setState({selectedItems: nextProps.selectedItems})
    }
  }
  setHeight(){
    let fieldHeight = this.refs.taginput.getHeight();
    if (fieldHeight !== this.state.fieldHeight){
      this.setState({fieldHeight});
    }
  }
  onInputBlur(e){
    this.blurTimeout = setTimeout(()=>this.setState({isFocused: false}), 100);
  }
  onInputFocus(e){
    clearTimeout(this.blurTimeout);
    this.setState({isFocused: true});
  }
  async onInputChange(e){
    let textInput = e.target.value;
    this.setState({textInput, autocompleteOpened: true});
    
    if (textInput){
      let searchResults = await Promise.all(
        [
          promisify(mApi().user.users.read({
            searchString: textInput,
            onlyDefaultUsers: true
          }), 'callback')().then(result=>result || []).catch((err)=>[]),
          this.props.hasGroupMessagingPermission ? promisify(mApi().usergroup.groups.read({
            searchString: textInput
          }), 'callback')().then(result=>result || []).catch((err)=>[]) : [],
          promisify(mApi().coursepicker.workspaces.read({
            search: textInput,
            myWorkspaces: true,
          }), 'callback')().then(result=>result || []).catch((err)=>[]),
        ]
      );
      
      let allItems = searchResults[0].map(item=>({type: "user", value: item}))
        .concat(searchResults[1].map(item=>({type: "usergroup", value: item})))
        .concat(searchResults[2].map(item=>({type: "workspace", value: item})));
      this.setState({
        autocompleteSearchItems: allItems
      });
    } else {
      this.setState({
        autocompleteSearchItems: []
      });
    }
  }
  onDelete(item){
    clearTimeout(this.blurTimeout);
    this.setState({
      selectedItems: this.state.selectedItems.filter(selectedItem=>selectedItem.type !== item.type || selectedItem.value.id !== item.value.id),
      isFocused: true
    }, this.setHeight);
  }
  onAutocompleteItemClick(item, selected){
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
  componentWillReceiveProps(nextProps){
    if (nextProps.selectedItems){
      this.setState({selectedItems: nextProps.selectedItems});
    }
  }
  render(){
    let selectedItems = this.state.selectedItems.map((item)=>{
      if (item.type === "user"){
        return {
          node: <span className={`${this.props.classNameExtension} text ${this.props.classNameExtension}-text-new-message-recepient-tag`}>
            <span className="icon icon-user"/>
            {
              (item.value.firstName + " " || "") + (item.value.lastName || "")
            } <i>{item.value.email}</i>
          </span>,
          value: item
        };
      } else if (item.type === "usergroup"){
        return {
          node: <span className={`${this.props.classNameExtension} text ${this.props.classNameExtension}-text-new-message-recepient-tag`}>
            <span className="icon icon-members"/>{item.value.name}
          </span>,
          value: item
        };
      } else {
        return {
          node: <span className={`${this.props.classNameExtension} text ${this.props.classNameExtension}-text-new-message-recepient-tag`}>
            <span className="icon icon-books"/>{item.value.name}
          </span>,
          value: item
        };
      }
      
    });
    
    let autocompleteItems = this.state.autocompleteSearchItems.map((item)=>{
      let node;
      if (item.type === "user"){
        node = <div className={`${this.props.classNameExtension} text ${this.props.classNameExtension}-text-new-message-recepient-autocomplete`}>
          <span className="icon icon-user"></span>
          {
            filterHighlight((item.value.firstName + " " || "") + (item.value.lastName || ""), this.state.textInput)
          } <i>{item.value.email}</i>
        </div>;
      } else if (item.type === "usergroup"){
        node = <div className={`${this.props.classNameExtension} text ${this.props.classNameExtension}-text-new-message-recepient-autocomplete`}>
          <span className="icon icon-members"></span>
          {filterHighlight(item.value.name, this.state.textInput)}
        </div>;
      } else {
        node = <div className={`${this.props.classNameExtension} text ${this.props.classNameExtension}-text-new-message-recepient-autocomplete`}>
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
      opened={this.state.autocompleteOpened} pixelsOffset={this.state.fieldHeight} classNameExtension={this.props.classNameExtension}
      classNameSuffix={this.props.classNameSuffix}>
      <TagInput ref="taginput" classNameExtension={this.props.classNameExtension} classNameSuffix={this.props.classNameSuffix}
        isFocused={this.state.isFocused} onBlur={this.onInputBlur} onFocus={this.onInputFocus}
        placeholder={this.props.placeholder} onItemClick={this.props.onAutocompleteItemClick} items={autocompleteItems}
        tags={selectedItems} onInputDataChange={this.onInputChange} inputValue={this.state.textInput} onDelete={this.onDelete}/>
    </Autocomplete>
      
  }
}