import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import * as queryString from 'query-string';
import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-elements.scss';
import { GuiderType } from '~/reducers/main-function/guider';
import { StateType } from '~/reducers';
import { ApplicationPanelToolbar, ApplicationPanelToolbarActionsMain, ApplicationPanelToolsContainer } from '~/components/general/application-panel/application-panel';
import { SearchFormElement } from '~/components/general/form-element';


interface GuiderToolbarProps {
  i18n: i18nType,
  guider: GuiderType
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
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
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

  render() {
    return (
      <ApplicationPanelToolbar>
        <ApplicationPanelToolbarActionsMain>
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
          </ApplicationPanelToolsContainer>
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
    )
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuiderToolbar);
