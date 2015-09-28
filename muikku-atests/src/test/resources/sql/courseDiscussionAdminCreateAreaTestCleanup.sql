SET REFERENTIAL_INTEGRITY FALSE;
delete from forumarea where name = 'Test area';
SET REFERENTIAL_INTEGRITY TRUE;