SET REFERENTIAL_INTEGRITY FALSE;

delete from workspaceentity where id = 1;
delete from workspacenode where id = 1;
delete from workspacerootfolder where id = 1;

SET REFERENTIAL_INTEGRITY TRUE;
