import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';
import * as queryString from 'query-string';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { CoursesType, CourseEducationFilterType, CourseCurriculumFilterType } from '~/reducers/main-function/courses';
import { StateType } from '~/reducers';
import Navigation, { NavigationTopic, NavigationElement } from '~/components/general/navigation';

interface NavigationAsideProps {
  i18n: i18nType,
  courses: CoursesType
}

interface NavigationAsideState {
}

class WorkspacesAside extends React.Component<NavigationAsideProps, NavigationAsideState> {
  render() {
    let locationData = queryString.parse( document.location.hash.split( "?" )[1] || "", { arrayFormat: 'bracket' } );
    return <Navigation></Navigation>
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
)( WorkspacesAside );