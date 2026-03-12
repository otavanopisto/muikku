import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { displayNotification } from "~/actions/base/notifications";
import { updateCurrentDependantSelectedEducationTypeCode } from "~/actions/main-function/guardian";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import RecordsListing from "~/components/general/records-history/records";
import RecordsEducationTypeSelector from "~/components/general/records-history/records-education-type-selector";
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

  const currentDependantStudyData =
    currentDependant.dependantStudyDataByEducationTypeCode[
      currentDependant.dependantSelectedEducationTypeCode
    ] ?? null;

  if (
    currentDependantStudyData === null ||
    currentDependantStudyData.studyActivityStatus === "LOADING" ||
    currentDependantStudyData.studyActivityStatus === "IDLE" ||
    currentDependantStudyData.courseMatrixStatus === "LOADING" ||
    currentDependantStudyData.courseMatrixStatus === "IDLE" ||
    currentDependantStudyData.curriculumConfigStatus === "LOADING" ||
    currentDependantStudyData.curriculumConfigStatus === "IDLE"
  ) {
    return null;
  } else if (
    currentDependantStudyData.studyActivityStatus === "ERROR" ||
    currentDependantStudyData.courseMatrixStatus === "ERROR"
  ) {
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
   * Handles the selection of an education type
   * @param educationTypeCode educationTypeCode
   */
  const handleSelectEducationType = (educationTypeCode: string) => {
    dispatch(
      updateCurrentDependantSelectedEducationTypeCode(educationTypeCode)
    );
  };

  /**
   * studentRecords
   */
  const studentRecords = (
    <ApplicationSubPanel>
      <ApplicationSubPanel.Body>
        <RecordsListing
          recordsInfo={{
            identifier: status.userSchoolDataIdentifier,
            userEntityId: status.userId,
            displayNotification: dispatch(displayNotification),
            studyActivity: currentDependantStudyData.studyActivity,
            courseMatrix: currentDependantStudyData.courseMatrix,
            curriculumConfig: currentDependantStudyData.curriculumConfig,
            config: {
              showAssigmentsAndDiaries: false,
            },
          }}
          emptyMessage={t("content.empty", {
            ns: "studies",
            context: "workspaces-guardian",
          })}
          educationTypeSelector={
            <RecordsEducationTypeSelector
              options={currentDependant.dependantEducationTypes.map(
                (educationTypeCode) => ({
                  educationTypeCode,
                  label: educationTypeCode,
                })
              )}
              selectedEducationTypeCode={
                currentDependant.dependantSelectedEducationTypeCode
              }
              onSelect={handleSelectEducationType}
            />
          }
        />
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
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
