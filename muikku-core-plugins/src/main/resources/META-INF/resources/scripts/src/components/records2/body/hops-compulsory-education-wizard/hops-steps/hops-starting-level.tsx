import * as React from "react";
import {
  Education,
  HopsStudentStartingLevel,
  LanguageGrade,
  LanguageGradeEnum,
} from "~/@types/shared";
import "~/sass/elements/hops.scss";
import {
  HopsLanguageGradeTable,
  LanguageGradeRow,
} from "../hops-language-grade-table";
import { TextField } from "../text-field";
import Button from "~/components/general/button";
import { HopsBaseProps } from "..";

/**
 * StartingLevelProps
 */
interface HopsStartingLevelProps extends HopsBaseProps {
  studentStartingLevel: HopsStudentStartingLevel;
  onStartingLevelChange: (startingLevel: HopsStudentStartingLevel) => void;
}

/**
 * StartingLevelState
 */
interface HopsStartingLevelState {}

/**
 * StartingLevel
 */
class HopsStartingLevel extends React.Component<
  HopsStartingLevelProps,
  HopsStartingLevelState
> {
  /**
   * Constructor method
   *
   * @param props props
   */
  constructor(props: HopsStartingLevelProps) {
    super(props);

    this.state = {};
  }

  /**
   * Handles selects changes
   *
   * @param name keyof of HopsStudentStartingLevel
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
   * Handles textarea changes
   *
   * @param name keyof of HopsStudentStartingLevel
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
   * Handles adding new customg language to list
   */
  handleAddNewCustomLngClick = () => {
    const updatedLngGrades = [
      ...this.props.studentStartingLevel.previousLanguageExperience,
    ];

    updatedLngGrades.push({
      name: "",
      grade: LanguageGradeEnum.NOT_STUDIED,
      hardCoded: false,
    });

    this.props.onStartingLevelChange({
      ...this.props.studentStartingLevel,
      previousLanguageExperience: updatedLngGrades,
    });
  };

  /**
   * Handles row deletion from list
   *
   * @param index of row which will be deleted
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
   * Handles custom language changes
   *
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
   *
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="hops__container">
        <fieldset className="hops__fieldset">
          <legend className="hops__subheader">
            Aikaisemmat opinnot ja työkokemus
          </legend>

          <div className="hops__row">
            <div className="hops__form-element-container">
              <label className="hops__label">Aiempi koulutus</label>
              <select
                className="hops__select"
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
              <div className="form-element">
                <TextField
                  label="Mikä?"
                  className="form-element__input"
                  onChange={this.handleTextAreaChange("previousEducationElse")}
                  value={this.props.studentStartingLevel.previousEducationElse}
                  disabled={this.props.disabled}
                />
              </div>
            ) : null}
          </div>

          <div className="hops__row">
            <div className="form-element">
              <TextField
                label="Opintoihin käytetyt vuodet?"
                className="form-element__input"
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

          <div className="hops__row">
            <div className="form-element">
              <label>Työkokemus:</label>
              <select
                className="form-element__select"
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
          <legend className="hops-container__subheader">Kielitaito</legend>

          <div className="hops-container__row">
            <div className="hops-table__container">
              <HopsLanguageGradeTable>
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
              </HopsLanguageGradeTable>
              <div className="hops-button__container">
                <Button onClick={this.handleAddNewCustomLngClick}>
                  Lisää kieli
                </Button>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}

export default HopsStartingLevel;
