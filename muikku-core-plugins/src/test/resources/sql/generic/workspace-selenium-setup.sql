-- Using ID range 11000-11999
SET REFERENTIAL_INTEGRITY FALSE;
insert into WorkspaceEntity (id, dataSource_id, identifier, urlName, archived) values (11000, (select id from SchoolDataSource where identifier = 'selenium-tests'), 'selenium-test-wp', 'selenium-tests', false);
insert into WorkspaceRootFolder (id, workspaceEntityId) values (11001, 11000);
insert into WorkspaceNode (id, urlname, parent_id) values (11001,
														  'selenium-tests',
														  NULL);
SET REFERENTIAL_INTEGRITY TRUE;