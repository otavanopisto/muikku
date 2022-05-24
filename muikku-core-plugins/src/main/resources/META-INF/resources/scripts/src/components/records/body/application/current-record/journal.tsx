import * as React from "react";
import AnimateHeight from "react-animate-height";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import {
  ApplicationListItem,
  ApplicationListItemBody,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { WorkspaceJournalType } from "~/reducers/workspaces";

/**
 * JournalProps
 */
interface JournalProps {
  i18n: i18nType;
  journal: WorkspaceJournalType;
  open: boolean;
  onJournalClick: (
    id: number
  ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

/**
 * Journal Component
 * @param props props
 * @returns JSX.Element
 */
const Journal: React.FC<JournalProps> = (props) => {
  const { i18n, journal, onJournalClick, open } = props;

  return (
    <ApplicationListItem
      className="journal journal--studies"
      key={journal.id}
      onClick={onJournalClick(journal.id)}
    >
      <ApplicationListItemHeader className="application-list__item-header--journal-entry">
        <div className="application-list__item-header-main application-list__item-header-main--journal-entry">
          <span className="application-list__item-header-main-content application-list__item-header-main-content--journal-entry-title">
            {journal.title}
          </span>
        </div>
        <div className="application-list__item-header-aside">
          <span>{i18n.time.format(journal.created, "L LT")}</span>
        </div>
      </ApplicationListItemHeader>
      <ApplicationListItemBody className="application-list__item-body">
        <AnimateHeight height={open ? "auto" : 0}>
          <article
            className="application-list__item-content-body application-list__item-content-body--journal-entry rich-text"
            dangerouslySetInnerHTML={{
              __html: journal.content,
            }}
          ></article>
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
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Journal);
