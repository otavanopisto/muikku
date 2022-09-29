/**
 * DiaryComment
 */
export interface DiaryComment {
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
export interface DiaryCommentCreate {
  journalEntryId: number;
  comment: string;
}

/**
 * DiaryCommentUpdate
 */
export interface DiaryCommentUpdate {
  id: number;
  journalEntryId: number;
  comment: string;
}

/**
 * DiaryCommentDelete
 */
export interface DiaryCommentDelete {
  id: number;
  journalEntryId: number;
}
