import * as React from "react";
import "~/sass/elements/compulsory-education-hops.scss";
import { TextField } from "../text-field";
import * as moment from "moment";
import { BasicInformation } from "~/@types/shared";
import { HopsBaseProps } from "..";
import HopsHistory from "../hops-history";

/**
 * StudentHopsInformationProps
 */
interface HopsStudentHopsInformationProps extends HopsBaseProps {
  loading: boolean;
  basicInformation: BasicInformation;
}

/**
 * StudentHopsInformationState
 */
interface HopsStudentHopsInformationState {}

/**
 * StudentHopsInformation
 */
class HopsStudentHopsInformation extends React.Component<
  HopsStudentHopsInformationProps,
  HopsStudentHopsInformationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: HopsStudentHopsInformationProps) {
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
                    value={
                      this.props.basicInformation.counselorList !== undefined &&
                      this.props.basicInformation.counselorList.length > 0
                        ? this.props.basicInformation.counselorList.join(", ")
                        : "Ei ohjaaja"
                    }
                    disabled
                    className="hops-input"
                  />
                </div>
              </div>
            </div>
            {this.props.basicInformation.updates &&
            this.props.basicInformation.updates.length ? (
              <>
                <h3>Muokkaushistoria</h3>
                <div className="hops-sub__container--updates">
                  <HopsHistory
                    hopsUpdates={this.props.basicInformation.updates}
                  />
                </div>
              </>
            ) : null}
          </fieldset>
        )}
      </div>
    );
  }
}

export default HopsStudentHopsInformation;
