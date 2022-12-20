import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { i18nType } from "reducers/base/i18nOLD";
import Students from "./application/students";
import Toolbar from "./application/toolbar";
import { StateType } from "~/reducers";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * GuiderApplicationProps
 */
interface GuiderApplicationProps extends WithTranslation<["common"]> {
  aside: JSX.Element;
  i18nOLD: i18nType;
}

/**
 * GuiderApplicationState
 */
interface GuiderApplicationState {}

/**
 * GuiderApplication
 */
class GuiderApplication extends React.Component<
  GuiderApplicationProps,
  GuiderApplicationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: GuiderApplicationProps) {
    super(props);
  }

  /**
   * render
   */
  render() {
    const title = this.props.i18nOLD.text.get("plugin.guider.guider");
    const toolbar = <Toolbar />;
    const primaryOption = (
      <div className="form-element form-element--main-action">
        <label htmlFor="selectUsers" className="visually-hidden">
          {this.props.i18nOLD.text.get("plugin.coursepicker.select.label")}
        </label>
        <select
          id="selectUsers"
          className="form-element__select form-element__select--main-action"
          disabled
        >
          <option>
            {this.props.i18nOLD.text.get("plugin.guider.students.all")}
          </option>
        </select>
      </div>
    );
    return (
      <ApplicationPanel
        primaryOption={primaryOption}
        toolbar={toolbar}
        title={title}
        asideBefore={this.props.aside}
      >
        <Students />
      </ApplicationPanel>
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

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(GuiderApplication)
);
