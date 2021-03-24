import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { ProfileType, WorklistTemplate } from "~/reducers/main-function/profile";
import WorkListEditable from "./components/work-list-editable";

interface IWorkListProps {
  i18n: i18nType,
  profile: ProfileType;
}

interface IWorkListState {
  currentTemplate: WorklistTemplate;
}

class WorkList extends React.Component<IWorkListProps, IWorkListState> {
  constructor(props: IWorkListProps) {
    super(props);

    this.state = {
      currentTemplate: null,
    }

    this.insertNew = this.insertNew.bind(this);
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
    console.log(data);
    return true;
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

    return <section>
      <form>
        <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.worklist')}</h2>
        <div className="application-sub-panel">
          <div className="application-sub-panel__body">
            <h3 className="application-sub-panel__header">{this.props.i18n.text.get('plugin.profile.worklist.addNewEntry')}</h3>
            <WorkListEditable
              base={this.state.currentTemplate}
              onSubmit={this.insertNew}
              resetOnSubmit={true}>
              <select className="form-element__select form-element__select--worklist-template" value={this.state.currentTemplate && this.state.currentTemplate.id} onChange={this.onSelect}>
                {this.props.profile.worklistTemplates && this.props.profile.worklistTemplates.map((v) => {
                  return (
                    <option value={v.id} key={v.id} selected={v.id === (this.state.currentTemplate && this.state.currentTemplate.id)}>
                      {v.description}
                    </option>
                  );
                })}
              </select>
            </WorkListEditable>
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

function mapDispatchToProps(dispatch: React.Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkList);
