/* Workspace Types */

insert into WorkspaceType (name) values
  ('GENERIC'),
  ('COURSE'),
  ('GROUPWORK'),
  ('GAME');

/** Language Courses **/

insert into Workspace (course_identifier_id, name, type_id) values
	(0, 'Elvish 1 - Primitive Quendian', 1),
	(1, 'Elvish 2 - Common Eldarin, Quenya and Goldogrin', 1),
	(2, 'Elvish 3 - Noldorin', 1),
	(3, 'Elvish 4 - Telerin, Ilkorin, Doriathrin and the Avarin', 1),
	(4, 'Elvish 5 - Sindarin', 1),
	(5, 'Language Of Men 1 - Soval Pharë', 1),
	(6, 'Language Of Men 2 - Taliska', 1),
	(7, 'Language Of Men 3 - Adûnaic', 1),
	(8, 'Dwarfish 1 - Basics of Khuzdul', 1),
	(9, 'Dwarfish 2 - Iglishmêk', 1),
	(10, 'Entish 1 - Fundamental Entish', 1),
	(10, 'Entish 1 - Gathering at Isengard', 1),
	(11, 'Orc 1 - Orcish', 1),
	(12, 'Orc 2 - Black Speech', 1);
	
/* Group Work Workspaces */
	
insert into Workspace (course_identifier_id, name, type_id) values
	(null, 'Public House - Green Dragon', 2),
	(null, 'Hidden kingdom of Gondolin', 2),
	(null, 'Minas Morgul - City of the Nazgûl', 2);	
	
/* Games */	
	
insert into Workspace (course_identifier_id, name, type_id) values
	(null, 'MERP', 3);	