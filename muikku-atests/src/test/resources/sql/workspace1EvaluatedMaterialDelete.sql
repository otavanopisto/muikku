SET REFERENTIAL_INTEGRITY FALSE;
delete from material where id = 7;
delete from htmlmaterial where id = 7;
delete from workspacenode where id = 8;
delete from workspacefolder where id = 8;
delete from workspacenode where id = 45;
delete from workspacematerial where id = 45;
SET REFERENTIAL_INTEGRITY TRUE;