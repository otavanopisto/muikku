/* Workspace Types */

insert into WorkspaceType (name) values
  ('GENERIC'),
  ('COURSE'),
  ('GROUPWORK'),
  ('GAME'),
  ('POOL');

/** Language Courses **/

insert into Workspace (id, course_identifier_id, name, description, type_id) values
	(1, (select min(id) from CourseIdentifier) + 0, 'Elvish 1 - Primitive Quendian', 'Basic grammar and vocabulary of all Quendi', (select min(id) from WorkspaceType) + 1),
	(2, (select min(id) from CourseIdentifier) + 1, 'Elvish 2 - Common Eldarin, Quenya and Goldogrin', 'Advanced topics of elvish languages', (select min(id) from WorkspaceType) + 1),
	(3, (select min(id) from CourseIdentifier) + 2, 'Elvish 3 - Noldorin', 'Description of Noldorin', (select min(id) from WorkspaceType) + 1),
	(4, (select min(id) from CourseIdentifier) + 3, 'Elvish 4 - Telerin, Ilkorin, Doriathrin and the Avarin', 'More elvish stuff', (select min(id) from WorkspaceType) + 1),
	(5, (select min(id) from CourseIdentifier) + 4, 'Elvish 5 - Sindarin', 'The language of grey elves', (select min(id) from WorkspaceType) + 1),
	(6, (select min(id) from CourseIdentifier) + 5, 'Language Of Men 1 - Soval Pharë', 'Description of Soval Phare', (select min(id) from WorkspaceType) + 1),
	(7, (select min(id) from CourseIdentifier) + 6, 'Language Of Men 2 - Taliska', 'Description of Taliska', (select min(id) from WorkspaceType) + 1),
	(8, (select min(id) from CourseIdentifier) + 7, 'Language Of Men 3 - Adûnaic', 'Description of Adunaic', (select min(id) from WorkspaceType) + 1),
	(9, (select min(id) from CourseIdentifier) + 8, 'Dwarfish 1 - Basics of Khuzdul', 'Description of Khuzdul', (select min(id) from WorkspaceType) + 1),
	(10, (select min(id) from CourseIdentifier) + 9, 'Dwarfish 2 - Iglishmêk', 'Description of Iglishmek', (select min(id) from WorkspaceType) + 1),
	(11, (select min(id) from CourseIdentifier) + 10, 'Entish 1 - Fundamental Entish', 'Description of Entish', (select min(id) from WorkspaceType) + 1),
	(12, (select min(id) from CourseIdentifier) + 10, 'Entish 1 - Gathering at Isengard', 'A part of Entish 1', (select min(id) from WorkspaceType) + 1),
	(13, (select min(id) from CourseIdentifier) + 11, 'Orc 1 - Orcish', 'Basics of Orcish', (select min(id) from WorkspaceType) + 1),
	(14, (select min(id) from CourseIdentifier) + 12, 'Orc 2 - Black Speech', 'The language of Mordor', (select min(id) from WorkspaceType) + 1);
	
/* Group Work Workspaces */
	
insert into Workspace (id, course_identifier_id, name, description, type_id) values
	(15, null, 'Public House - Green Dragon', 'Have fun!', (select min(id) from WorkspaceType) + 2),
	(16, null, 'Hidden kingdom of Gondolin', 'Super duper mango banana!', (select min(id) from WorkspaceType) + 2),
	(17, null, 'Minas Morgul - City of the Nazgûl', 'Place of the XXX', (select min(id) from WorkspaceType) + 2);	
	
/* Games */	
	
insert into Workspace (id, course_identifier_id, name, description, type_id) values
	(18, null, 'MERP', 'Middle Earth Role Playing Game', (select min(id) from WorkspaceType) + 3);	
	
/* Pool */	
	
insert into Workspace (id, course_identifier_id, name, description, type_id) values
	(19, null, 'POOL', 'Material Pool', (select min(id) from WorkspaceType) + 4);
	
/* Muikku 2 Coursers */

insert into Workspace (id, course_identifier_id, name, description, type_id) values (20, (select min(id) from CourseIdentifier) + 0, 's21 - Suomen kielen perusteiden varmentaminen (OO)', 'Tällä kurssilla kerrataan suomen kielen perusrakenteita ja -sanastoa. Tavoitteena on vahvistaa peruskielitaitoa ja oppia uusia tapoja opiskella.', (select min(id) from WorkspaceType) + 1);
insert into Workspace (id, course_identifier_id, name, description, type_id) values (21, (select min(id) from CourseIdentifier) + 0, 'ge1_3', 'ge1_3', (select min(id) from WorkspaceType) + 1);
insert into Workspace (id, course_identifier_id, name, description, type_id) values (22, (select min(id) from CourseIdentifier) + 0, 'ena1_2', 'ena1_2', (select min(id) from WorkspaceType) + 1);
