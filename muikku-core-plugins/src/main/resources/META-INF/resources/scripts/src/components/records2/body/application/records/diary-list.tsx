import * as React from "react";
import * as moment from "moment";
import { EvaluationStudyDiaryEvent } from "../../../../../@types/evaluation";
import { WorkspaceJournalType } from "../../../../../reducers/workspaces/index";
import AnimateHeight from "react-animate-height";
import { i18nType } from "~/reducers/base/i18n";
import { useDiary } from "./hooks/use-diary";
import "~/sass/elements/records.scss";

/**
 * DiaryListProps
 */
interface DiaryListProps {
  userEntityId: number;
  workspaceEntityId: number;
  i18n: i18nType;
}

/**
 * DiaryList
 * @returns JSX.Element
 */
export const DiaryList: React.FC<DiaryListProps> = ({
  i18n,
  userEntityId,
  workspaceEntityId,
}) => {
  const { loadingDiary, diaryData, serverError } = useDiary(
    userEntityId,
    workspaceEntityId
  );

  /**
   * Renders content depending of state of useDiary hook
   */
  let renderContent: JSX.Element | JSX.Element[] = (
    <div className="empty">
      <span>
        {i18n.text.get("plugin.evaluation.evaluationModal.noJournals")}
      </span>
    </div>
  );

  if (loadingDiary) {
    renderContent = <div className="loader-empty" />;
  } else if (serverError) {
    renderContent = (
      <div className="empty">
        <span>Error</span>
      </div>
    );
  } else if (diaryData.length > 0) {
    renderContent = diaryData.map((item) => {
      return <DiaryListItem key={item.id} i18n={i18n} {...item} />;
    });
  }

  return <div>{renderContent}</div>;
};

/**
 * DiaryListItemProps
 */
interface DiaryListItemProps extends WorkspaceJournalType {
  i18n: i18nType;
}

/**
 * DiaryListItem
 * @returns JSX.Element
 */
export const DiaryListItem: React.FC<DiaryListItemProps> = ({
  title,
  content,
  created,
  id,
}) => {
  const [height, setHeight] = React.useState<0 | "auto">(0);

  React.useEffect(() => {
    const openAsHeight = open ? "auto" : 0;
    if (openAsHeight !== height) {
      setHeight(openAsHeight);
    }
  }, [open]);

  /**
   * handleOpenContentClick
   */
  const handleOpenContentClick = () => {
    setHeight(height === 0 ? "auto" : 0);
  };

  const formatedDate = `${moment(created).format("l")} - ${moment(
    created
  ).format("LT")} `;

  return (
    <div className="evaluation-modal__item">
      <div className="evaluation-modal__item-header">
        <div
          className="evaluation-modal__item-header-title evaluation-modal__item-header-title--journal"
          onClick={handleOpenContentClick}
        >
          {title}
          <div className="evaluation-modal__item-meta">
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                Kirjoitettu
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {formatedDate}
              </span>
            </div>
          </div>
        </div>
      </div>
      <AnimateHeight duration={500} height={height}>
        <div
          className="evaluation-modal__item-body rich-text"
          dangerouslySetInnerHTML={createHtmlMarkup(content)}
        />
      </AnimateHeight>
    </div>
  );
};

/**
 * createHtmlMarkup
 * This should sanitize html
 * @param htmlString string that contains html
 */
const createHtmlMarkup = (htmlString: string) => {
  return {
    __html: htmlString,
  };
};
