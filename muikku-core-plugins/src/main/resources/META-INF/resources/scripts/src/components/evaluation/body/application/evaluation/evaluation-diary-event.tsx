import * as React from "react";
import * as moment from "moment";
import AnimateHeight from "react-animate-height";
import { WorkspaceJournalType } from "~/reducers/workspaces/index";
import "~/sass/elements/rich-text.scss";
/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventProps extends WorkspaceJournalType {
  open: boolean;
  onClickOpen?: (diaryId: number) => void;
}

/**
 * EvaluationEventContentCard
 */
const EvaluationDiaryEvent: React.FC<EvaluationDiaryEventProps> = ({
  title,
  content,
  created,
  open,
  onClickOpen,
  id
}) => {
  const [height, setHeight] = React.useState<0 | "auto">(0);

  React.useEffect(() => {
    const openAsHeight = open ? "auto" : 0;
    if (openAsHeight !== height) {
      setHeight(openAsHeight);
    }
  }, [open]);

  /**
   * createHtmlMarkup
   * This should sanitize html
   * @param htmlString string that contains html
   */
  const createHtmlMarkup = (htmlString: string) => {
    return {
      __html: htmlString
    };
  };

  /**
   * handleOpenContentClick
   */
  const handleOpenContentClick = () => {
    if (onClickOpen) {
      onClickOpen(id);
    }
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

export default EvaluationDiaryEvent;
