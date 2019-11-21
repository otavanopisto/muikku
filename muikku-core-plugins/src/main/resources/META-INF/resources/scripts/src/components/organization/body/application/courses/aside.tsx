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

class CoursesAside extends React.Component<NavigationAsideProps, NavigationAsideState> {
  render() {
    let locationData = queryString.parse( document.location.hash.split( "?" )[1] || "", { arrayFormat: 'bracket' } );

    return <Navigation>
      <NavigationTopic name={this.props.i18n.text.get('plugin.coursepicker.filters.title')}>
        <NavigationElement key="11" isActive={true} hash="#muu">Dyyppi</NavigationElement>
      </NavigationTopic>
      <NavigationTopic name={this.props.i18n.text.get('plugin.coursepicker.filters.curriculum')}>
        <NavigationElement key="21" isActive={false} hash="#juu">Diippi</NavigationElement>
        <NavigationElement key="22" isActive={false} hash="#juu">Diippi</NavigationElement>
        <NavigationElement key="23" isActive={false} hash="#juu">Diippi</NavigationElement>
        <NavigationElement key="24" isActive={false} hash="#juu">Diippi</NavigationElement>
        <NavigationElement key="25" isActive={false} hash="#juu">Diippi</NavigationElement>
      </NavigationTopic>
       <NavigationTopic name={this.props.i18n.text.get('plugin.coursepicker.filters.curriculum')}>
        <NavigationElement key="31" isActive={false} hash="#juu">Diippi</NavigationElement>
        <NavigationElement key="32" isActive={false} hash="#juu">Diippi</NavigationElement>
        <NavigationElement key="33" isActive={false} hash="#juu">Diippi</NavigationElement>
        <NavigationElement key="34" isActive={false} hash="#juu">Diippi</NavigationElement>
        <NavigationElement key="35" isActive={false} hash="#juu">Diippi</NavigationElement>
        <NavigationElement key="36" isActive={false} hash="#juu">Diippi</NavigationElement>

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
)( CoursesAside );