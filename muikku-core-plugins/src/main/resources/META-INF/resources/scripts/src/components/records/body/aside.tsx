import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { TranscriptOfRecordLocationType, RecordsType } from '~/reducers/main-function/records';
import { StateType } from '~/reducers';
import NavigationMenu, { NavigationTopic, NavigationElement } from '~/components/general/navigation';
import { HOPSType } from '~/reducers/main-function/hops';
import { StatusType } from '~/reducers/base/status';

interface NavigationProps {
  i18n: i18nType,
  location: TranscriptOfRecordLocationType,
  hops: HOPSType,
  status: StatusType,
  records: RecordsType
}

interface NavigationState {
}

class Navigation extends React.Component<NavigationProps, NavigationState> {

  constructor(props: NavigationProps) {
    super(props);
  }

  /**
   * Returns whether section with given hash should be visible or not
   *
   * @param hash section hash
   * @return whether section with given hash should be visible or not
   */
  isVisible(hash: string) {
    switch (hash) {
      case "hops":
        return this.props.status.isActiveUser && !this.props.records.studyEndDate && this.props.hops.eligibility && this.props.hops.eligibility.upperSecondarySchoolCurriculum === true;
      case "vops":
      case "yo":
        const yoVisibleValues = ["yes", "maybe"];
        return this.props.status.isActiveUser && this.props.hops.value && yoVisibleValues.indexOf(this.props.hops.value.goalMatriculationExam) > -1 && !this.props.records.studyEndDate;

    }

    return true;
  }

  render() {
    let sections = [
      {
        name: this.props.i18n.text.get("plugin.records.category.summary"),
        hash: "summary"
      },
      {
        name: this.props.i18n.text.get("plugin.records.category.records"),
        hash: "records"
      },
      {
        name: this.props.i18n.text.get("plugin.records.category.hops"),
        hash: "hops"
      },
      {
        name: this.props.i18n.text.get("plugin.records.category.yo"),
        hash: "yo"
      }
    ]

    return (
      <NavigationMenu>
        {sections.filter(section => this.isVisible(section.hash)).map((item, index) => {
          return <NavigationElement isActive={this.props.location === item.hash} hash={item.hash} key={index}
          >{item.name}</NavigationElement>
        })}
      </NavigationMenu>
    )
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    location: state.records.location,
    hops: state.hops,
    records: state.records,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
