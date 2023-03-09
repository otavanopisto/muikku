import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { TextField } from "../../hops-compulsory-education-wizard/text-field";
import * as moment from "moment";
import { History, HistoryEntryItem } from "../history";
import { StatusType } from "~/reducers/base/status";
import { PedagogyForm } from "~/@types/pedagogy-form";

/**
 * BasicInformationProps
 */
interface BasicInformationProps {
  pedagogyData?: PedagogyForm;
  status: StatusType;
}

/**
 * BasicInformation
 *
 * @param props props
 * @returns JSX.Element
 */
const BasicInformation: React.FC<BasicInformationProps> = (props) => {
  const { pedagogyData, status } = props;

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">Perustiedot</legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="studentName"
              label="Etunimet:"
              type="text"
              value={pedagogyData?.studentInfo.firstName || ""}
              disabled
              className="hops__input"
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="studentName"
              label="Sukunimi:"
              type="text"
              value={pedagogyData?.studentInfo.lastName || ""}
              disabled
              className="hops__input"
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="dateOfBirth"
              label="Syntymäaika:"
              type="text"
              value={
                (pedagogyData?.studentInfo.dateOfBirth &&
                  moment(pedagogyData?.studentInfo.dateOfBirth).format(
                    "DD.MM.YYYY"
                  )) ||
                "-"
              }
              disabled
              className="hops__input"
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="phoneNumber"
              label="Puhelinnumero:"
              type="text"
              value={pedagogyData?.studentInfo.phoneNumber || "-"}
              disabled
              className="hops__input"
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="email"
              label="Sähköposti:"
              type="text"
              value={pedagogyData?.studentInfo.email || "-"}
              disabled
              className="hops__input"
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="address"
              label="Osoite:"
              type="text"
              value={pedagogyData?.studentInfo.addressName || "-"}
              disabled
              className="hops__input"
            />
          </div>
        </div>
      </fieldset>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">Muokkaushistoria</legend>
        <div className="hops-container__info">
          {pedagogyData?.history.length ? (
            <History>
              {pedagogyData?.history.map((item, i) => (
                <HistoryEntryItem
                  key={i}
                  showEdit={true}
                  historyEntry={item}
                  onHistoryEventClick={() =>
                    // eslint-disable-next-line no-console
                    console.log("history event clicked")
                  }
                  status={status}
                />
              ))}
            </History>
          ) : (
            <div className="hops-container__row">
              <p className="hops-container__info-text">
                Ei muokkaushistoriaa saatavilla
              </p>
            </div>
          )}

          {/* <div className="hops-container__row">
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
            </div> */}
        </div>
      </fieldset>
    </section>
  );
};

export default BasicInformation;
