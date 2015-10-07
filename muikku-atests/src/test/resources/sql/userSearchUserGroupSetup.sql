SET REFERENTIAL_INTEGRITY FALSE;

insert into UserGroupEntity (id, archived, schoolDataSource_id, identifier) 
select 1, false, id, 'USERGROUP-1' from SchoolDataSource where identifier = 'PYRAMUS';

insert into UserGroupUserEntity (id, archived, userGroupEntity_id, userSchoolDataIdentifier_id, schoolDataSource_id, identifier)
select 1, false, max(ug.id), 4, ds.id, 'USERGROUPSTAFFMEMBER-1' from SchoolDataSource ds, UserGroupEntity ug where ds.identifier = 'PYRAMUS';

insert into UserGroupUserEntity (id, archived, userGroupEntity_id, userSchoolDataIdentifier_id, schoolDataSource_id, identifier)
select 2, false, max(ug.id), 1, ds.id, 'USERGROUPSTUDENT-1' from SchoolDataSource ds, UserGroupEntity ug where ds.identifier = 'PYRAMUS';

SET REFERENTIAL_INTEGRITY TRUE;