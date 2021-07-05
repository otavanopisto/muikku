import * as React from "react";
import "~/sass/elements/compulsory-education-hops.scss";
import { TextField } from "../text-field";

interface StudentHopsInformationProps {}

interface StudentHopsInformationState {}

class StudentHopsInformation extends React.Component<
  StudentHopsInformationProps,
  StudentHopsInformationState
> {
  constructor(props: StudentHopsInformationProps) {
    super(props);
  }

  render() {
    return (
      <div className="hops__step-container">
        <fieldset className="hops__step-container__fieldset">
          <legend className="hops__step-container__subheader">
            Perustiedot:
          </legend>

          <div className="hops__step-sub__container">
            <div className="hops__step-container__row">
              <div className="hops__step-form__element-container">
                <TextField
                  label="Nimi:"
                  type="text"
                  placeholder="Nimi"
                  className="hops__step__input"
                />
              </div>
            </div>
            <div className="hops__step-container__row">
              <div className="hops__step-form__element-container">
                <TextField
                  label="Ohjaaja:"
                  type="text"
                  placeholder="Ohjaaja"
                  className="hops__step__input"
                />
              </div>
            </div>
            <div className="hops__step-container__row">
              <div className="hops__step-form__element-container">
                <TextField
                  label="Laatimispäivä:"
                  type="text"
                  placeholder="Laatimispäivä"
                  defaultValue="16.8.2020"
                  className="hops__step__input"
                />
              </div>
            </div>
          </div>
          <div className="hops__step-sub__container--updates">
            <div className="hops__step-container__row">
              <div className="hops__step-form__element-container">
                <label className="hops__step__label">Päivitykset:</label>
                <ul className="hops__step-list">
                  <li>25.8.2020</li>
                  <li>30.9.2020</li>
                  <li>24.4.2021</li>
                </ul>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}

export default StudentHopsInformation;
