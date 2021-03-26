import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { InsertProfileWorklistItemTriggerType, insertProfileWorklistItem, loadProfileWorklistSection, LoadProfileWorklistSectionTriggerType } from "~/actions/main-function/profile";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { ProfileType, WorklistTemplate } from "~/reducers/main-function/profile";
import WorkListEditable from "./components/work-list-editable";
import WorkListRow from "./components/work-list-row";

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
  }

  public async insertNew(data: {
    description: string;
    date: string;
    price: number;
    factor: number;
  }) {
    return new Promise<boolean>((resolve) => {
      this.props.insertProfileWorklistItem({
        templateId: this.state.currentTemplate.id,
        entryDate: data.date,
        price: data.price,
        factor: data.factor,
        description: data.description,
        success: () => resolve(true),
        fail: () => resolve(false),
      });
    });
  }

  public toggleSection(index: number) {
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

        return (
          <div key={section.summary.beginDate}>
            <button onClick={this.toggleSection.bind(this, index)}>{section.summary.displayName}</button>
            {entries && entries.reverse()}
          </div>
        );
      })
    );

    return <section>
      <form>
        <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.worklist')}</h2>
        <div className="application-sub-panel">
          <div className="application-sub-panel__body">
            <h3 className="application-sub-panel__header">{this.props.i18n.text.get('plugin.profile.worklist.addNewEntry')}</h3>
            <WorkListEditable
              base={this.state.currentTemplate}
              onSubmit={this.insertNew}
              resetOnSubmit={true}
              submitIcon="plus"
            >
              <select
                className="form-element__select form-element__select--worklist-template"
                value={(this.state.currentTemplate && this.state.currentTemplate.id) || ""}
                onChange={this.onSelect}
              >
                {this.props.profile.worklistTemplates && this.props.profile.worklistTemplates.map((v) => {
                  return (
                    <option value={v.id} key={v.id}>
                      {v.description}
                    </option>
                  );
                })}
              </select>
            </WorkListEditable>

            {sections && sections.reverse()}
          </div>
        </div>
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
