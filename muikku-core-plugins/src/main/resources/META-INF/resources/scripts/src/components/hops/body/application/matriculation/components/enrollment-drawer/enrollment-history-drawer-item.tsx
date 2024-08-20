import * as React from "react";
import AnimateHeight from "react-animate-height";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import {
  ApplicationListItem,
  ApplicationListItemBody,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import { StateType } from "~/reducers";
import { MatriculationExamWithHistory } from "~/reducers/hops";
import {
  LoadMatriculationExamHistoryTriggerType,
  loadMatriculationExamHistory,
} from "../../../../../../../actions/main-function/hops/index";
import { History } from "./history";

/**
 * MatriculationEnrollmentDrawerListItemProps
 */
interface MatriculationEnrollmentDrawerListItemProps {
  exam: MatriculationExamWithHistory;
  loadMatriculationExamHistory: LoadMatriculationExamHistoryTriggerType;
}

/**
 * MatriculationEnrollmentDrawerListItem
 * @param props props
 */
const MatriculationEnrollmentDrawerListItem = (
  props: MatriculationEnrollmentDrawerListItemProps
) => {
  const { exam, loadMatriculationExamHistory } = props;

  const [isOpen, setIsOpen] = React.useState(false);

  const headerTitle = `${exam.term} ${exam.year}`;

  /**
   * toggleDrawer
   */
  const handleToggleDrawerClick = () => {
    if (exam.status === "IDLE") {
      loadMatriculationExamHistory(exam.id);
    }

    setIsOpen(!isOpen);
  };

  return (
    <ApplicationListItem>
      <ApplicationListItemHeader
        tabIndex={0}
        role="button"
        className="application-list__item-header--course"
        onClick={handleToggleDrawerClick}
      >
        <span className={`application-list__header-icon icon-books`}></span>
        <span className="application-list__header-primary">{headerTitle}</span>
      </ApplicationListItemHeader>
      <ApplicationListItemBody className="application-list__item-body--course">
        <AnimateHeight duration={400} height={isOpen ? "auto" : 0}>
          {exam.status !== "READY" ? (
            <div className="loader-empty"></div>
          ) : (
            <History entryLogs={exam.changeLogs} />
          )}
        </AnimateHeight>
      </ApplicationListItemBody>
    </ApplicationListItem>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ loadMatriculationExamHistory }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationEnrollmentDrawerListItem);
