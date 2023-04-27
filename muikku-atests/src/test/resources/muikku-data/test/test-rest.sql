SET foreign_key_checks = 0;
insert into RoleEntity (id, name) values 
  (1, 'GUEST'),
  (2, 'USER'),
  (3, 'MANAGER'),
  (4, 'ADMINISTRATOR'),
  (5, 'STUDENT'),
  (6, 'TRUSTED_SYSTEM'),
  (7, 'Opettaja'),
  (10, 'Course Student'),
  (11, 'EVERYONE');

insert into EnvironmentRoleEntity (id, archetype) values 
  (1, 'CUSTOM'),
  (2, 'TEACHER'),
  (3, 'MANAGER'),
  (4, 'ADMINISTRATOR'),
  (5, 'STUDENT'),
  (6, 'CUSTOM');
  
INSERT INTO RoleSchoolDataIdentifier (id, identifier, datasource_id, roleentity_id) values 
  (1, 'ENV-GUEST',  2, 1),
  (2, 'ENV-USER', 2, 2),
  (3, 'ENV-MANAGER', 2, 3),
  (4, 'ENV-ADMINISTRATOR', 2, 4),
  (5, 'ENV-STUDENT', 2, 5),
  (6, 'ENV-TRUSTED_SYSTEM', 2, 6),
  (7, 'WS-7', 2, 7),
  (10,'WS-STUDENT', 2, 10);
  
insert into SystemRoleEntity (id, roleType) values (11, 'EVERYONE');
insert into WorkspaceRoleEntity (id, archetype) values (7, 'TEACHER'), (10, 'STUDENT');

insert into UserGroupEntity (id, schoolDataSource_id, identifier, archived) values
  (1, 2, 'STUDYPROGRAMME-1', false);

SET foreign_key_checks = 1;