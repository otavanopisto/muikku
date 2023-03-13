import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import Students from "./application/students";
import Toolbar from "./application/toolbar";
import { withTranslation, WithTranslation } from "react-i18next";
import Select from "react-select";

/**
 * GuiderApplicationProps
 */
interface GuiderApplicationProps extends WithTranslation<["common"]> {
  aside: JSX.Element;
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
   * componentDidMount
   */
  componentDidMount() {
    this.props.i18n.setDefaultNamespace("guider");
  }

  /**
   * render
   */
  render() {
    const title = this.props.i18n.t("labels.guider");
    const toolbar = <Toolbar />;

    const options = [
      {
        value: "all",
        label: this.props.i18n.t("labels.all", { ns: "users" }),
      },
    ];

    const primaryOption = (
      <div className="form-element form-element--main-action">
        <label htmlFor="selectUsers" className="visually-hidden">
          {this.props.i18n.t("labels.workspaceTypeSelect", { ns: "workspace" })}
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
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["guider", "workspace", "users"])(
  connect(null, mapDispatchToProps)(GuiderApplication)
);
