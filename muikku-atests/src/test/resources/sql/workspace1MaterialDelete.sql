SET REFERENTIAL_INTEGRITY FALSE;
delete from material where id = 2;
delete from htmlmaterial where id = 2;
delete from workspacematerial where id = 3;
delete from workspacenode where id = 3;
delete from workspacefolder where id = 2;
SET REFERENTIAL_INTEGRITY TRUE;