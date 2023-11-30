import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import {
  TranscriptOfRecordLocationType,
  RecordsType,
} from "~/reducers/main-function/records";
import { StateType } from "~/reducers";
import NavigationMenu, {
  NavigationElement,
} from "~/components/general/navigation";
import { HOPSState } from "~/reducers/main-function/hops";
import { StatusType } from "~/reducers/base/status";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * NavigationProps
 */
interface NavigationProps extends WithTranslation {
  location: TranscriptOfRecordLocationType;
  hops: HOPSState;
  status: StatusType;
  records: RecordsType;
}

/**
 * Navigation
 */
class Navigation extends React.Component<
  NavigationProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: NavigationProps) {
    super(props);
  }

  /**
   * Returns whether section with given hash should be visible or not
   *
   * @param hash section hash
   * @returns boolean whether section with given hash should be visible or not
   */
  isVisible(hash: string) {
    switch (hash) {
      case "hops":
        return (
          this.props.status.isActiveUser &&
          this.props.hops.eligibility &&
          this.props.hops.eligibility.upperSecondarySchoolCurriculum === true
        );
      case "vops":
      case "yo":
        return (
          this.props.status.isActiveUser &&
          this.props.hops.value &&
          (this.props.hops.value.goalMatriculationExam === "yes" ||
            this.props.hops.value.goalMatriculationExam === "maybe")
        );
    }

    return true;
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;

    const sections = [
      {
        name: t("labels.summary", { ns: "studies" }),
        hash: "summary",
      },
      {
        name: t("labels.records", { ns: "studies" }),
        hash: "records",
      },
      {
        name: t("labels.hops", { ns: "studies" }),
        hash: "hops",
      },
      {
        name: t("labels.matriculationExams", { ns: "studies" }),
        hash: "yo",
      },
    ];

    return (
      <NavigationMenu>
        {sections
          .filter((section) => this.isVisible(section.hash))
          .map((item, index) => (
            <NavigationElement
              isActive={this.props.location === item.hash}
              hash={item.hash}
              key={index}
            >
              {item.name}
            </NavigationElement>
          ))}
      </NavigationMenu>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    location: state.records.location,
    hops: state.hops,
    records: state.records,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["studies", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
