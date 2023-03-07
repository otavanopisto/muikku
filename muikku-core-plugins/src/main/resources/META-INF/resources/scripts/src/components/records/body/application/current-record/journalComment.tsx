import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { JournalComment } from "~/@types/journal";
import { AnyActionType } from "~/actions";
import {
  ApplicationListItem,
  ApplicationListItemBody,
} from "~/components/general/application-list";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";

/**
 * JournalCommentProps
 */
interface JournalCommentProps extends JournalComment {
  i18n: i18nType;
  status: StatusType;
}

/**
 * Creates journal comment component
 * @param props props
 * @returns JSX.Element
 */
const JournalComment: React.FC<JournalCommentProps> = (props) => {
  const { comment, i18n, status, created, id, firstName, lastName, authorId } =
    props;

  const creatorIsMe = status.userId === authorId;

  const creatorName = creatorIsMe
    ? i18n.text.get("plugin.records.journal.comments.creator.me")
    : `${firstName} ${lastName}`;

  const formatedDate = `${i18n.time.format(created, "l")} - ${i18n.time.format(
    created,
    "LT"
  )}`;

  return (
    <ApplicationListItem key={id}>
      <ApplicationListItemBody>
        <article className="application-list__item-content-body application-list__item-content-body--journal-entry rich-text">
          <CkeditorContentLoader html={comment} />
        </article>
        <div>
          {creatorName} - {formatedDate}
        </div>
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(JournalComment);
