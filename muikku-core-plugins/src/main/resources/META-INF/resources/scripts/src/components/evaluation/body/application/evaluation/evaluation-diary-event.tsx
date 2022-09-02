import * as React from "react";
import * as moment from "moment";
import AnimateHeight from "react-animate-height";
import { WorkspaceJournalType } from "~/reducers/workspaces/index";
import "~/sass/elements/rich-text.scss";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventProps extends WorkspaceJournalType {
  open: boolean;
  onClickOpen?: (diaryId: number) => void;
}

/**
 * Creates evaluation diary event component
 *
 * @param props props
 * @returns JSX.Element
 */
const EvaluationDiaryEvent: React.FC<EvaluationDiaryEventProps> = (props) => {
  const { title, content, created, open, onClickOpen, id } = props;

  const [height, setHeight] = React.useState<0 | "auto">(0);

  React.useEffect(() => {
    const openAsHeight = open ? "auto" : 0;
    setHeight(openAsHeight);
  }, [open]);

  /**
   * handleOpenContentClick
   */
  const handleOpenContentClick = () => {
    if (onClickOpen) {
      onClickOpen(id);
    } else {
      setHeight(height === 0 ? "auto" : 0);
    }
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
        <div className="evaluation-modal__item-body rich-text">
          <CkeditorContentLoader html={content} />
        </div>
      </AnimateHeight>
    </div>
  );
};

export default EvaluationDiaryEvent;
