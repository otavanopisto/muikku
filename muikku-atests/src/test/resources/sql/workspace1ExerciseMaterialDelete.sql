SET REFERENTIAL_INTEGRITY FALSE;
delete from material where id = 8;
delete from htmlmaterial where id = 8;
delete from workspacenode where id = 9;
delete from workspacefolder where id = 9;
delete from workspacenode where id = 46;
delete from workspacematerial where id = 46;
SET REFERENTIAL_INTEGRITY TRUE;