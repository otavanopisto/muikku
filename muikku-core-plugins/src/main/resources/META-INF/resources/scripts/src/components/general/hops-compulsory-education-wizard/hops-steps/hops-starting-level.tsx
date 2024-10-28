import * as React from "react";
import {
  Education,
  HopsStudentStartingLevel,
  LanguageGrade,
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
  /**
   * This is utility method to jump specific step. Doesn validate so use it carefully.
   * Weird things is that StepZilla library doesn't support types. So this is need to "activate"
   * this props, so it could work.
   */
  jumpToStep?: (step: number) => void;
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
  private myRef: HTMLDivElement = undefined;
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
   * componentDidMount
   */
  componentDidMount(): void {
    window.dispatchEvent(new Event("resize"));

    this.myRef.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: Readonly<HopsStartingLevelProps>): void {
    if (prevProps.disabled !== this.props.disabled) {
      this.props.jumpToStep(0);
    }
  }

  /**
   * This is for StepZilla way to validated "step"
   * that locks users way to get further in form
   * before all data is given and valitated
   * @returns boolean
   */
  isValidated = () => !this.isInvalid();

  /**
   * isInvalid
   */
  isInvalid = () =>
    this.props.user === "student" &&
    this.hopsPreviousLanguageExperienceHasUndefinedValues();

  /**
   * hopsPreviousLanguageExperienceHasUndefinedValues
   */
  hopsPreviousLanguageExperienceHasUndefinedValues = () =>
    this.props.studentStartingLevel.previousLanguageExperience.some(
      (lng) => lng.grade === undefined || lng.name === ""
    );

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
      grade: undefined,
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
      <div className="hops-container" ref={(ref) => (this.myRef = ref)}>
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Aikaisemmat opinnot ja työkokemus
          </legend>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <label htmlFor="previousEducation" className="hops__label">
                Aiempi koulutus
              </label>
              <select
                id="previousEducation"
                className="hops__select"
                value={this.props.studentStartingLevel.previousEducation}
                onChange={this.handleSelectsChange("previousEducation")}
                disabled={this.props.disabled}
              >
                <option value={Education.COMPULSORY_SCHOOL}>perusopetus</option>
                <option value={Education.VOCATIONAL_SCHOOL}>
                  ammattiopisto
                </option>
                <option value={Education.NO_PREVIOUS_EDUCATION}>
                  ei aiempaa koulutusta
                </option>
                <option value={Education.SOMETHING_ELSE}>joku muu</option>
              </select>
            </div>

            {this.props.studentStartingLevel.previousEducation ===
            Education.SOMETHING_ELSE ? (
              <div className="hops__form-element-container">
                <TextField
                  id="previousEducationElse"
                  label="Mikä?"
                  className="hops__input"
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
                id="previousYearsUsedInStudies"
                label="Opintoihin käytetyt vuodet?"
                className="hops__input"
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
              <label htmlFor="previousWorkExperience" className="hops__label">
                Työkokemus:
              </label>
              <select
                id="previousWorkExperience"
                className="hops__select"
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

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <TextField
                id="previousWorkExperienceField"
                label="Miltä alalta työkokemuksesi on?"
                className="hops__input"
                onChange={this.handleTextAreaChange(
                  "previousWorkExperienceField"
                )}
                value={
                  this.props.studentStartingLevel.previousWorkExperienceField
                }
                disabled={this.props.disabled}
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader hops-container__subheader--required">
            Kielitaito
          </legend>

          <span>Tähdellä (*) merkityt kentät ovat pakollisia.</span>

          <div className="hops-container__row">
            <div className="hops-container__table-container">
              <HopsLanguageGradeTable usePlace={this.props.usePlace}>
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
              {!this.props.disabled ? (
                <div className="hops-container__row">
                  <Button
                    buttonModifiers={["add-extra-row"]}
                    onClick={this.handleAddNewCustomLngClick}
                    icon="plus"
                  >
                    Lisää kieli
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}

export default HopsStartingLevel;
