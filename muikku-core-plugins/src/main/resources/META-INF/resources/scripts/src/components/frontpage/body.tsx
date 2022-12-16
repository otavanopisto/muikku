import FrontpageNavbar from "./body/navbar";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";

import FrontpageHero from "./body/header";
import FrontpageStudying from "./body/studying";
import FrontpageVideos from "./body/videos";
import FrontpageNews from "./body/news";
import FrontpageInstagram from "./body/instagram";
import FrontpageOrganization from "./body/organization";
import FrontpageFooter from "./body/footer";

import "~/sass/elements/label.scss";
import "~/sass/elements/link.scss";
import "~/sass/elements/hero.scss";
import "~/sass/elements/bubble.scss";
import "~/sass/elements/logo.scss";
import "~/sass/elements/ordered-container.scss";
import "~/sass/elements/card.scss";
import "~/sass/elements/wcag.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/footer.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/screen-container.scss";

import ScreenContainer from "~/components/general/screen-container";
import { StateType } from "~/reducers";

/**
 * FrontpageBodyProps
 */
interface FrontpageBodyProps {
  i18nOLD: i18nType;
}

/**
 * FrontpageBodyState
 */
interface FrontpageBodyState {}

/**
 * FrontpageBody
 */
class FrontpageBody extends React.Component<
  FrontpageBodyProps,
  FrontpageBodyState
> {
  /**
   * render
   */
  render() {
    return (
      <div>
        <FrontpageNavbar />
        <FrontpageHero i18nOLD={this.props.i18nOLD} />
        <ScreenContainer viewModifiers="frontpage">
          <FrontpageStudying i18nOLD={this.props.i18nOLD} />
          <FrontpageVideos i18nOLD={this.props.i18nOLD} />
          <FrontpageNews i18nOLD={this.props.i18nOLD} />
          <FrontpageInstagram i18nOLD={this.props.i18nOLD} />
          <FrontpageOrganization i18nOLD={this.props.i18nOLD} />
        </ScreenContainer>

        <FrontpageFooter i18nOLD={this.props.i18nOLD} />
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(FrontpageBody);
