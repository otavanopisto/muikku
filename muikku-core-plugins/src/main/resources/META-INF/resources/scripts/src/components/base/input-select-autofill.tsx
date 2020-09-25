import * as React from 'react';
import Autocomplete from '~/components/general/autocomplete';
import TagInput from '~/components/general/tag-input';
import { filterHighlight, getName } from '~/util/modifiers';
import { WorkspaceType } from '~/reducers/workspaces';
import { UserWithSchoolDataType, UserGroupType, UserType, UserStaffType } from '~/reducers/user-index';
import '~/sass/elements/autocomplete.scss';
import '~/sass/elements/glyph.scss';


export interface SelectItem {
  id: number,
  label: string
}

export interface AutofillLoaders {
  [index: string]: (searchString: string) => any;
}

export interface AutofillSelectorProps {
  placeholder?: string,
  modifier: string,
  searchItems: SelectItem[],
  selectedItems: SelectItem[],
  showFullNames: boolean,
  showEmails?: boolean,
  autofocus?: boolean,
  onDelete: (select: SelectItem) => any,
  onSelect: (select: SelectItem) => any,
  loader?: (searchString: string) => any
}

export interface AutofillSelectorState {
  searchItems: SelectItem[],
  selectedItems: SelectItem[],
  textInput: string,
  autocompleteOpened: boolean,
  isFocused: boolean
}

export default class AutofillSelector extends React.Component<AutofillSelectorProps, AutofillSelectorState> {
  private blurTimeout: NodeJS.Timer;
  private selectedHeight: number;
  private activeSearchId: number;
  private activeSearchTimeout: NodeJS.Timer;

  constructor(props: AutofillSelectorProps) {
    super(props);

    this.state = {
      searchItems: [],
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

    this.activeSearchId = null;
    this.activeSearchTimeout = null;
  }
  componentWillReceiveProps(nextProps: AutofillSelectorProps) {
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
    this.blurTimeout = setTimeout(() => this.setState({ isFocused: false }), 100);
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
      this.props.loader(textInput);
      this.setState({
        searchItems: this.props.searchItems
      });
    } else {
      this.setState({
        searchItems: []
      });
    }
  }

  autocompleteDataFromServer(textInput: string) {
    let searchId = (new Date()).getTime();
    this.activeSearchId = searchId;
  }

  onAutocompleteItemClick(item: SelectItem, selected: boolean) {
    if (!selected) {
      this.props.onSelect(item);
    }
  }

  componentDidMount() {
    let selectedHeight = (this.refs["taginput"] as TagInput).getSelectedHeight();
    this.selectedHeight = selectedHeight;
  }

  render() {
    let selectedItems = this.props.selectedItems.map((item) => {
      return {
        node: <span className="autocomplete__selected-item">
          <span className="glyph glyph--selected-recipient icon-user" />
          {
            item.label
          }
        </span>,
        value: item
      };
    });

    let autocompleteItems = this.state.searchItems.map((item) => {
      let node = <div className="autocomplete__recipient">
        <span className="glyph glyph--autocomplete-recipient icon-user"></span>
        {
          filterHighlight(item.label, this.state.textInput)
        }
      </div>;

      return {
        value: item,
        selected: !!this.state.selectedItems.find(selectedItem => selectedItem.id === item.id),
        node
      }
    });

    return <Autocomplete items={autocompleteItems} onItemClick={this.onAutocompleteItemClick}
      opened={this.state.autocompleteOpened} modifier={this.props.modifier}>
      <TagInput ref="taginput" modifier={this.props.modifier}
        isFocused={this.state.isFocused} onBlur={this.onInputBlur} onFocus={this.onInputFocus}
        placeholder={this.props.placeholder}
        tags={selectedItems} onInputDataChange={this.onInputChange} inputValue={this.state.textInput} onDelete={this.props.onDelete} />
    </Autocomplete>
  }
}
