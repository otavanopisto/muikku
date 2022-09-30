/**
 * DiaryComment
 */
export interface JournalComment {
  id: number;
  journalEntryId: number;
  parentCommentId: number;
  depth: number;
  authorId: number;
  firstName: string;
  lastName: string;
  comment: string;
  created: Date;
  editable: boolean;
  archivable: boolean;
}

/**
 * DiaryCommentNew
 */
export interface JournalCommentCreate {
  journalEntryId: number;
  comment: string;
}

/**
 * DiaryCommentUpdate
 */
export interface JournalCommentUpdate {
  id: number;
  journalEntryId: number;
  comment: string;
}

/**
 * DiaryCommentDelete
 */
export interface JournalCommentDelete {
  id: number;
  journalEntryId: number;
}
