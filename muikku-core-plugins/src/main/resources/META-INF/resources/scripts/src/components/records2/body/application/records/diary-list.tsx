import * as React from "react";
import * as moment from "moment";
import { EvaluationStudyDiaryEvent } from "../../../../../@types/evaluation";
import { WorkspaceJournalType } from "../../../../../reducers/workspaces/index";
import AnimateHeight from "react-animate-height";
import { i18nType } from "~/reducers/base/i18n";
import { useDiary } from "./hooks/use-diary";
import "~/sass/elements/records.scss";
import Link from "~/components/general/link";

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
  const [diariesOpen, setDiariesOpen] = React.useState<number[]>([]);
  const { loadingDiary, diaryData, serverError } = useDiary(
    userEntityId,
    workspaceEntityId
  );

  /**
   * handlekOpenAllMaterialsClick
   */
  const handlekOpenAllDiaryEntriesClick = () => {
    const listOfDiaryIds = diaryData.map((aItem) => aItem.id);

    setDiariesOpen(listOfDiaryIds);
  };

  /**
   * handleCloseAllMaterialsClick
   */
  const handleCloseAllDiaryEntriesClick = () => {
    setDiariesOpen([]);
  };

  /**
   * updateMaterialsOpened
   * @param materialId
   */
  const updateDiariesOpened = (materialId: number) => {
    let diariesIds = [...diariesOpen];

    const indexOfMaterialId = diariesIds.findIndex(
      (item) => item === materialId
    );

    if (indexOfMaterialId !== -1) {
      diariesIds.splice(indexOfMaterialId, 1);
      setDiariesOpen(diariesIds);
    } else {
      diariesIds.push(materialId);
      setDiariesOpen(diariesIds);
    }
  };

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
      const isOpen = diariesOpen.includes(item.id);

      return (
        <DiaryListItem
          key={item.id}
          i18n={i18n}
          updateEntryOpen={updateDiariesOpened}
          open={isOpen}
          {...item}
        />
      );
    });
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Päiväkirjamerkinnät</h2>
        <div>
          <Link onClick={handlekOpenAllDiaryEntriesClick}>Avaa kaikki</Link>
          <Link onClick={handleCloseAllDiaryEntriesClick}>Sulje kaikki</Link>
        </div>
      </div>
      <div
        style={{ overflowY: "scroll", maxHeight: "600px", minHeight: "600px" }}
      >
        {renderContent}
      </div>
    </>
  );
};

/**
 * DiaryListItemProps
 */
interface DiaryListItemProps extends WorkspaceJournalType {
  i18n: i18nType;
  open: boolean;
  updateEntryOpen?: (diaryId: number) => void;
}

/**
 * DiaryListItem
 * @returns JSX.Element
 */
export const DiaryListItem: React.FC<DiaryListItemProps> = ({
  title,
  content,
  created,
  open,
  updateEntryOpen,
  id,
}) => {
  const [openContent, setOpenContent] = React.useState(false);

  React.useEffect(() => {
    if (openContent !== open) {
      setOpenContent(open);
    }
  }, [open]);

  /**
   * handleOpenContentClick
   */
  const handleOpenContentClick = () => {
    if (updateEntryOpen) {
      updateEntryOpen(id);
    }

    setOpenContent(!openContent);
  };

  const formatedDate = `${moment(created).format("l")} - ${moment(
    created
  ).format("LT")} `;

  const contentOpen = openContent ? "auto" : 0;

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
      <AnimateHeight duration={500} height={contentOpen}>
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
