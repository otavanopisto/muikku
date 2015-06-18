SET REFERENTIAL_INTEGRITY FALSE;
delete from AuthSource;

delete from RoleEntity;

delete from EnvironmentRoleEntity;
delete from WorkspaceRoleEntity;

delete from UserEntity where id = 1;
delete from EnvironmentUser where id = 1;
delete from LocalUser where id = 1;
delete from LocalUserEmail where user_id = 1;
delete from InternalAuth where id = 1;
delete from UserSchoolDataIdentifier where identifier = '1';
delete from UserGroupUser where id = 1;
delete from UserEmailEntity where id = 1;
SET REFERENTIAL_INTEGRITY TRUE;