SET REFERENTIAL_INTEGRITY FALSE;

insert into workspaceentity (id, archived, identifier, urlName, dataSource_id, published) values 
  (1, 0, 1, 'testcourse', 2, 1);

insert into WorkspaceUserEntity (id, archived, identifier, userSchoolDataIdentifier_id, workspaceEntity_id, workspaceUserRole_id)
values (1, false, 'STUDENT-1', 1, 1, 9);  
  
insert into WorkspaceUserEntity (id, archived, identifier, userSchoolDataIdentifier_id, workspaceEntity_id, workspaceUserRole_id)
values (2, false, 'STAFF-4', 4, 1, 8);  

SET REFERENTIAL_INTEGRITY TRUE;