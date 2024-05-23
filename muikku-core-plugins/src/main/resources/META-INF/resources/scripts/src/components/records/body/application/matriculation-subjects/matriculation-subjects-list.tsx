import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { MatriculationSubjectCode } from "./matriculation-subject-type";
import "~/sass/elements/wcag.scss";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";
import MApi, { isMApiError } from "~/api/api";
import { MatriculationSubject } from "~/generated/client";

import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";

/**
 * Interface representing MatriculationSubjectsList component properties
 *
 */
interface MatriculationSubjectsListProps extends WithTranslation {
  initialMatriculationSubjects?: string[];
  displayNotification: DisplayNotificationTriggerType;
  onMatriculationSubjectsChange: (matriculationSubjects: string[]) => void;
}

/**
 * Interface representing MatriculationSubjectsList component state
 *
 */
interface MatriculationSubjectsListState {
  matriculationSubjects: MatriculationSubject[];
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
  /**
   * constructor
   * @param props props
   */
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
      selectedSubjects.filter((selectedSubject) => !!selectedSubject)
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
    e: React.ChangeEvent<HTMLInputElement>
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
  getMatriculationSubjectNameByCode = (code: MatriculationSubjectCode) =>
    this.props.t(`matriculationSubjects.${code}`, { ns: "hops" });

  /**
   * Component did mount life-cycle method
   *
   * Reads available matriculation subjects from REST API
   */
  async componentDidMount() {
    const recordsApi = MApi.getRecordsApi();

    if (!this.state.loading) {
      this.setState({
        loading: true,
      });

      try {
        const matriculationSubjects =
          await recordsApi.getMatriculationSubjects();

        this.setState({
          matriculationSubjects: matriculationSubjects,
          loading: false,
          selectedMatriculationSubjects: this.props
            .initialMatriculationSubjects || [""],
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        this.props.displayNotification(
          this.props.i18n.t("notifications.loadError", {
            ns: "studies",
            context: "matriculationSubjects",
          }),
          "error"
        );
      }
    }
  }

  /**
   * Component render method
   *
   * Renders component
   */
  render() {
    const { t } = this.props;

    if (this.state.loading) {
      return <div className="loader">{t("labels.loading")}</div>;
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
              {t("wcag.select", { ns: "guider" })}
            </label>
            <select
              id={`matriculationSubject` + index}
              className="form-element__select form-element__select--matriculation-exam"
              value={subject}
              onChange={this.handleMatriculationSubjectChange.bind(this, index)}
            >
              <option disabled value="">
                {t("labels.select", { ns: "hops" })}
              </option>
              {this.state.matriculationSubjects.map(
                (subject, index: number) => (
                  <option key={index} value={subject.code}>
                    {this.getMatriculationSubjectNameByCode(
                      subject.code as MatriculationSubjectCode
                    )}
                  </option>
                )
              )}
            </select>
            <Button
              buttonModifiers={[
                "primary-function-content",
                "remove-subject-row",
              ]}
              onClick={this.handleMatriculationSubjectRemove.bind(this, index)}
            >
              {t("actions.remove")}
            </Button>
          </div>
        )
      );

    return (
      <div className="form-element">
        {matriculationSubjectInputs}
        <div className="form__buttons">
          <Button
            buttonModifiers={["primary-function-content", "add-subject-row"]}
            onClick={this.handleMatriculationSubjectAdd.bind(this)}
          >
            {t("actions.addSubject", { ns: "studies" })}
          </Button>
        </div>
      </div>
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default withTranslation(["studies", "guider", "hops", "common"])(
  connect(null, mapDispatchToProps)(MatriculationSubjectsList)
);
