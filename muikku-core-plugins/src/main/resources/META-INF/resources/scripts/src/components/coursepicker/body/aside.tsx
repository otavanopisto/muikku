import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';
import * as queryString from 'query-string';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { CoursesType, CourseEducationFilterType, CourseCurriculumFilterType, CourseOrganizationFilterType } from '~/reducers/main-function/courses';
import { StateType } from '~/reducers';
import Navigation, { NavigationTopic, NavigationElement } from '~/components/general/navigation';

interface NavigationAsideProps {
  i18n: i18nType,
  courses: CoursesType
}

interface NavigationAsideState {
}

class NavigationAside extends React.Component<NavigationAsideProps, NavigationAsideState> {
  render() {
    let locationData = queryString.parse( document.location.hash.split( "?" )[1] || "", { arrayFormat: 'bracket' } );

    return <Navigation>
      <NavigationTopic name={this.props.i18n.text.get('plugin.coursepicker.filters.title')}>
        {this.props.courses.availableFilters.educationTypes.map( ( educationType: CourseEducationFilterType ) => {
          let isActive = this.props.courses.activeFilters.educationFilters.includes( educationType.identifier );
          let hash = "?" + ( isActive ?
            queryString.stringify( Object.assign( {}, locationData, { e: ( locationData.e || [] ).filter( ( i: string ) => i !== educationType.identifier ) } ), { arrayFormat: 'bracket' } ) :
            queryString.stringify( Object.assign( {}, locationData, { e: ( locationData.e || [] ).concat( educationType.identifier ) } ), { arrayFormat: 'bracket' } ) )
          return <NavigationElement key={educationType.identifier} isActive={isActive} hash={hash}>{educationType.name}</NavigationElement>
        })}
      </NavigationTopic>
      <NavigationTopic name={this.props.i18n.text.get('plugin.coursepicker.filters.curriculum')}>
        {this.props.courses.availableFilters.curriculums.map( ( curriculum: CourseCurriculumFilterType ) => {
          let isActive = this.props.courses.activeFilters.curriculumFilters.includes( curriculum.identifier );
          let hash = "?" + ( isActive ?
            queryString.stringify( Object.assign( {}, locationData, { c: ( locationData.c || [] ).filter( ( c: string ) => c !== curriculum.identifier ) } ), { arrayFormat: 'bracket' } ) :
            queryString.stringify( Object.assign( {}, locationData, { c: ( locationData.c || [] ).concat( curriculum.identifier ) } ), { arrayFormat: 'bracket' } ) );
          return <NavigationElement key={curriculum.identifier} isActive={isActive} hash={hash}>{curriculum.name}</NavigationElement>
        } )}
      </NavigationTopic>
      <NavigationTopic name={this.props.i18n.text.get('plugin.coursepicker.filters.organization')}>
        {this.props.courses.availableFilters.organizations.map( ( organization: CourseOrganizationFilterType ) => {
          let isActive = this.props.courses.activeFilters.organizationFilters.includes( organization.identifier );
          let hash = "?" + ( isActive ?
            queryString.stringify( Object.assign( {}, locationData, { o: ( locationData.o || [] ).filter( ( o: string ) => o !== organization.identifier ) } ), { arrayFormat: 'bracket' } ) :
            queryString.stringify( Object.assign( {}, locationData, { o: ( locationData.o || [] ).concat( organization.identifier ) } ), { arrayFormat: 'bracket' } ) );
          return <NavigationElement key={organization.identifier} isActive={isActive} hash={hash}>{organization.name}</NavigationElement>
        } )}
      </NavigationTopic>
    </Navigation>
  }
}

function mapStateToProps( state: StateType ) {
  return {
    i18n: state.i18n,
    courses: state.courses
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( NavigationAside );