SET REFERENTIAL_INTEGRITY FALSE;

delete from UserGroupUserEntity
where userGroupEntity_id = (select max(id) from UserGroupEntity);

delete from UserGroupEntity
where id = (select max(id) from UserGroupEntity);

SET REFERENTIAL_INTEGRITY TRUE;
