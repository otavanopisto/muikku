SET REFERENTIAL_INTEGRITY FALSE;

insert into RoleEntity (id, name) values 
  (2, 'GUEST'),
  (3, 'USER'),
  (4, 'MANAGER'),
  (5, 'ADMINISTRATOR'),
  (6, 'STUDENT'),
  (7, 'Course Student');

insert into EnvironmentRoleEntity (id, archetype) values 
  (2, 'CUSTOM'),
  (3, 'CUSTOM'),
  (4, 'MANAGER'),
  (5, 'ADMINISTRATOR'),
  (6, 'STUDENT');

--insert into SchoolDataSource (id, identifier) values (1, 'LOCAL'), (2, 'PYRAMUS');
insert into WorkspaceRoleEntity (id, archetype) values (7, 'STUDENT'), (5, 'TEACHER'); 

insert into UserEntity (id, archived, defaultIdentifier, defaultSchoolDataSource_id) values (1, false, 'STUDENT-1', (select id from SchoolDataSource where identifier = 'PYRAMUS'));
insert into EnvironmentUser (id, archived, role_id, user_id) values (1, 0, 6, 1);
--insert into InternalAuth (id, password, userEntityId) values (1, '3675ac5c859c806b26e02e6f9fd62192', 1);
insert into UserSchoolDataIdentifier (identifier, dataSource_id, userEntity_id) values ('1', (select id from SchoolDataSource where identifier = 'PYRAMUS'), 1);
-- role id 9 ? --
--insert into UserGroupUser (id, userGroup_id, user_id, role_id) values (1, 3, 1, 9);
insert into UserEmailEntity (id,user_id,address) values (1, 1, 'testuser@made.up');
insert into UserIdentification (id, externalId, authSource_id, user_id) values (1, 1, 1, 1);
SET REFERENTIAL_INTEGRITY TRUE;