import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { InsertProfileWorklistItemTriggerType, insertProfileWorklistItem, loadProfileWorklistSection, LoadProfileWorklistSectionTriggerType } from "~/actions/main-function/profile";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { ProfileType, WorklistTemplate } from "~/reducers/main-function/profile";
import WorkListEditable from "./components/work-list-editable";
import WorkListRow from "./components/work-list-row";
import { ButtonPill } from '~/components/general/button';
import moment from "~/lib/moment";
import Link from '~/components/general/link';
import SubmitWorklistItemsDialog from "../../dialogs/submit-worklist-items";

interface IWorkListProps {
  i18n: i18nType,
  profile: ProfileType;
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
    }

    this.insertNew = this.insertNew.bind(this);
    this.toggleSection = this.toggleSection.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  public componentDidUpdate(prevProps: IWorkListProps) {
    if (!this.state.currentTemplate && this.props.profile.worklistTemplates !== prevProps.profile.worklistTemplates) {
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
    const hasItInIt = this.state.openedSections.some((n) => n === sectionToOpen.summary.beginDate);
    if (!hasItInIt) {
      this.setState({
        openedSections: [...this.state.openedSections, sectionToOpen.summary.beginDate],
      });
    } else {
      this.setState({
        openedSections: this.state.openedSections.filter((s) => s !== sectionToOpen.summary.beginDate),
      });
    }
  }

  public onSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const newTemplate = this.props.profile.worklistTemplates.find((t) => t.id.toString() === e.target.value);
    this.setState({
      currentTemplate: newTemplate,
    });
  }

  public render() {
    if (this.props.profile.location !== "work") {
      return null;
    }

    const sectionLabels = (<div className="application-sub-panel__multiple-items application-sub-panel__multiple-items--list-mode application-sub-panel__multiple-items--item-labels">
      <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-description">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--worklist-list-mode">{this.props.i18n.text.get("plugin.profile.worklist.description.label")}</label>
      </div>
      <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-date">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--worklist-list-mode">{this.props.i18n.text.get("plugin.profile.worklist.date.label")}</label>
      </div>
      <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-price">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--worklist-list-mode">{this.props.i18n.text.get("plugin.profile.worklist.price.label")}</label>
      </div>
      <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-factor">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--worklist-list-mode">{this.props.i18n.text.get("plugin.profile.worklist.factor.label")}</label>
      </div>
      <div className="application-sub-panel__multiple-item-container  application-sub-panel__multiple-item-container--worklist-actions">
      </div>
    </div>);

    const lastMonthFirstDay = moment().subtract(1, 'months').startOf("month");

    const sections = (
      this.props.profile.worklist && this.props.profile.worklist.map((section, index) => {
        const isOpen = this.state.openedSections.includes(section.summary.beginDate);
        const hasData = !!section.items;

        const entries = isOpen && hasData ? (
          section.items.map((item) => {
            return (
              <WorkListRow key={item.id} item={item}/>
            );
          })
        ) : null;

        const sectionIsLastMonth = moment(section.summary.beginDate).isSame(lastMonthFirstDay);
        const submitLastMonthButton = (
          sectionIsLastMonth ?
          <SubmitWorklistItemsDialog summary={section.summary}>
            <Link>{this.props.i18n.text.get("plugin.profile.submit.month")}</Link>
          </SubmitWorklistItemsDialog> :
          null
        )

        return (
          <div key={section.summary.beginDate} className="application-sub-panel application-sub-panel--worklist">
            <h3 onClick={this.toggleSection.bind(this, index)} className="application-sub-panel__header application-sub-panel__header--worklist-entries">
              <ButtonPill buttonModifiers="expand-worklist" icon={isOpen ? "arrow-down" : "arrow-right"} as="span" />
              <span>{section.summary.displayName} ({section.summary.count})</span>
              {submitLastMonthButton}
            </h3>
            <div className="application-sub-panel__body">
              {isOpen && sectionLabels}
              {entries && entries.reverse()}
            </div>
          </div>
        );
      })
    );

    return <section>
      <form onSubmit={this.onFormSubmit}>
        <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.worklist')}</h2>
        <div className="application-sub-panel application-sub-panel--worklist">
          <h3 className="application-sub-panel__header">{this.props.i18n.text.get('plugin.profile.worklist.addNewEntry')}</h3>
          <div className="application-sub-panel__body">
            <WorkListEditable
              base={this.state.currentTemplate}
              onSubmit={this.insertNew}
              isEditMode={false}
              resetOnSubmit={true}>
              <select
                className="form-element__select form-element__select--worklist-template"
                value={(this.state.currentTemplate && this.state.currentTemplate.id) || ""}
                onChange={this.onSelect}>
                {this.props.profile.worklistTemplates && this.props.profile.worklistTemplates.map((v) => {
                  return (
                    <option value={v.id} key={v.id}>
                      {v.description}
                    </option>
                  );
                })}
              </select>
            </WorkListEditable>
          </div>
        </div>
        {sections && sections.reverse()}
      </form>
    </section>;
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    profile: state.profile,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({insertProfileWorklistItem, loadProfileWorklistSection}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkList);
