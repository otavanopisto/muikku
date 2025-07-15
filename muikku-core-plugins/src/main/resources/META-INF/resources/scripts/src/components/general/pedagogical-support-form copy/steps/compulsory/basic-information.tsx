import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { TextField } from "../../components/textfield";
import moment from "moment";
import { History, HistoryEntryItem } from "../../history";
import { StatusType } from "~/reducers/base/status";
import PagerV2 from "../../../pagerV2";
import { buildAddress } from "../../helpers";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { PedagogyHistoryEntryType } from "~/generated/client";
import { useTranslation } from "react-i18next";
import { useUpperSecondaryForm } from "../../hooks/useUppersecondaryForm";

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
  const { t } = useTranslation(["pedagogySupportPlan", "common"]);
  const { status } = props;
  const { data } = useUpperSecondaryForm();
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [historyFilters, setHistoryFilters] = React.useState<
    PedagogyHistoryEntryType[]
  >(["EDIT", "VIEW"]);

  /**
   * handleCurrentPageChange
   * @param selectedItem selectedItem
   * @param selectedItem.selected selectedItem.selected
   */
  const handleCurrentPageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  /**
   * handleClickHistoryFilter
   * @param filter filter
   */
  const handleClickHistoryFilter =
    (filter: PedagogyHistoryEntryType) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (historyFilters.includes(filter)) {
        unstable_batchedUpdates(() => {
          setHistoryFilters(historyFilters.filter((f) => f !== filter));
          setCurrentPage(0);
        });
      } else {
        unstable_batchedUpdates(() => {
          setHistoryFilters([...historyFilters, filter]);
          setCurrentPage(0);
        });
      }
    };

  /**
   * renderHistory
   * @returns JSX.Element
   */
  const renderHistory = () => {
    if (!data || data.history.length === 0) {
      return (
        <p>
          {t("content.empty", { ns: "pedagogySupportPlan", context: "events" })}
        </p>
      );
    }

    const offset = currentPage * itemsPerPage;

    // If no filters are selected, show all history entries
    const filteredHistory = historyFilters.length
      ? data.history.filter((item) => historyFilters.includes(item.type))
      : data.history;

    const currentHistory = filteredHistory.slice(offset, offset + itemsPerPage);

    const pageCount = Math.ceil(filteredHistory.length / itemsPerPage);

    if (filteredHistory.length > itemsPerPage) {
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
        <legend className="hops-container__subheader">
          {t("labels.basicInfo", { ns: "pedagogySupportPlan" })}
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="studentName"
              label={t("labels.name", { ns: "common" })}
              type="text"
              value={
                data
                  ? `${data.studentInfo.firstName} ${data.studentInfo.lastName}`
                  : ""
              }
              disabled
              className="hops__input"
            />
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="dateOfBirth"
              label={t("labels.dateOfBirth", { ns: "common" })}
              type="text"
              value={
                (data?.studentInfo?.dateOfBirth &&
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
              label={t("labels.phone", { ns: "common" })}
              type="text"
              value={data?.studentInfo?.phoneNumber || "-"}
              disabled
              className="hops__input"
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="email"
              label={t("labels.email", { ns: "common" })}
              type="text"
              value={data?.studentInfo?.email || "-"}
              disabled
              className="hops__input"
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="address"
              label={t("labels.address", { ns: "common" })}
              type="text"
              value={data ? `${buildAddress(data.studentInfo)}` : "-"}
              disabled
              className="hops__input"
            />
          </div>
        </div>
      </fieldset>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.history", { ns: "common" })}
        </legend>
        <div
          style={{
            display: "flex",
          }}
        >
          <div
            className={`hops-container__history-filter ${
              historyFilters.includes("EDIT")
                ? "hops-container__history-filter--active"
                : ""
            }`}
            onClick={handleClickHistoryFilter("EDIT")}
          >
            {t("labels.events", { ns: "pedagogySupportPlan", context: "edit" })}
          </div>
          <div
            className={`hops-container__history-filter ${
              historyFilters.includes("VIEW")
                ? "hops-container__history-filter--active"
                : ""
            }`}
            onClick={handleClickHistoryFilter("VIEW")}
          >
            {t("labels.events", { ns: "pedagogySupportPlan", context: "view" })}
          </div>
        </div>
        <div className="hops-container__info">{renderHistory()}</div>
      </fieldset>
    </section>
  );
};

export default BasicInformation;
