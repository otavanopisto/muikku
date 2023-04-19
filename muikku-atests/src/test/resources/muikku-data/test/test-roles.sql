SET foreign_key_checks = 0;
insert into RoleEntity (id, name) values 
  (1, 'GUEST'),
  (2, 'USER'),
  (3, 'MANAGER'),
  (4, 'ADMINISTRATOR'),
  (5, 'STUDENT'),
  (6, 'TRUSTED_SYSTEM'),
  (7, 'Opettaja'),
  (10, 'Course Student'),
  (11, 'EVERYONE'),
  (12, 'TEACHER'),
  (13, 'STUDY_GUIDER'),
  (29, 'STUDY_PROGRAMME_LEADER'),
  (30, 'CLOSED');

insert into EnvironmentRoleEntity (id, archetype) values 
  (1, 'CUSTOM'),
  (2, 'CUSTOM'),
  (3, 'MANAGER'),
  (4, 'ADMINISTRATOR'),
  (5, 'STUDENT'),
  (6, 'CUSTOM'),
  (12, 'TEACHER'),
  (13, 'STUDY_GUIDER'),
  (29, 'STUDY_PROGRAMME_LEADER'),
  (30, 'CUSTOM');
  
INSERT INTO RoleSchoolDataIdentifier (id, identifier, datasource_id, roleentity_id) values 
  (1, 'ENV-GUEST', 2, 1),
  (2, 'ENV-USER', 2, 2),
  (3, 'ENV-MANAGER', 2, 3),
  (4, 'ENV-ADMINISTRATOR', 2, 4),
  (5, 'ENV-STUDENT', 2, 5),
  (6, 'ENV-TRUSTED_SYSTEM', 2, 6),
  (10, 'WS-STUDENT', 2, 10),
  (11, 'ENV-TEACHER', 2, 12),
  (12, 'ENV-STUDY_GUIDER', 2, 13),
  (28, 'ENV-STUDY_PROGRAMME_LEADER', 2, 29),
  (36, 'WS-1', 2, 7),
  (39, 'ENV-CLOSED', 2, 30);
  
insert into SystemRoleEntity (id, roleType) values (11, 'EVERYONE');
insert into WorkspaceRoleEntity (id, archetype) values (7, 'TEACHER'), (10, 'STUDENT');



SET foreign_key_checks = 1;