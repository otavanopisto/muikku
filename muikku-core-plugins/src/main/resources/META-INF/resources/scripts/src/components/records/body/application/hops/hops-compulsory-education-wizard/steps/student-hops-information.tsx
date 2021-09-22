import * as React from "react";
import "~/sass/elements/compulsory-education-hops.scss";
import { TextField } from "../text-field";
import { BasicInformation } from "../../../../../../../@types/shared";

/**
 * StudentHopsInformationProps
 */
interface StudentHopsInformationProps {
  disabled: boolean;
  loading: boolean;
  basicInformation: BasicInformation;
}

/**
 * StudentHopsInformationState
 */
interface StudentHopsInformationState {}

/**
 * StudentHopsInformation
 */
class StudentHopsInformation extends React.Component<
  StudentHopsInformationProps,
  StudentHopsInformationState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: StudentHopsInformationProps) {
    super(props);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="hops-container">
        {this.props.loading ? (
          <div className="loader-empty" />
        ) : (
          <fieldset className="hops-container__fieldset">
            <legend className="hops-container__subheader">Perustiedot:</legend>

            <div className="hops-sub__container">
              <div className="hops-container__row">
                <div className="hops__form-element-container">
                  <TextField
                    label="Nimi:"
                    type="text"
                    placeholder="Nimi"
                    value={this.props.basicInformation.name}
                    disabled
                    className="hops-input"
                  />
                </div>
              </div>
              <div className="hops-container__row">
                <div className="hops__form-element-container">
                  <TextField
                    label="Ohjaaja:"
                    type="text"
                    placeholder="Ohjaaja"
                    value={this.props.basicInformation.guider}
                    disabled
                    className="hops-input"
                  />
                </div>
              </div>
              <div className="hops-container__row">
                <div className="hops__form-element-container">
                  <TextField
                    label="Laatimispäivä:"
                    type="text"
                    placeholder="Laatimispäivä"
                    defaultValue="16.8.2020"
                    disabled
                    className="hops-input"
                  />
                </div>
              </div>
            </div>
            <div className="hops-sub__container--updates">
              <div className="hops-container__row">
                <div className="hops__form-element-container">
                  <label className="hops-label">Päivitykset:</label>
                  <ul className="hops-updates__list">
                    <li>25.8.2020</li>
                    <li>30.9.2020</li>
                    <li>24.4.2021</li>
                  </ul>
                </div>
              </div>
            </div>
          </fieldset>
        )}
      </div>
    );
  }
}

export default StudentHopsInformation;
