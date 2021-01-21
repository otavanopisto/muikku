import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';
import * as queryString from 'query-string';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { WorkspacesType, WorkspaceEducationFilterType, WorkspaceCurriculumFilterType } from '~/reducers/workspaces';
import { StateType } from '~/reducers';
import Navigation, { NavigationTopic, NavigationElement } from '~/components/general/navigation';

interface NavigationAsideProps {
  i18n: i18nType,
  workspaces: WorkspacesType
}

interface NavigationAsideState {
  published: boolean;
  unpublished: boolean;
  active: boolean;
}

class WorkspacesAside extends React.Component<NavigationAsideProps, NavigationAsideState> {

  constructor(props: NavigationAsideProps) {
    super(props);
    this.state = {
      published: false,
      unpublished: false,
      active: false
    }
  }

  render() {
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", { arrayFormat: 'bracket' });
    // Moc data because the backend lacks this

    let active = [
      {
        name: "active",
        label: "plugin.organization.filters.state.active.true"
      },
      {
        name: "inactive",
        label: "plugin.organization.filters.state.active.false"
      }
    ];


    //   <NavigationTopic name={this.props.i18n.text.get('plugin.organization.filters.published.title')}>
    //   {this.props.workspaces.availableFilters.stateFilters.map((state) => {
    //     let isActive = this.props.workspaces.activeFilters.curriculumFilters.includes(state.identifier);
    //     let hash = "?" + (isActive ?
    //       queryString.stringify(Object.assign({}, locationData, { p: (locationData.p || []).filter((i: string) => i !== state.identifier) }), { arrayFormat: 'bracket' }) :
    //       queryString.stringify(Object.assign({}, locationData, { p: (locationData.p || []).concat(state.name) }), { arrayFormat: 'bracket' }));
    //     return <NavigationElement key={state.name} isActive={isActive} hash={hash}>{state.name}</NavigationElement>
    //   })}
    // </NavigationTopic>

    //    These are waiting for backend works
    //

    //  <NavigationTopic name={this.props.i18n.text.get('plugin.organization.filters.state.title')}>
    //    {active.map( ( element ) => {
    //      let isActive = this.state.active;
    //      let hash = "?" + ( isActive ?
    //        queryString.stringify( Object.assign( {}, locationData, { s: ( locationData.e || [] ).filter( ( i: string ) => i !== element.name ) } ), { arrayFormat: 'bracket' } ) :
    //        queryString.stringify( Object.assign( {}, locationData, { s: ( locationData.e || [] ).concat(element.name ) } ), { arrayFormat: 'bracket' } ) )
    //      return <NavigationElement key={element.name} isActive={isActive} hash={hash}>{this.props.i18n.text.get(element.label)}</NavigationElement>
    //    })}
    //  </NavigationTopic>

    return <Navigation>
      <NavigationTopic name={this.props.i18n.text.get('plugin.coursepicker.filters.title')}>
        {this.props.workspaces.availableFilters.educationTypes.map((educationType: WorkspaceEducationFilterType) => {
          let isActive = this.props.workspaces.activeFilters.educationFilters.includes(educationType.identifier);
          let hash = "?" + (isActive ?
            queryString.stringify(Object.assign({}, locationData, { e: (locationData.e || []).filter((i: string) => i !== educationType.identifier) }), { arrayFormat: 'bracket' }) :
            queryString.stringify(Object.assign({}, locationData, { e: (locationData.e || []).concat(educationType.identifier) }), { arrayFormat: 'bracket' }))
          return <NavigationElement key={educationType.identifier} isActive={isActive} hash={hash}>{educationType.name}</NavigationElement>
        })}
      </NavigationTopic>
      <NavigationTopic name={this.props.i18n.text.get('plugin.coursepicker.filters.curriculum')}>
        {this.props.workspaces.availableFilters.curriculums.map((curriculum: WorkspaceCurriculumFilterType) => {
          let isActive = this.props.workspaces.activeFilters.curriculumFilters.includes(curriculum.identifier);
          let hash = "?" + (isActive ?
            queryString.stringify(Object.assign({}, locationData, { c: (locationData.c || []).filter((c: string) => c !== curriculum.identifier) }), { arrayFormat: 'bracket' }) :
            queryString.stringify(Object.assign({}, locationData, { c: (locationData.c || []).concat(curriculum.identifier) }), { arrayFormat: 'bracket' }));
          return <NavigationElement key={curriculum.identifier} isActive={isActive} hash={hash}>{curriculum.name}</NavigationElement>
        })}
      </NavigationTopic>
      <NavigationTopic name={this.props.i18n.text.get('plugin.organization.filters.published.title')}>
        {this.props.workspaces.availableFilters.stateFilters.map((stateFilter) => {
          let isActive = this.props.workspaces.activeFilters.stateFilters.includes(stateFilter.identifier);
          let hash = "?" + (isActive ?
            queryString.stringify(Object.assign({}, locationData, { p: (locationData.p || []).filter((i: string) => i !== stateFilter.identifier) }), { arrayFormat: 'bracket' }) :
            queryString.stringify(Object.assign({}, locationData, { p: (locationData.p || []).concat(stateFilter.identifier) }), { arrayFormat: 'bracket' }));
          return <NavigationElement key={stateFilter.name} isActive={isActive} hash={hash}>{stateFilter.name}</NavigationElement>
        })}
      </NavigationTopic>

    </Navigation>
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspaces: state.organizationWorkspaces
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspacesAside);
