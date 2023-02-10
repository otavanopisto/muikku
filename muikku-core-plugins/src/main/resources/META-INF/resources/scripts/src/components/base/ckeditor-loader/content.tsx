import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18nOLD";
import Base from "./base";

/**
 * MaterialLoaderContentProps
 */
interface CkeditorLoaderContentProps {
  html: string;
  i18nOLD: i18nType;
}

/**
 * CkeditorLoaderContent
 * @param props props
 */
function CkeditorLoaderContent(props: CkeditorLoaderContentProps) {
  return <Base html={props.html} usedAs="default" />;
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @returns object
 */
function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CkeditorLoaderContent);
