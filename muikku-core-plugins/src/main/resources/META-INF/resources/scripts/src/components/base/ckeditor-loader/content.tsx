import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import Base from "./base";

/**
 * MaterialLoaderContentProps
 */
interface CkeditorLoaderContentProps {
  html: string;
  i18n: i18nType;
}

/**
 * stopPropagation
 * @param e e
 */
function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
}

/**
 * CkeditorLoaderContent
 * @param props props
 */
function CkeditorLoaderContent(props: CkeditorLoaderContentProps) {
  return <Base html={props.html} i18n={props.i18n} usedAs="default" />;
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
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
