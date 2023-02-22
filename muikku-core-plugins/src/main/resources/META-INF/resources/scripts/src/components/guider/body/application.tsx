import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { i18nType } from "reducers/base/i18n";
import Students from "./application/students";
import Toolbar from "./application/toolbar";
import { StateType } from "~/reducers";
import Select from "react-select";

/**
 * GuiderApplicationProps
 */
interface GuiderApplicationProps {
  aside: JSX.Element;
  i18n: i18nType;
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
    const title = this.props.i18n.text.get("plugin.guider.guider");
    const toolbar = <Toolbar />;

    const options = [
      {
        value: "all",
        label: this.props.i18n.text.get("plugin.guider.students.all"),
      },
    ];

    const primaryOption = (
      <div className="form-element form-element--main-action">
        <label htmlFor="selectUsers" className="visually-hidden">
          {this.props.i18n.text.get("plugin.coursepicker.select.label")}
        </label>
        <Select
          id="selectUsers"
          isDisabled={true}
          options={options}
          value={options[0]}
          styles={{
            // eslint-disable-next-line jsdoc/require-jsdoc
            container: (baseStyles, state) => ({
              ...baseStyles,
              width: "100%",
            }),
          }}
        ></Select>
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
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(GuiderApplication);
