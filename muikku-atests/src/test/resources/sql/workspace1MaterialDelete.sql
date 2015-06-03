SET REFERENTIAL_INTEGRITY FALSE;
delete from material where id = 5;
delete from htmlmaterial where id = 5;
delete from workspacenode where id = 3;
delete from workspacefolder where id = 3;
delete from workspacematerial where id = 42;
delete from workspacenode where id = 42;
SET REFERENTIAL_INTEGRITY TRUE;