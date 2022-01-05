import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import {
  InsertProfileWorklistItemTriggerType,
  insertProfileWorklistItem,
  loadProfileWorklistSection,
  LoadProfileWorklistSectionTriggerType,
} from "~/actions/main-function/profile";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import {
  ProfileType,
  WorklistTemplate,
} from "~/reducers/main-function/profile";
import WorkListEditable from "./components/work-list-editable";
import moment from "~/lib/moment";
import { StatusType } from "~/reducers/base/status";
import { WorkListSection } from "./components/work-list-section";

// we use these
const today = moment();
const daysInCurrentMonth = today.date();

// This sets the date limit of the current month when it is not possible to add new entries to the previous month
const currentMonthDayLimit = 10;

interface IWorkListProps {
  i18n: i18nType;
  profile: ProfileType;
  status: StatusType;
  insertProfileWorklistItem: InsertProfileWorklistItemTriggerType;
  loadProfileWorklistSection: LoadProfileWorklistSectionTriggerType;
}

interface IWorkListState {
  currentTemplate: WorklistTemplate;
  openedSections: string[];
}

class WorkList extends React.Component<IWorkListProps, IWorkListState> {
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
        success: () => resolve(true),
        fail: () => resolve(false),
      });
    });
  }

  public onFormSubmit(e: React.FormEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

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

  public onSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const newTemplate = this.props.profile.worklistTemplates.find(
      (t) => t.id.toString() === e.target.value
    );
    this.setState({
      currentTemplate: newTemplate,
    });
  }

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
          i18n={this.props.i18n}
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
        <form onSubmit={this.onFormSubmit}>
          <h2 className="application-panel__content-header">
            {this.props.i18n.text.get("plugin.profile.titles.worklist")}
          </h2>
          <div className="application-sub-panel application-sub-panel--worklist">
            <h3 className="application-sub-panel__header">
              {this.props.i18n.text.get("plugin.profile.worklist.addNewEntry")}
            </h3>
            <div className="application-sub-panel__body">
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
          <div className="application-sub-panel__panels-wrapper">
            <h3 className="application-sub-panel__header">
              {this.props.i18n.text.get("plugin.profile.worklist.addedEntries")}
            </h3>
            {sections && sections.reverse()}
          </div>
        </form>
      </section>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    profile: state.profile,
    status: state.status,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { insertProfileWorklistItem, loadProfileWorklistSection },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkList);
