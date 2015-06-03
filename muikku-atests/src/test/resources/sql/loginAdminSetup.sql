SET REFERENTIAL_INTEGRITY FALSE;

insert into RoleEntity (id, name) values 
  (1, 'ADMINISTRATOR');

insert into EnvironmentRoleEntity (id, archetype) values 
  (1, 'ADMINISTRATOR');

--insert into SchoolDataSource (id, identifier) values (1, 'LOCAL'), (2, 'PYRAMUS');
insert into WorkspaceRoleEntity (id, archetype) values (1, 'TEACHER'), (2, 'STUDENT'); 

-- User 4 - ADMINISTRATOR

insert into UserEntity (id, archived, defaultIdentifier, defaultSchoolDataSource_id) values (1, false, 'STAFF-1', (select id from SchoolDataSource where identifier = 'PYRAMUS'));
insert into EnvironmentUser (id, archived, role_id, user_id) values (1, 0, 1, 1);
insert into UserSchoolDataIdentifier (id, identifier, dataSource_id, userEntity_id) values (1, 'STAFF-1', (select id from SchoolDataSource where identifier = 'PYRAMUS'), 1);
insert into UserEmailEntity (id,user_id,address) values (1, 1, 'admin@made.up');
insert into UserIdentification (id, externalId, authSource_id, user_id) values (1, 1, 1, 1);


SET REFERENTIAL_INTEGRITY TRUE;