import * as React from "react";
import "~/sass/elements/compulsory-education-hops.scss";
import { TextField } from "../text-field";
import { BasicInformation } from "../../../../../../../@types/shared";
import * as moment from "moment";

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
              {/* <div className="hops-container__row">
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
              </div> */}
            </div>
            {this.props.basicInformation.updates &&
            this.props.basicInformation.updates.length ? (
              <div className="hops-sub__container--updates">
                <div className="hops-container__row">
                  <div className="hops__form-element-container">
                    <label className="hops-label">Päivitykset:</label>
                    <ul className="hops-updates__list">
                      {this.props.basicInformation.updates.map((uItem) => (
                        <li>
                          {moment(uItem.date).format("l")} - {uItem.modifier}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </fieldset>
        )}
      </div>
    );
  }
}

export default StudentHopsInformation;
