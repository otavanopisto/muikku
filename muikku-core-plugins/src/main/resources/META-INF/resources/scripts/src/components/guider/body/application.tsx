import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import Students from "./application/students";
import Notes from "./application/notes";
import StudentsToolbar from "./application/toolbar/students";
import NotesToolbar from "./application/toolbar/notes";
import { withTranslation, WithTranslation } from "react-i18next";
import Select from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import { GuiderContext, GuiderView } from "../context";

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
  view: GuiderView;
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
    this.context.setView(option.value as GuiderView);
  };

  /**
   * handleContent
   * @param content type of content
   * @returns JSX.Element
   */
  handleContent = (content: GuiderView) => {
    switch (content) {
      case "students":
        return <Students />;
      case "notes":
        return <Notes />;
      default:
        return null;
    }
  };

  /**
   * render
   */
  render() {
    const title = this.props.i18n.t("labels.guider");
    const toolbar =
      this.context.view === "students" ? <StudentsToolbar /> : <NotesToolbar />;

    const options = [
      {
        value: "students",
        label: this.props.i18n.t("labels.all", { ns: "users" }),
      },
      {
        value: "notes",
        label: this.props.i18n.t("labels.tasks", { ns: "tasks" }),
      },
    ];

    const primaryOption = (
      <div className="form-element form-element--main-action">
        <label htmlFor="selectGuiderView" className="visually-hidden">
          {this.props.i18n.t("labels.guiderViewSelect", { ns: "guider" })}
        </label>
        <Select
          className="react-select-override"
          classNamePrefix="react-select-override"
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
