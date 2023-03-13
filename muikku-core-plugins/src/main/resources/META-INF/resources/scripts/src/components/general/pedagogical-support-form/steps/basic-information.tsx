import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { TextField } from "../../hops-compulsory-education-wizard/text-field";
import * as moment from "moment";
import { History, HistoryEntryItem } from "../history";
import { StatusType } from "~/reducers/base/status";
import { PedagogyForm } from "~/@types/pedagogy-form";
import PagerV2 from "../../pagerV2";

/**
 * BasicInformationProps
 */
interface BasicInformationProps {
  pedagogyData?: PedagogyForm;
  status: StatusType;
}

const itemsPerPage = 5;

/**
 * BasicInformation
 *
 * @param props props
 * @returns JSX.Element
 */
const BasicInformation: React.FC<BasicInformationProps> = (props) => {
  const { pedagogyData, status } = props;
  const [currentPage, setCurrentPage] = React.useState<number>(0);

  /**
   * handleCurrentPageChange
   * @param selectedItem selectedItem
   * @param selectedItem.selected selectedItem.selected
   */
  const handleCurrentPageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  /**
   * renderHistory
   * @returns JSX.Element
   */
  const renderHistory = () => {
    if (!pedagogyData || pedagogyData.history.length === 0) {
      return <p>Ei tapahtumia</p>;
    }

    const offset = currentPage * itemsPerPage;

    const currentHistory = pedagogyData.history.slice(
      offset,
      offset + itemsPerPage
    );

    const pageCount = Math.ceil(pedagogyData.history.length / itemsPerPage);

    if (pedagogyData.history.length > itemsPerPage) {
      return (
        <>
          <History>
            {currentHistory.map((item, i) => (
              <HistoryEntryItem
                key={i}
                showEdit={true}
                historyEntry={item}
                status={status}
              />
            ))}
          </History>
          <PagerV2
            previousLabel=""
            nextLabel=""
            breakLabel="..."
            initialPage={currentPage}
            forcePage={currentPage}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            pageRangeDisplayed={2}
            onPageChange={handleCurrentPageChange}
          />
        </>
      );
    }

    return (
      <History>
        {currentHistory.map((item, i) => (
          <HistoryEntryItem
            key={i}
            showEdit={true}
            historyEntry={item}
            status={status}
          />
        ))}
      </History>
    );
  };

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
        <div className="hops-container__info">{renderHistory()}</div>
      </fieldset>
    </section>
  );
};

export default BasicInformation;
