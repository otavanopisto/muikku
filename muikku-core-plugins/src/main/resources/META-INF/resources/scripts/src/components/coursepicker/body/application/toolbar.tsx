import * as React from "react";
import { connect, Dispatch } from "react-redux";
import * as queryString from "query-string";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wcag.scss";
import { StateType } from "~/reducers";
import {
  ApplicationPanelToolbar,
  ApplicationPanelToolbarActionsMain,
  ApplicationPanelToolsContainer,
} from "~/components/general/application-panel/application-panel";
import { WorkspacesState } from "~/reducers/workspaces";
import { SearchFormElement } from "~/components/general/form-element";
import { AnyActionType } from "~/actions";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * CoursepickerToolbarProps
 */
interface CoursepickerToolbarProps extends WithTranslation {
  workspaces: WorkspacesState;
}

/**
 * CoursepickerToolbarState
 */
interface CoursepickerToolbarState {
  searchquery: string;
  focused: boolean;
}

/**
 * CoursepickerToolbar
 */
class CoursepickerToolbar extends React.Component<
  CoursepickerToolbarProps,
  CoursepickerToolbarState
> {
  private focused: boolean;
  /**
   * constructor
   * @param props props
   */
  constructor(props: CoursepickerToolbarProps) {
    super(props);

    this.state = {
      searchquery: this.props.workspaces.activeFilters.query || "",
      focused: false,
    };

    this.updateSearchWithQuery = this.updateSearchWithQuery.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.focused = false;
  }

  /**
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: CoursepickerToolbarProps) {
    if (
      !this.focused &&
      (nextProps.workspaces.activeFilters.query || "") !==
        this.state.searchquery
    ) {
      this.setState({
        searchquery: nextProps.workspaces.activeFilters.query || "",
      });
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
   * render
   */
  render() {
    return (
      <ApplicationPanelToolbar>
        <ApplicationPanelToolbarActionsMain>
          <ApplicationPanelToolsContainer>
            <SearchFormElement
              updateField={this.updateSearchWithQuery}
              name="workspace-search"
              id="searchCourses"
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              placeholder={this.props.t("labels.search", { ns: "workspace" })}
              value={this.state.searchquery}
            />
          </ApplicationPanelToolsContainer>
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    workspaces: state.workspaces,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default withTranslation(["workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(CoursepickerToolbar)
);
