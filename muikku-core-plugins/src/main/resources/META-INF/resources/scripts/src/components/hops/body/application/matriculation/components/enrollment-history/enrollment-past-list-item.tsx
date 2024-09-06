import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemBody,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import { MatriculationExamWithHistory } from "~/reducers/hops";
import {
  LoadMatriculationExamHistoryTriggerType,
  loadMatriculationExamHistory,
} from "../../../../../../../actions/main-function/hops/index";
import { ChangeLog } from "./enrollment-change-log";
import MatriculationEnrollment from "../matriculation-enrollment";

/**
 * MatriculationPastEnrollmentProps
 */
interface MatriculationPastListItemProps {
  exam: MatriculationExamWithHistory;
  loadMatriculationExamHistory: LoadMatriculationExamHistoryTriggerType;
}

/**
 * MatriculationPastEnrollment
 * @param props props
 */
const MatriculationPastListItem = (props: MatriculationPastListItemProps) => {
  const { exam, loadMatriculationExamHistory } = props;

  const { t } = useTranslation(["hops_new", "common"]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);

  const headerTitle = t(`matriculationTerms.${exam.term}`, {
    ns: "hops_new",
    year: exam.year,
  });

  /**
   * toggleDrawer
   */
  const handleToggleDrawerClick = () => {
    if (exam.status === "IDLE") {
      loadMatriculationExamHistory(exam.id);
    }

    setIsOpen(!isOpen);
  };

  /**
   * handleToggleHistoryClick
   */
  const handleToggleHistoryClick = () => {
    setShowHistory(!showHistory);
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
      <ApplicationListItemBody>
        <AnimateHeight duration={400} height={isOpen ? "auto" : 0}>
          <ApplicationSubPanel>
            <ApplicationSubPanel>
              <MatriculationEnrollment exam={exam} past />
            </ApplicationSubPanel>
            <ApplicationSubPanel>
              <ApplicationList>
                <ApplicationListItem>
                  <ApplicationListItemHeader
                    tabIndex={0}
                    role="button"
                    className="application-list__item-header--course"
                    onClick={handleToggleHistoryClick}
                  >
                    {t("actions.showChangeLog", { ns: "hops_new" })}
                  </ApplicationListItemHeader>
                  <ApplicationListItemBody>
                    <AnimateHeight
                      duration={400}
                      height={showHistory ? "auto" : 0}
                    >
                      {props.exam.status === "LOADING" ? (
                        <div className="loader-empty" />
                      ) : (
                        <ChangeLog entryLogs={exam.changeLogs} />
                      )}
                    </AnimateHeight>
                  </ApplicationListItemBody>
                </ApplicationListItem>
              </ApplicationList>
            </ApplicationSubPanel>
          </ApplicationSubPanel>
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
)(MatriculationPastListItem);
