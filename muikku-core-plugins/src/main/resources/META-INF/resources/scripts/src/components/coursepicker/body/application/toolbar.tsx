import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import * as queryString from 'query-string';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/wcag.scss';
import { StateType } from '~/reducers';
import { ApplicationPanelToolbar, ApplicationPanelToolbarActionsMain } from '~/components/general/application-panel';
import { WorkspacesType } from '~/reducers/workspaces';
import { SearchFormElement } from '~/components/general/form-element';

interface CoursepickerToolbarProps {
  i18n: i18nType,
  workspaces: WorkspacesType
}

interface CoursepickerToolbarState {
  searchquery: string,
  focused: boolean

}

class CoursepickerToolbar extends React.Component<CoursepickerToolbarProps, CoursepickerToolbarState> {
  private searchTimer: NodeJS.Timer;
  private focused: boolean;
  constructor(props: CoursepickerToolbarProps) {
    super(props);

    this.state = {
      searchquery: this.props.workspaces.activeFilters.query || "",
      focused: false,
    }

    this.updateSearchWithQuery = this.updateSearchWithQuery.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.searchTimer = null;
    this.focused = false;
  }

  updateSearchWithQuery(query: string) {
    clearTimeout(this.searchTimer);
    this.setState({
      searchquery: query
    });
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", { arrayFormat: 'bracket' });
    locationData.q = query;
    this.searchTimer = setTimeout(window.location.hash = "#?" + queryString.stringify(locationData, { arrayFormat: 'bracket' }), 400) as any;
  }

  componentWillReceiveProps(nextProps: CoursepickerToolbarProps) {
    if (!this.focused && (nextProps.workspaces.activeFilters.query || "") !== this.state.searchquery) {
      this.setState({
        searchquery: nextProps.workspaces.activeFilters.query || ""
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
          <SearchFormElement
            updateField={this.updateSearchWithQuery}
            name="workspace-search"
            id="searchCourses"
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
            placeholder={this.props.i18n.text.get('plugin.coursepicker.search.placeholder')}
            value={this.state.searchquery}
          />
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
    )
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspaces: state.workspaces
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursepickerToolbar);
