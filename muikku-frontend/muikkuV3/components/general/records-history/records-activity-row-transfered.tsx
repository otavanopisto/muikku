import * as React from "react";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "../application-list";
import TransferedCreditIndicator from "./transfered-credit-indicator";
import { StudyActivityItem } from "~/generated/client";

/**
 * RecordsActivityRowTransferedProps
 */
interface RecordsActivityRowTransferedProps {
  studyActivityItem: StudyActivityItem;
}

/**
 * RecordsActivityRowTransfered
 * @param props props
 */
const RecordsActivityRowTransfered = (
  props: RecordsActivityRowTransferedProps
) => {
  const { studyActivityItem } = props;
  return (
    <ApplicationListItem className="course course--credits">
      <ApplicationListItemHeader modifiers="course">
        <span className="application-list__header-icon icon-books"></span>
        <div className="application-list__header-primary">
          <div className="application-list__header-primary-title">
            {studyActivityItem.courseName}
          </div>
          <div className="application-list__header-primary-meta application-list__header-primary-meta--records">
            <div className="label">
              <div className="label__text">
                {studyActivityItem.studyProgramme}
              </div>
            </div>
            {studyActivityItem.curriculums?.map((curriculum) => (
              <div key={curriculum} className="label">
                <div className="label__text">{curriculum} </div>
              </div>
            ))}
          </div>
        </div>
        <div className="application-list__header-secondary">
          <TransferedCreditIndicator studyActivityItem={studyActivityItem} />
        </div>
      </ApplicationListItemHeader>
    </ApplicationListItem>
  );
};

export default RecordsActivityRowTransfered;
