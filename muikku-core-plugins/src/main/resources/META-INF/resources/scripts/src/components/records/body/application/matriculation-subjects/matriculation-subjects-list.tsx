import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import mApi from "~/lib/mApi";
import MatriculationSubjectType from "./matriculation-subject-type";
import "~/sass/elements/wcag.scss";
import Button from "~/components/general/button";

/**
 * Interface representing MatriculationSubjectsList component properties
 *
 */
interface MatriculationSubjectsListProps {
  initialMatriculationSubjects?: string[];
  onMatriculationSubjectsChange: (matriculationSubjects: string[]) => void;
  i18n: i18nType;
}

/**
 * Interface representing MatriculationSubjectsList component state
 *
 */
interface MatriculationSubjectsListState {
  matriculationSubjects: MatriculationSubjectType[];
  selectedMatriculationSubjects: string[];
  loading: boolean;
}

/**
 * MatriculationSubjectsList component
 *
 */
class MatriculationSubjectsList extends React.Component<
  MatriculationSubjectsListProps,
  MatriculationSubjectsListState
> {
  constructor(props: MatriculationSubjectsListProps) {
    super(props);

    this.state = {
      matriculationSubjects: [],
      selectedMatriculationSubjects: [""],
      loading: false,
    };
  }

  /**
   * Method for notifying about matriculation subject changes
   *
   * Method filters out empty values from input array
   *
   * @param selectedSubjects selected subjects
   */
  notifyMatriculationSubjectChange(selectedSubjects: string[]) {
    this.props.onMatriculationSubjectsChange(
      selectedSubjects.filter((selectedSubject) => !!selectedSubject),
    );
  }

  /**
   * Event handler for matriculation subject change
   *
   * @param index list index
   * @param e event
   */
  handleMatriculationSubjectChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedSubjects = [...this.state.selectedMatriculationSubjects];
    selectedSubjects[index] = e.target.value;

    this.setState({
      selectedMatriculationSubjects: selectedSubjects,
    });

    this.notifyMatriculationSubjectChange(selectedSubjects);
  }

  /**
   * Event handler for handling matriculation subject removals
   *
   * @param index index number
   */
  handleMatriculationSubjectRemove(index: number) {
    const selectedSubjects = [...this.state.selectedMatriculationSubjects];
    selectedSubjects.splice(index, 1);

    this.setState({
      selectedMatriculationSubjects: selectedSubjects,
    });

    this.notifyMatriculationSubjectChange(selectedSubjects);
  }

  /**
   * Event handler for handling matriculation subject additions
   */
  handleMatriculationSubjectAdd() {
    const selectedSubjects = [...this.state.selectedMatriculationSubjects];
    selectedSubjects.push("");

    this.setState({
      selectedMatriculationSubjects: selectedSubjects,
    });
  }

  /**
   * Finds a matriculation subject name by subject value
   *
   * @param code matriculation subject code
   * @returns subject name or empty string if not found
   */
  getMatriculationSubjectNameByCode = (code: string): string =>
    this.props.i18n.text.get(
      `plugin.records.hops.matriculationSubject.${code}`,
    );

  /**
   * Component did mount life-cycle method
   *
   * Reads available matriculation subjects from REST API
   */
  componentDidMount() {
    if (!this.state.loading) {
      this.setState({
        loading: true,
      });

      mApi()
        .records.matriculationSubjects.read()
        .callback(
          (err: Error, matriculationSubjects: MatriculationSubjectType[]) => {
            if (!err) {
              this.setState({
                matriculationSubjects: matriculationSubjects,
                loading: false,
                selectedMatriculationSubjects: this.props
                  .initialMatriculationSubjects || [""],
              });
            }
          },
        );
    }
  }

  /**
   * Component render method
   *
   * Renders component
   */
  render() {
    if (this.state.loading) {
      return (
        <div className="loader">
          {this.props.i18n.text.get(
            "plugin.records.hops.goals.matriculationSubjectLoading",
          )}
        </div>
      );
    }

    const matriculationSubjectInputs =
      this.state.selectedMatriculationSubjects.map(
        (subject: string, index: number) => (
          <div
            className="form-element__dropdown-selection-container"
            key={index}
          >
            <label
              htmlFor={`matriculationSubject` + index}
              className="visually-hidden"
            >
              {this.props.i18n.text.get(
                "plugin.wcag.matriculationSubjectSelect.label",
              )}
            </label>
            <select
              id={`matriculationSubject` + index}
              className="form-element__select form-element__select--matriculation-exam"
              value={subject}
              onChange={this.handleMatriculationSubjectChange.bind(this, index)}
            >
              <option disabled value="">
                {this.props.i18n.text.get(
                  "plugin.records.hops.goals.matriculationSubjectChoose",
                )}
              </option>
              {this.state.matriculationSubjects.map(
                (subject: MatriculationSubjectType, index: number) => (
                  <option key={index} value={subject.code}>
                    {this.getMatriculationSubjectNameByCode(subject.code)}
                  </option>
                ),
              )}
            </select>
            <Button
              buttonModifiers={[
                "primary-function-content",
                "remove-subject-row",
              ]}
              onClick={this.handleMatriculationSubjectRemove.bind(this, index)}
            >
              {this.props.i18n.text.get(
                "plugin.records.hops.goals.matriculationSubjectRemove",
              )}
            </Button>
          </div>
        ),
      );

    return (
      <div className="form-element__custom-element">
        {matriculationSubjectInputs}
        <div className="form-element__button-container">
          <Button
            buttonModifiers={["primary-function-content", "add-subject-row"]}
            onClick={this.handleMatriculationSubjectAdd.bind(this)}
          >
            {this.props.i18n.text.get(
              "plugin.records.hops.goals.matriculationSubjectAdd",
            )}
          </Button>
        </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MatriculationSubjectsList);
