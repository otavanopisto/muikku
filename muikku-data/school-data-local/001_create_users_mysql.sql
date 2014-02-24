/* Andreas Fuccibani */

insert into UserEntity (id, archived) values (1, false);
insert into EnvironmentUser (id, archived, role_id, user_id) values (1, false, 2, 1);
insert into LocalUser (id, firstName, lastName, roleId, archived) values (1, 'Andreas', 'Fuccibani', 2, false);
insert into LocalUserEmail (user_id, address, archived) values (1, 'andreas.fuccibani@superdupermangobanana.fi', false);
insert into InternalAuth (id, password, userEntityId) values (1, '3675ac5c859c806b26e02e6f9fd62192', 1);
insert into UserSchoolDataIdentifier (identifier, dataSource_id, userEntity_id) values ('1', (select id from SchoolDataSource where identifier = 'LOCAL'), 1);
insert into UserGroupUser (id, userGroup_id, user_id, role_id) values (1, 3, 1, 9);
insert into UserEmailEntity (id,user_id,address) values (1, 1, 'andreas.fuccibani@superdupermangobanana.fi');

insert into UserEntity (id, archived) values (2, false);
insert into EnvironmentUser (id, archived, role_id, user_id) values (2, false, 4, 2);
insert into LocalUser (id, firstName, lastName, roleId, archived) values (2, 'Student', 'No1', 4, false);
insert into LocalUserEmail (user_id, address, archived) values (2, 'st1@oo.fi', false);
insert into InternalAuth (id, password, userEntityId) values (2, '3675ac5c859c806b26e02e6f9fd62192', 2);
insert into UserSchoolDataIdentifier (identifier, dataSource_id, userEntity_id) values ('2', (select id from SchoolDataSource where identifier = 'LOCAL'), 2);
insert into UserGroupUser (id, userGroup_id, user_id, role_id) values (2, 3, 2, 10);
insert into UserEmailEntity (id,user_id,address) values (2, 2, 'st1@oo.fi');

insert into UserEntity (id, archived) values (3, false);
insert into EnvironmentUser (id, archived, role_id, user_id) values (3, false, 4, 3);
insert into LocalUser (id, firstName, lastName, roleId, archived) values (3, 'Student', 'No2', 4, false);
insert into LocalUserEmail (user_id, address, archived) values (3, 'st2@oo.fi', false);
insert into InternalAuth (id, password, userEntityId) values (3, '3675ac5c859c806b26e02e6f9fd62192', 3);
insert into UserSchoolDataIdentifier (identifier, dataSource_id, userEntity_id) values ('3', (select id from SchoolDataSource where identifier = 'LOCAL'), 3);
insert into UserGroupUser (id, userGroup_id, user_id, role_id) values (3, 3, 3, 10);
insert into UserEmailEntity (id,user_id,address) values (3, 3, 'st3@oo.fi');

insert into UserEntity (id, archived) values (4, false);
insert into EnvironmentUser (id, archived, role_id, user_id) values (4, false, 7, 4);
insert into LocalUser (id, firstName, lastName, roleId, archived) values (4, 'Liisa', 'Linjanveturi', 7, false);
insert into LocalUserEmail (user_id, address, archived) values (4, 'linja@oo.fi', false);
insert into InternalAuth (id, password, userEntityId) values (4, '3675ac5c859c806b26e02e6f9fd62192', 4);
insert into UserSchoolDataIdentifier (identifier, dataSource_id, userEntity_id) values ('4', (select id from SchoolDataSource where identifier = 'LOCAL'), 4);
insert into UserEmailEntity (id,user_id,address) values (4, 4, 'linja@oo.fi');

insert into UserEntity (id, archived) values (5, false);
insert into EnvironmentUser (id, archived, role_id, user_id) values (5, false, 8, 3);
insert into LocalUser (id, firstName, lastName, roleId, archived) values (5, 'Olli', 'Ohjaaja', 8, false);
insert into LocalUserEmail (user_id, address, archived) values (5, 'ohjaaja@oo.fi', false);
insert into InternalAuth (id, password, userEntityId) values (5, '3675ac5c859c806b26e02e6f9fd62192', 5);
insert into UserSchoolDataIdentifier (identifier, dataSource_id, userEntity_id) values ('5', (select id from SchoolDataSource where identifier = 'LOCAL'), 5);
insert into UserGroupUser (id, userGroup_id, user_id, role_id) values (4, 3, 5, 9);
insert into UserEmailEntity (id,user_id,address) values (5, 5, 'ohjaaja@oo.fi');

insert into UserEntity (id, archived) values (6, false);
insert into EnvironmentUser (id, archived, role_id, user_id) values (6, false, 3, 6);
insert into LocalUser (id, firstName, lastName, roleId, archived) values (6, 'Teacher', 'No1', 3, false);
insert into LocalUserEmail (user_id, address, archived) values (6, 'th1@oo.fi', false);
insert into InternalAuth (id, password, userEntityId) values (6, '3675ac5c859c806b26e02e6f9fd62192', 6);
insert into UserSchoolDataIdentifier (identifier, dataSource_id, userEntity_id) values ('6', (select id from SchoolDataSource where identifier = 'LOCAL'), 6);
insert into UserEmailEntity (id,user_id,address) values (6, 6, 'th1@oo.fi');

