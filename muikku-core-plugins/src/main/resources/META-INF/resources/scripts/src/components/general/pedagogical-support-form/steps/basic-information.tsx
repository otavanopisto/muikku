import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { TextField } from "../../hops-compulsory-education-wizard/text-field";
import * as moment from "moment";
import { History, HistoryEntryItem } from "../history";
import { StatusType } from "~/reducers/base/status";
import PagerV2 from "../../pagerV2";
import { usePedagogyContext } from "../context/pedagogy-context";

/**
 * BasicInformationProps
 */
interface BasicInformationProps {
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
  const { status } = props;
  const { data } = usePedagogyContext();
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
    if (!data || data.history.length === 0) {
      return <p>Ei tapahtumia</p>;
    }

    const offset = currentPage * itemsPerPage;

    const currentHistory = data.history.slice(offset, offset + itemsPerPage);

    const pageCount = Math.ceil(data.history.length / itemsPerPage);

    if (data.history.length > itemsPerPage) {
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
              value={data?.studentInfo.firstName || ""}
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
              value={data?.studentInfo.lastName || ""}
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
                (data?.studentInfo.dateOfBirth &&
                  moment(data?.studentInfo.dateOfBirth).format("DD.MM.YYYY")) ||
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
              value={data?.studentInfo.phoneNumber || "-"}
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
              value={data?.studentInfo.email || "-"}
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
              value={data?.studentInfo.streetAddress || "-"}
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
