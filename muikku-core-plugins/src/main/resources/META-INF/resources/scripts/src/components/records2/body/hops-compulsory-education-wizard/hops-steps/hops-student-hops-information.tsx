import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { TextField } from "../text-field";
import { BasicInformation } from "~/@types/shared";
import { HopsBaseProps } from "..";
import HopsHistory from "../hops-history";
import Link from "~/components/general/link";

/**
 * StudentHopsInformationProps
 */
interface HopsStudentHopsInformationProps extends HopsBaseProps {
  loading: boolean;
  basicInformation: BasicInformation;
  loggedUserId: number;
  loadingHistoryEvents: boolean;
  allHistoryEventLoaded: boolean;
  onHistoryEventClick: (eventId: number) => void;
  onLoadMOreHistoryEventsClick: () => void;
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
      <section className="hops-container">
        {this.props.loading ? (
          <div className="loader-empty" />
        ) : (
          <fieldset className="hops-container__fieldset">
            <legend className="hops-container__subheader">Perustiedot:</legend>

            <div className="hops-container__row">
              <div className="hops__form-element-container">
                <TextField
                  label="Nimi:"
                  type="text"
                  placeholder="Nimi"
                  value={this.props.basicInformation.name}
                  readOnly
                  className="hops__input"
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
                  readOnly
                  className="hops__input"
                />
              </div>
            </div>
            {this.props.basicInformation.updates &&
            this.props.basicInformation.updates.length ? (
              <div className="hops-container__info">
                <h3 className="hops-container__subheader">Muokkaushistoria</h3>
                <Link
                  onClick={this.props.onLoadMOreHistoryEventsClick}
                  disabled={
                    this.props.allHistoryEventLoaded ||
                    this.props.loadingHistoryEvents ||
                    this.props.basicInformation.updates.length > 5
                  }
                >
                  Lataa kaikki
                </Link>
                <HopsHistory
                  hopsUpdates={this.props.basicInformation.updates}
                  loggedUserId={this.props.loggedUserId}
                  loading={this.props.loadingHistoryEvents}
                  superVisorModifies={this.props.superVisorModifies}
                  onHistoryEventClick={this.props.onHistoryEventClick}
                />
              </div>
            ) : null}
          </fieldset>
        )}
      </section>
    );
  }
}

export default HopsStudentHopsInformation;
