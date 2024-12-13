import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { TextField } from "../text-field";
import { BasicInformation } from "~/@types/shared";
import { HopsBaseProps } from "..";
import HopsHistory from "../hops-history";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";

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
  status: StatusType;
  /**
   * This is utility method to jump specific step. Doesn validate so use it carefully.
   * Weird things is that StepZilla library doesn't support types. So this is need to "activate"
   * this props, so it could work.
   */
  jumpToStep?: (step: number) => void;
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
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(
    prevProps: Readonly<HopsStudentHopsInformationProps>
  ): void {
    if (prevProps.disabled !== this.props.disabled) {
      this.props.jumpToStep(0);
    }
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
          <>
            <fieldset className="hops-container__fieldset">
              <legend className="hops-container__subheader">Perustiedot</legend>

              <div className="hops-container__row">
                <div className="hops__form-element-container">
                  <TextField
                    id="studentName"
                    label="Nimi:"
                    type="text"
                    placeholder="Nimi"
                    value={this.props.basicInformation.name}
                    disabled
                    className="hops__input"
                  />
                </div>
              </div>
              <div className="hops-container__row">
                <div className="hops__form-element-container">
                  <TextField
                    id="educationLevel"
                    label="Koulutusaste:"
                    type="text"
                    placeholder="Koulutusaste"
                    value={this.props.basicInformation.educationalLevel}
                    disabled
                    className="hops__input"
                  />
                </div>
              </div>
              <div className="hops-container__row">
                <div className="hops__form-element-container">
                  <TextField
                    id="guidanceCouselor"
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
                    className="hops__input"
                  />
                </div>
              </div>
            </fieldset>
            {this.props.basicInformation.updates &&
            this.props.basicInformation.updates.length ? (
              <fieldset className="hops-container__fieldset">
                <legend className="hops-container__subheader">
                  Muokkaushistoria
                </legend>
                <div className="hops-container__info">
                  <HopsHistory
                    hopsUpdates={this.props.basicInformation.updates}
                    loggedUserId={this.props.loggedUserId}
                    loading={this.props.loadingHistoryEvents}
                    superVisorModifies={this.props.superVisorModifies}
                    onHistoryEventClick={this.props.onHistoryEventClick}
                    status={this.props.status}
                  />
                  <div className="hops-container__row">
                    <Button
                      buttonModifiers={["load-all-hops-events"]}
                      onClick={this.props.onLoadMOreHistoryEventsClick}
                      disabled={
                        this.props.allHistoryEventLoaded ||
                        this.props.loadingHistoryEvents ||
                        this.props.basicInformation.updates.length > 5
                      }
                    >
                      Lataa kaikki
                    </Button>
                  </div>
                </div>
              </fieldset>
            ) : null}
          </>
        )}
      </section>
    );
  }
}

export default HopsStudentHopsInformation;
