import FrontpageNavbar from "./body/navbar";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";

import FrontpageHero from "./body/header";
import FrontpageStudying from "./body/studying";
import FrontpageVideos from "./body/videos";
import FrontpageNews from "./body/news";
import FrontpageInstagram from "./body/instagram";
import FrontpageOrganization from "./body/organization";
import FrontpageFooter from "./body/footer";

import "~/sass/elements/logo.scss";
import "~/sass/elements/ordered-container.scss";
import "~/sass/elements/card.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/footer.scss";
import ScreenContainer from "~/components/general/screen-container";
import { StateType } from "~/reducers";

interface FrontpageBodyProps {
  i18n: i18nType;
}

interface FrontpageBodyState {}

class FrontpageBody extends React.Component<
  FrontpageBodyProps,
  FrontpageBodyState
> {
  render() {
    return (
      <div>
        <FrontpageNavbar />
        <FrontpageHero i18n={this.props.i18n} />
        <ScreenContainer viewModifiers="frontpage">
          <FrontpageStudying i18n={this.props.i18n} />
          <FrontpageVideos i18n={this.props.i18n} />
          <FrontpageNews i18n={this.props.i18n} />
          <FrontpageInstagram i18n={this.props.i18n} />
          <FrontpageOrganization i18n={this.props.i18n} />
        </ScreenContainer>

        <FrontpageFooter i18n={this.props.i18n} />
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(FrontpageBody);
