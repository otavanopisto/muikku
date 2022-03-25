import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
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
      <section className="hops__container">
        {this.props.loading ? (
          <div className="loader-empty" />
        ) : (
          <fieldset className="form__fieldset">
            <legend className="form__legend">Perustiedot:</legend>

            <div className="hops__row">
              <div className="form-element">
                <TextField
                  label="Nimi:"
                  type="text"
                  placeholder="Nimi"
                  value={this.props.basicInformation.name}
                  disabled
                  className="form-element__input"
                />
              </div>
            </div>
            <div className="hops__row">
              <div className="form-element">
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
                  className="form-element__input"
                />
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
      </section>
    );
  }
}

export default HopsStudentHopsInformation;
