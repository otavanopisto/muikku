SET REFERENTIAL_INTEGRITY FALSE;

insert into RoleEntity (id, name) values 
  (2, 'GUEST'),
  (3, 'USER'),
  (4, 'TEACHER'),
  (5, 'MANAGER'),
  (6, 'ADMINISTRATOR'),
  (7, 'STUDENT'),
  (8, 'Course Teacher'),
  (9, 'Course Student'),
  (10, 'TRUSTED_SYSTEM');

insert into EnvironmentRoleEntity (id, archetype) values 
  (4, 'TEACHER'),
  (5, 'MANAGER'),
  (6, 'ADMINISTRATOR'),
  (7, 'STUDENT'),
  (10, 'CUSTOM');

--insert into SchoolDataSource (id, identifier) values (1, 'LOCAL'), (2, 'PYRAMUS');
insert into WorkspaceRoleEntity (id, archetype) values (8, 'TEACHER'), (9, 'STUDENT'); 

-- User 1 - STUDENT

insert into UserEntity (id, archived, defaultIdentifier, defaultSchoolDataSource_id) values (1, 0, 'STUDENT-1', (select id from SchoolDataSource where identifier = 'PYRAMUS'));
insert into EnvironmentUser (id, archived, role_id, user_id) values (1, 0, 7, 1);
--insert into InternalAuth (id, password, userEntityId) values (1, '3675ac5c859c806b26e02e6f9fd62192', 1);
insert into UserSchoolDataIdentifier (id, identifier, dataSource_id, userEntity_id) values (1, 'STUDENT-1', (select id from SchoolDataSource where identifier = 'PYRAMUS'), 1);
-- role id 9 ? --
--insert into UserGroupUser (id, userGroup_id, user_id, role_id) values (1, 3, 1, 9);
insert into UserEmailEntity (id,user_id,address) values (1, 1, 'testuser@example.com');
insert into UserIdentification (id, externalId, authSource_id, user_id) values (1, 1, 1, 1);

-- User 2 - TEACHER

insert into UserEntity (id, archived, defaultIdentifier, defaultSchoolDataSource_id) values (2, false, 'STAFF-2', (select id from SchoolDataSource where identifier = 'PYRAMUS'));
insert into EnvironmentUser (id, archived, role_id, user_id) values (2, 0, 4, 2);
insert into UserSchoolDataIdentifier (id, identifier, dataSource_id, userEntity_id) values (2, 'STAFF-2', (select id from SchoolDataSource where identifier = 'PYRAMUS'), 2);
insert into UserEmailEntity (id,user_id,address) values (2, 2, 'teacher@example.com');
insert into UserIdentification (id, externalId, authSource_id, user_id) values (2, 2, 1, 2);

-- User 3 - MANAGER

insert into UserEntity (id, archived, defaultIdentifier, defaultSchoolDataSource_id) values (3, false, 'STAFF-3', (select id from SchoolDataSource where identifier = 'PYRAMUS'));
insert into EnvironmentUser (id, archived, role_id, user_id) values (3, 0, 5, 3);
insert into UserSchoolDataIdentifier (id, identifier, dataSource_id, userEntity_id) values (3, 'STAFF-3', (select id from SchoolDataSource where identifier = 'PYRAMUS'), 3);
insert into UserEmailEntity (id,user_id,address) values (3, 3, 'mana@example.com');
insert into UserIdentification (id, externalId, authSource_id, user_id) values (3, 3, 1, 3);

-- User 4 - ADMINISTRATOR

insert into UserEntity (id, archived, defaultIdentifier, defaultSchoolDataSource_id) values (4, false, 'STAFF-4', (select id from SchoolDataSource where identifier = 'PYRAMUS'));
insert into EnvironmentUser (id, archived, role_id, user_id) values (4, 0, 6, 4);
insert into UserSchoolDataIdentifier (id, identifier, dataSource_id, userEntity_id) values (4, 'STAFF-4', (select id from SchoolDataSource where identifier = 'PYRAMUS'), 4);
insert into UserEmailEntity (id,user_id,address) values (4, 4, 'admin@example.com');
insert into UserIdentification (id, externalId, authSource_id, user_id) values (4, 4, 1, 4);

--insert into superuser (id) values (4);

-- User 5 - TRUSTED_SYSTEM

insert into UserEntity (id, archived, defaultIdentifier, defaultSchoolDataSource_id) values (5, false, 'STAFF-5', (select id from SchoolDataSource where identifier = 'PYRAMUS'));
insert into EnvironmentUser (id, archived, role_id, user_id) values (5, 0, 10, 5);
insert into UserSchoolDataIdentifier (id, identifier, dataSource_id, userEntity_id) values (5, 'STAFF-5', (select id from SchoolDataSource where identifier = 'PYRAMUS'), 5);
insert into UserEmailEntity (id,user_id,address) values (5, 5, 'trusted@example.com');
insert into UserIdentification (id, externalId, authSource_id, user_id) values (5, 5, 1, 5);

SET REFERENTIAL_INTEGRITY TRUE;