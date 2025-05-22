import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  InsertProfileWorklistItemTriggerType,
  insertProfileWorklistItem,
  loadProfileWorklistSection,
  LoadProfileWorklistSectionTriggerType,
} from "~/actions/main-function/profile";
import { StateType } from "~/reducers";
import { ProfileState } from "~/reducers/main-function/profile";
import WorkListEditable from "./components/work-list-editable";
import moment from "moment";
import { StatusType } from "~/reducers/base/status";
import { WorkListSection } from "./components/work-list-section";
import { withTranslation, WithTranslation } from "react-i18next";
import { WorklistTemplate } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

// we use these
const today = moment();
const daysInCurrentMonth = today.date();

// This sets the date limit of the current month when it is not possible to add new entries to the previous month
const currentMonthDayLimit = 10;

/**
 * IWorkListProps
 */
interface IWorkListProps extends WithTranslation<["common"]> {
  profile: ProfileState;
  status: StatusType;
  insertProfileWorklistItem: InsertProfileWorklistItemTriggerType;
  loadProfileWorklistSection: LoadProfileWorklistSectionTriggerType;
}

/**
 * IWorkListState
 */
interface IWorkListState {
  currentTemplate: WorklistTemplate;
  openedSections: string[];
}

/**
 * WorkList
 */
class WorkList extends React.Component<IWorkListProps, IWorkListState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: IWorkListProps) {
    super(props);

    this.state = {
      currentTemplate: null,
      openedSections: [],
    };

    this.insertNew = this.insertNew.bind(this);
    this.toggleSection = this.toggleSection.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  public componentDidUpdate(prevProps: IWorkListProps) {
    if (
      !this.state.currentTemplate &&
      this.props.profile.worklistTemplates !==
        prevProps.profile.worklistTemplates
    ) {
      this.setState({
        currentTemplate: this.props.profile.worklistTemplates[0],
      });
    }

    if (
      this.props.profile.worklist !== prevProps.profile.worklist &&
      this.props.profile.worklist.length &&
      this.state.openedSections.length === 0
    ) {
      this.toggleSection(this.props.profile.worklist.length - 1, null);
    }
  }

  /**
   * insertNew
   * @param data data
   * @param data.description description
   * @param data.date date
   * @param data.price price
   * @param data.factor factor
   * @param data.billingNumber billingNumber
   */
  public async insertNew(data: {
    description: string;
    date: string;
    price: number;
    factor: number;
    billingNumber: number;
  }) {
    return new Promise<boolean>((resolve) => {
      this.props.insertProfileWorklistItem({
        templateId: this.state.currentTemplate.id,
        entryDate: data.date,
        price: data.price,
        factor: data.factor,
        description: data.description,
        billingNumber: data.billingNumber,
        /**
         * success
         */
        success: () => resolve(true),
        /**
         * fail
         */
        fail: () => resolve(false),
      });
    });
  }

  /**
   * onFormSubmit
   * @param e e
   */
  public onFormSubmit(e: React.FormEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  /**
   * toggleSection
   * @param index index
   * @param e e
   */
  public toggleSection(index: number, e: React.MouseEvent) {
    e && e.stopPropagation();
    e && e.preventDefault();

    this.props.loadProfileWorklistSection(index);
    const sectionToOpen = this.props.profile.worklist[index];
    const hasItInIt = this.state.openedSections.some(
      (n) => n === sectionToOpen.summary.beginDate
    );
    if (!hasItInIt) {
      this.setState({
        openedSections: [
          ...this.state.openedSections,
          sectionToOpen.summary.beginDate,
        ],
      });
    } else {
      this.setState({
        openedSections: this.state.openedSections.filter(
          (s) => s !== sectionToOpen.summary.beginDate
        ),
      });
    }
  }

  /**
   * onSelect
   * @param e e
   */
  public onSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const newTemplate = this.props.profile.worklistTemplates.find(
      (t) => t.id.toString() === e.target.value
    );
    this.setState({
      currentTemplate: newTemplate,
    });
  }

  /**
   * render
   */
  public render() {
    if (
      this.props.profile.location !== "work" ||
      !this.props.status.permissions.WORKLIST_AVAILABLE
    ) {
      return null;
    }

    // let's get the first day of the previous month
    const previousMonthsFirstDay = moment()
      .subtract(1, "months")
      .startOf("month");

    // let's get the first day of the current month
    const currentMonthsFirstDay = moment().startOf("month");

    const sections =
      this.props.profile.worklist &&
      this.props.profile.worklist.map((section, index) => (
        <WorkListSection
          currentMonthDayLimit={currentMonthDayLimit}
          currentMonthsFirstDay={currentMonthsFirstDay}
          daysInCurrentMonth={daysInCurrentMonth}
          isExpanded={this.state.openedSections.includes(
            section.summary.beginDate
          )}
          onToggleSection={this.toggleSection.bind(this, index)}
          previousMonthsFirstDay={previousMonthsFirstDay}
          section={section}
          key={section.summary.beginDate}
        />
      ));

    return (
      <section>
        <form onSubmit={this.onFormSubmit} className="form">
          <h2 className="application-panel__content-header">
            {this.props.t("labels.worklist", { ns: "profile" })}
          </h2>
          <div className="application-sub-panel application-sub-panel--worklist">
            <h3 className="application-sub-panel__header">
              {this.props.t("labels.create", { ns: "worklist" })}
            </h3>
            <div className="application-sub-panel__body">
              <div className="form__row">
                <WorkListEditable
                  base={this.state.currentTemplate}
                  currentMonthDayLimit={currentMonthDayLimit}
                  onSubmit={this.insertNew}
                  isEditMode={false}
                  resetOnSubmit={true}
                >
                  <select
                    className="form-element__select form-element__select--worklist-template"
                    value={
                      (this.state.currentTemplate &&
                        this.state.currentTemplate.id) ||
                      ""
                    }
                    onChange={this.onSelect}
                  >
                    {this.props.profile.worklistTemplates &&
                      this.props.profile.worklistTemplates.map((v) => (
                        <option value={v.id} key={v.id}>
                          {v.description}
                        </option>
                      ))}
                  </select>
                </WorkListEditable>
              </div>
            </div>
          </div>
          <div className="application-sub-panel__panels-wrapper">
            <h3 className="application-sub-panel__header">
              {this.props.t("labels.entries", { ns: "worklist" })}
            </h3>
            {sections && sections.reverse()}
          </div>
        </form>
      </section>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    profile: state.profile,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { insertProfileWorklistItem, loadProfileWorklistSection },
    dispatch
  );
}

export default withTranslation(["worklist"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkList)
);
