SET REFERENTIAL_INTEGRITY FALSE;

insert into workspaceentity (id, archived, identifier, urlName, dataSource_id) values 
  (1, 0, 1, 'testCourse', 2);

insert into workspacenode (id, hidden, orderNumber, urlName, parent_id) values 
  (1, 0, 0, 'testCourse', null);

insert into workspacerootfolder (workspaceEntityId, id) values 
  (1, 1);
  
insert into workspacewall (id, workspace_id) values 
  (1, 1);

SET REFERENTIAL_INTEGRITY TRUE;