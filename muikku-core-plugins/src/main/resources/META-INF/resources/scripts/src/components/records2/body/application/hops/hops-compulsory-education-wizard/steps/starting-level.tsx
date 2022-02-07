import * as React from "react";
import {
  Education,
  HopsStudentStartingLevel,
  LanguageGrade,
} from "~/@types/shared";
import "~/sass/elements/compulsory-education-hops.scss";
import { LanguageGradeTable, LanguageGradeRow } from "../language-grade-table";
import { TextField } from "../text-field";
import Button from "~/components/general/button";

/**
 * StartingLevelProps
 */
interface StartingLevelProps {
  disabled: boolean;
  studentStartingLevel: HopsStudentStartingLevel;
  onStartingLevelChange: (startingLevel: HopsStudentStartingLevel) => void;
}

/**
 * StartingLevelState
 */
interface StartingLevelState {}

/**
 * StartingLevel
 */
class StartingLevel extends React.Component<
  StartingLevelProps,
  StartingLevelState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: StartingLevelProps) {
    super(props);

    this.state = {};
  }

  /**
   * handleSelectsChange
   * @param name name
   */
  handleSelectsChange =
    (name: keyof HopsStudentStartingLevel) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      this.props.onStartingLevelChange({
        ...this.props.studentStartingLevel,
        [name]: e.currentTarget.value,
      });
    };

  /**
   * handleTextAreaChange
   * @param name name
   */
  handleTextAreaChange =
    (name: keyof HopsStudentStartingLevel) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onStartingLevelChange({
        ...this.props.studentStartingLevel,
        [name]: e.currentTarget.value,
      });
    };

  /**
   * handleFinnishAsMainOrSecondaryLngChange
   * @param e e
   */
  handleFinnishAsMainOrSecondaryLngChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.onStartingLevelChange({
      ...this.props.studentStartingLevel,
      finnishAsMainOrSecondaryLng: e.target.checked,
    });
  };

  /**
   * Handles adding new customg language to list
   */
  handleAddNewCustomLngClick = () => {
    const updatedLngGrades = [
      ...this.props.studentStartingLevel.previousLanguageExperience,
    ];

    updatedLngGrades.push({ name: "", grade: 1, hardCoded: false });

    this.props.onStartingLevelChange({
      ...this.props.studentStartingLevel,
      previousLanguageExperience: updatedLngGrades,
    });
  };

  /**
   * Handles row deletion from list
   * @param index of deleted row in list
   */
  handleDeleteCustomLngClick = (index: number) => {
    const updatedLngGrades = [
      ...this.props.studentStartingLevel.previousLanguageExperience,
    ];

    updatedLngGrades.splice(index, 1);

    this.props.onStartingLevelChange({
      ...this.props.studentStartingLevel,
      previousLanguageExperience: updatedLngGrades,
    });
  };

  /**
   * handleCustomLngChange
   * @param updatedLng updatedLng
   * @param index index
   */
  handleCustomLngChange = (updatedLng: LanguageGrade, index: number) => {
    const updatedLngGrades = [
      ...this.props.studentStartingLevel.previousLanguageExperience,
    ];

    updatedLngGrades[index] = { ...updatedLng };

    this.props.onStartingLevelChange({
      ...this.props.studentStartingLevel,
      previousLanguageExperience: updatedLngGrades,
    });
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="hops-container">
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Aikaisemmat opinnot ja työkokemus
          </legend>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <label className="hops-label">Aiempi koulutus</label>
              <select
                className="hops-select"
                value={this.props.studentStartingLevel.previousEducation}
                onChange={this.handleSelectsChange("previousEducation")}
                disabled={this.props.disabled}
              >
                <option value={Education.HOME_SCHOOL}>kotiopetus</option>
                <option value={Education.COMPULSORY_SCHOOL}>peruskoulu</option>
                <option value={Education.VOCATIONAL_SCHOOL}>
                  ammattiopisto
                </option>
                <option value={Education.SOMETHING_ELSE}>joku muu</option>
              </select>
            </div>

            {this.props.studentStartingLevel.previousEducation ===
            Education.SOMETHING_ELSE ? (
              <div className="hops__form-element-container">
                <TextField
                  label="Mikä?"
                  className="hops-input"
                  onChange={this.handleTextAreaChange("previousEducationElse")}
                  value={this.props.studentStartingLevel.previousEducationElse}
                  disabled={this.props.disabled}
                />
              </div>
            ) : null}
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <TextField
                label="Opintoihin käytetyt vuodet?"
                className="hops-input"
                onChange={this.handleTextAreaChange(
                  "previousYearsUsedInStudies"
                )}
                value={
                  this.props.studentStartingLevel.previousYearsUsedInStudies
                }
                disabled={this.props.disabled}
              />
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <label className="hops-label">Työkokemus:</label>
              <select
                className="hops-select"
                value={this.props.studentStartingLevel.previousWorkExperience}
                onChange={this.handleSelectsChange("previousWorkExperience")}
                disabled={this.props.disabled}
              >
                <option value="0-5">0-5 vuotta</option>
                <option value="6-10">6-10 vuotta</option>
                <option value="11-15">11-15 vuotta</option>
                <option value=">16">yli 16 vuotta</option>
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Kielivalinta ja osaaminen
          </legend>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <label className="hops-label">
                suomi äidinkielenä/suomi toisena kielenä
              </label>
              <input
                type="checkbox"
                className="hops-input"
                checked={
                  this.props.studentStartingLevel.finnishAsMainOrSecondaryLng
                }
                onChange={this.handleFinnishAsMainOrSecondaryLngChange}
                disabled={this.props.disabled}
              ></input>
            </div>
          </div>
          <legend className="hops-container__subheader">Muu kielitaito</legend>
          <div className="hops-container__row">
            <div className="hops-table__container">
              <LanguageGradeTable>
                {this.props.studentStartingLevel.previousLanguageExperience.map(
                  (lngG, index) => (
                    <LanguageGradeRow
                      key={index}
                      index={index}
                      lng={lngG}
                      onLanguageRowChange={this.handleCustomLngChange}
                      onDeleteRowClick={this.handleDeleteCustomLngClick}
                      disabled={this.props.disabled}
                    />
                  )
                )}
              </LanguageGradeTable>
              <div className="hops-button__container">
                <Button onClick={this.handleAddNewCustomLngClick}>Muu?</Button>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}

export default StartingLevel;
