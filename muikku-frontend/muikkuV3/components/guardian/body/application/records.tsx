import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { displayNotification } from "~/actions/base/notifications";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import { RecordsInfoProvider } from "~/components/general/records-history/context/records-info-context";
import { RecordsGroup } from "~/components/general/records-history/records-group";
import { StateType } from "~/reducers";

/**
 * RecordsProps
 */
interface RecordsProps {}

/**
 * Guardian Records Component
 * @param props props
 * @returns Records
 */
const Records = (props: RecordsProps) => {
  const { t } = useTranslation(["studies"]);
  const status = useSelector((state: StateType) => state.status);
  const currentDependant = useSelector(
    (state: StateType) => state.guardian.currentDependant
  );
  const dispatch = useDispatch();
  if (
    currentDependant.dependantStudyActivityStatus === "LOADING" ||
    currentDependant.dependantStudyActivityStatus === "IDLE"
  ) {
    return null;
  } else if (currentDependant.dependantStudyActivityStatus === "ERROR") {
    return (
      <div className="empty">
        <span>
          {t("content.empty", {
            ns: "studies",
            context: "records",
          })}
        </span>
      </div>
    );
  }

  /**
   * studentRecords
   */
  const studentRecords = (
    <RecordsInfoProvider
      value={{
        identifier: status.userSchoolDataIdentifier,
        userEntityId: status.userId,
        displayNotification: dispatch(displayNotification),
        config: {
          showAssigmentsAndDiaries: false,
        },
      }}
    >
      <ApplicationSubPanel>
        <ApplicationSubPanel.Body>
          {currentDependant.dependantStudyActivity ? (
            <RecordsGroup
              studyActivity={currentDependant.dependantStudyActivity}
            />
          ) : (
            <div className="application-sub-panel__item">
              <div className="empty">
                <span>
                  {t("content.empty", {
                    ns: "studies",
                    context: "workspaces-guardian",
                  })}
                </span>
              </div>
            </div>
          )}
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>
    </RecordsInfoProvider>
  );

  return (
    <BodyScrollKeeper hidden={false}>
      <h2 className="application-panel__content-header">
        {t("labels.records", { ns: "studies" })}
      </h2>
      {studentRecords}
    </BodyScrollKeeper>
  );
};

export default Records;
