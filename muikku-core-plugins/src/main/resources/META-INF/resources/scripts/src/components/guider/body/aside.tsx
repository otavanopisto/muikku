import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';
import * as queryString from 'query-string';

import '~/sass/elements/item-list.scss';
import guider, { GuiderUserLabelListType, GuiderUserLabelType, GuiderWorkspaceType, GuiderType } from '~/reducers/main-function/guider';
import LabelUpdateDialog from '../dialogs/label-update';
import { StateType } from '~/reducers';
import { ButtonPill } from '~/components/general/button';
import Navigation, { NavigationTopic, NavigationElement } from '~/components/general/navigation';
import StudyTracker from "../dialogs/study-tracker"

interface NavigationProps {
  i18n: i18nType,
  guider: GuiderType
}

interface NavigationState {

}

class NavigationAside extends React.Component<NavigationProps, NavigationState> {
  render() {
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", { arrayFormat: 'bracket' });
    return <Navigation>
      {this.props.guider.availableFilters.labels.length !== 0 ? <NavigationTopic name={this.props.i18n.text.get("plugin.guider.filters.flags")}>
        {this.props.guider.availableFilters.labels.map((label: GuiderUserLabelType) => {
          let isActive = this.props.guider.activeFilters.labelFilters.includes(label.id);
          let hash = isActive ?
            queryString.stringify(Object.assign({}, locationData, { c: "", l: (locationData.l || []).filter((i: string) => parseInt(i) !== label.id) }), { arrayFormat: 'bracket' }) :
            queryString.stringify(Object.assign({}, locationData, { c: "", l: (locationData.l || []).concat(label.id) }), { arrayFormat: 'bracket' });
          return <NavigationElement modifiers={['aside-navigation', 'aside-navigation-guider']} key={label.id} icon="flag" iconColor={label.color} isActive={isActive} hash={"?" + hash}
            editableWrapper={LabelUpdateDialog} editableWrapperArgs={{ label: label }} isEditable>{label.name}</NavigationElement>
        })}
      </NavigationTopic> : null}
      <NavigationTopic name={this.props.i18n.text.get("plugin.guider.filters.workspaces")}>
        {this.props.guider.availableFilters.workspaces.map((workspace: GuiderWorkspaceType) => {
          let isActive = this.props.guider.activeFilters.workspaceFilters.includes(workspace.id);
          let hash = isActive ?
            queryString.stringify(Object.assign({}, locationData, { c: "", w: (locationData.w || []).filter((w: string) => parseInt(w) !== workspace.id) }), { arrayFormat: 'bracket' }) :
            queryString.stringify(Object.assign({}, locationData, { c: "", w: (locationData.w || []).concat(workspace.id) }), { arrayFormat: 'bracket' });
          return <NavigationElement modifiers={['aside-navigation', 'aside-navigation-guider']} icon="books" key={workspace.id} isActive={isActive} hash={"?" + hash}>
            {workspace.name + (workspace.nameExtension ? " (" + workspace.nameExtension + ")" : "")}
          </NavigationElement>
        })}
      </NavigationTopic>
      <NavigationTopic name={"Opiskelijoiden opintojen seuranta"}>
        <StudyTracker students={this.props.guider && this.props.guider.students}><NavigationElement modifiers={['aside-navigation', 'aside-navigation-guider']} icon="books" isActive={false}>
          Avaja dialogi
        </NavigationElement>
        </StudyTracker>

      </NavigationTopic>
    </Navigation >
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
)(NavigationAside);
