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

-- User 4 - ADMINISTRATOR

insert into UserEntity (id, archived, defaultIdentifier, defaultSchoolDataSource_id) values (1, false, 'STAFF-1', (select id from SchoolDataSource where identifier = 'PYRAMUS'));
insert into EnvironmentUser (id, archived, role_id, user_id) values (1, 0, 6, 1);
insert into UserSchoolDataIdentifier (id, identifier, dataSource_id, userEntity_id) values (1, 'STAFF-1', (select id from SchoolDataSource where identifier = 'PYRAMUS'), 1);
insert into UserEmailEntity (id,user_id,address) values (1, 1, 'admin@made.up');
insert into UserIdentification (id, externalId, authSource_id, user_id) values (1, 1, 1, 1);


SET REFERENTIAL_INTEGRITY TRUE;