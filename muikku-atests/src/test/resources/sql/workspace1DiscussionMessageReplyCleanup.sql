SET REFERENTIAL_INTEGRITY FALSE;
delete from forummessage where id = 2;
delete from forumthreadreply where id = 2;
SET REFERENTIAL_INTEGRITY TRUE;
