SET REFERENTIAL_INTEGRITY FALSE;

insert into workspaceentity (id, archived, identifier, urlName, dataSource_id, published) values 
  (1, 0, 1, 'testcourse', 2, 1);

insert into workspacenode (id, hidden, orderNumber, urlName, parent_id, title) values 
  (1, 0, 0, 'testcourse', null, 'Root');

insert into workspacerootfolder (workspaceEntityId, id) values 
  (1, 1);
  
--insert into workspacewall (id, workspace_id) values 
--  (1, 1);
--
--insert into workspacesettingstemplate (id, defaultWorkspaceUserRole_id) values 
--  (2, null);
  
SET REFERENTIAL_INTEGRITY TRUE;