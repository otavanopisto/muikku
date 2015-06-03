SET REFERENTIAL_INTEGRITY FALSE;
delete from material where id = 6;
delete from htmlmaterial where id = 6;
delete from workspacenode where id = 4;
delete from workspacefolder where id = 4;
delete from workspacenode where id = 43;
delete from workspacematerial where id = 43;

delete from material where id = 7;
delete from htmlmaterial where id = 7;
delete from workspacenode where id = 44;
delete from workspacematerial where id = 44;
  
SET REFERENTIAL_INTEGRITY TRUE;