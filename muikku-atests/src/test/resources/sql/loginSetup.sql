SET REFERENTIAL_INTEGRITY FALSE;

insert into RoleEntity (id, name) values 
  (1, 'GUEST'),
  (2, 'USER'),
  (3, 'MANAGER'),
  (4, 'ADMINISTRATOR'),
  (5, 'STUDENT'),
  (6, 'Course Student');

insert into EnvironmentRoleEntity (id, archetype) values 
  (1, 'CUSTOM'),
  (2, 'CUSTOM'),
  (3, 'MANAGER'),
  (4, 'ADMINISTRATOR'),
  (5, 'STUDENT');

--insert into SchoolDataSource (id, identifier) values (1, 'LOCAL'), (2, 'PYRAMUS');
insert into WorkspaceRoleEntity (id, archetype) values (6, 'STUDENT'), (4, 'TEACHER'); 

insert into UserEntity (id, archived, defaultIdentifier, defaultSchoolDataSource_id) values (1, false, '1', (select id from SchoolDataSource where identifier = 'PYRAMUS'));
insert into EnvironmentUser (id, archived, role_id, user_id) values (1, false, 2, 1);
insert into LocalUser (id, firstName, lastName, roleId, archived) values (1, 'Test', 'User', 2, false);
insert into LocalUserEmail (user_id, address, archived) values (1, 'testuser@made.up', false);
--insert into InternalAuth (id, password, userEntityId) values (1, '3675ac5c859c806b26e02e6f9fd62192', 1);
insert into UserSchoolDataIdentifier (identifier, dataSource_id, userEntity_id) values ('1', (select id from SchoolDataSource where identifier = 'PYRAMUS'), 1);
-- role id 9 ? --
insert into UserGroupUser (id, userGroup_id, user_id, role_id) values (1, 3, 1, 9);
insert into UserEmailEntity (id,user_id,address) values (1, 1, 'testuser@made.up');
SET REFERENTIAL_INTEGRITY TRUE;