import FrontpageNavbar from './body/navbar';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import $ from '~/lib/jquery';

import Header from './body/header';
import Studying from './body/studying';
import Videos from './body/videos';
import News from './body/news';
import InstragramGallery from './body/instagram';
import Organization from './body/organization';
import Footer from './body/footer';

import '~/sass/elements/logo.scss';
import '~/sass/elements/ordered-container.scss';
import '~/sass/elements/card.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/footer.scss';
import ScreenContainer from '~/components/general/screen-container';
import {StateType} from '~/reducers';

interface FrontpageBodyProps {
  i18n: i18nType
}

interface FrontpageBodyState {

}

class FrontpageBody extends React.Component<FrontpageBodyProps, FrontpageBodyState> {
  render(){
    return (<div>
      <FrontpageNavbar />
      <Header i18n={this.props.i18n}/>
      <ScreenContainer fullHeight={false}>
        <Studying i18n={this.props.i18n}/>
        <Videos/>
        <News i18n={this.props.i18n}/>
        <InstragramGallery i18n={this.props.i18n}/>
        <Organization i18n={this.props.i18n}/>
      </ScreenContainer>

      <Footer i18n={this.props.i18n}/>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontpageBody);