/* Andreas Fuccibani */

insert into UserEntity (id, archived) values (1, false);
insert into EnvironmentUser (id, archived, role_id, user_id) values (1, false, 2, 1);
insert into LocalUser (id, firstName, lastName, roleId, archived) values (1, 'Andreas', 'Fuccibani', 2, false);
insert into LocalUserEmail (user_id, address, archived) values (1, 'andreas.fuccibani@superdupermangobanana.fi', false);
insert into InternalAuth (id, password, userEntityId) values (1, md5(md5('qwe')), 1);
insert into UserSchoolDataIdentifier (identifier, dataSource_id, userEntity_id) values ('1', (select id from SchoolDataSource where identifier = 'LOCAL'), 1);