import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { TranscriptOfRecordLocationType } from "~/reducers/main-function/records";
import { StateType } from "~/reducers";
import "~/sass/elements/form-elements.scss";

/**
 * StudiesPrimaryOptionProps
 */
interface StudiesPrimaryOptionProps {
  i18n: i18nType;
  location: TranscriptOfRecordLocationType;
  isHopsEnabled: boolean;
}

/**
 * StudiesPrimaryOptionState
 */
interface StudiesPrimaryOptionState {}

/**
 * StudiesPrimaryOption
 */
class StudiesPrimaryOption extends React.Component<
  StudiesPrimaryOptionProps,
  StudiesPrimaryOptionState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: StudiesPrimaryOptionProps) {
    super(props);

    this.onSelectChange = this.onSelectChange.bind(this);
  }

  /**
   * onSelectChange
   * @param e e
   */
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    window.location.hash = "#" + e.target.value;
  }

  /**
   * render
   */
  render() {
    const sections = [
      {
        name: this.props.i18n.text.get("plugin.records.category.records"),
        hash: "",
        enabled: true,
      },
      {
        name: this.props.i18n.text.get("plugin.records.category.hops"),
        hash: "hops",
        enabled: this.props.isHopsEnabled,
      },
      {
        name: this.props.i18n.text.get("plugin.records.category.vops"),
        hash: "vops",
        enabled: this.props.isHopsEnabled,
      },
    ];
    return (
      <div className="application-panel__toolbar">
        <div className="form-element form-element--studies-toolbar">
          <select
            className="form-element__select form-element__select--main-action"
            onChange={this.onSelectChange}
            value={this.props.location || ""}
          >
            {sections.map((section, index) => {
              if (!section.enabled) {
                return null;
              }
              return (
                <option key={index} value={section.hash}>
                  {section.name}
                </option>
              );
            })}
          </select>
        </div>
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
    i18n: state.i18n,
    location: state.records.location,
    isHopsEnabled: state.status.hopsEnabled,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudiesPrimaryOption);
