import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import Students from "./application/students";
import Toolbar from "./application/toolbar";
import { withTranslation, WithTranslation } from "react-i18next";
import Select from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import { GuiderContext, GuiderViews } from "../context";

/**
 * GuiderApplicationProps
 */
interface GuiderApplicationProps extends WithTranslation<["common"]> {
  aside: JSX.Element;
}

/**
 * GuiderApplicationState
 */
interface GuiderApplicationState {
  view: GuiderViews;
}

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

    this.state = {
      view: this.context,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.props.i18n.setDefaultNamespace("guider");

    this.handleContent(this.context.view);
  }

  /**
   * Handles select change
   * @param option Select  option
   */
  handleSelectChange = (option: OptionDefault<string>) => {
    this.context.setView(option.value as GuiderViews);
  };

  /**
   * handleContent
   * @param content type of content
   * @returns JSX.Element
   */
  handleContent = (content: GuiderViews) => {
    switch (content) {
      case "students":
        return <Students />;
      case "tasks":
        return null;
      default:
        return null;
    }
  };

  /**
   * render
   */
  render() {
    const title = this.props.i18n.t("labels.guider");
    const toolbar = <Toolbar />;

    const options = [
      {
        value: "students",
        label: this.props.i18n.t("labels.all", { ns: "users" }),
      },
      {
        value: "tasks",
        label: this.props.i18n.t("labels.tasks", { ns: "tasks" }),
      },
    ];

    const primaryOption = (
      <div className="form-element form-element--main-action">
        <label htmlFor="selectUsers" className="visually-hidden">
          {this.props.i18n.t("labels.workspaceTypeSelect", { ns: "workspace" })}
        </label>
        <Select
          id="selectUsers"
          options={options}
          value={options.find((option) => option.value === this.context.view)}
          onChange={this.handleSelectChange}
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
        {this.handleContent(this.context.view)}
      </ApplicationPanel>
    );
  }
}

GuiderApplication.contextType = GuiderContext;

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["guider", "workspace", "users"])(
  connect(null, mapDispatchToProps)(GuiderApplication)
);
