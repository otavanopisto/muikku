INSERT INTO RoleEntity VALUES (1,'EVERYONE'), (2,'Manager'), (3,'Teacher'), (4,'Student'), (5,'Workspace Teacher'), (6,'Workspace Student'), (7,'Head of Dpt.'), (8,'Study advisor'), (9,'Group Teacher'), (10,'Group Student');
INSERT INTO EnvironmentRoleEntity (id) values (2);
INSERT INTO EnvironmentRoleEntity (id) values (3);
INSERT INTO EnvironmentRoleEntity (id) values (4);
INSERT INTO EnvironmentRoleEntity (id) values (7);
INSERT INTO EnvironmentRoleEntity (id) values (8);
INSERT INTO WorkspaceRoleEntity values (5);
INSERT INTO WorkspaceRoleEntity values (6);
INSERT INTO SystemRoleEntity (id, roleType) values (1, 'EVERYONE');
INSERT INTO UserGroupRoleEntity values (9);
INSERT INTO UserGroupRoleEntity values (10);

insert into RoleSchoolDataIdentifier (id, identifier, dataSource_id, roleEntity_id) values (1, 1, 1, 1), (2, 2, 1, 2), (3, 3, 1, 3), (4, 4, 1, 4), (5, 5, 1, 5), (6, 6, 1, 6), (7, 7, 1, 7), (8, 8, 1, 8), (9, 9, 1, 9), (10, 10, 1, 10);