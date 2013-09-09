/* Workspace Types */

insert into WorkspaceType (name) values
  ('GENERIC'),
  ('COURSE'),
  ('GROUPWORK'),
  ('GAME');

/** Language Courses **/

insert into Workspace (course_identifier_id, name, description, type_id) values
	(0, 'Elvish 1 - Primitive Quendian', 'Basic grammar and vocabulary of all Quendi', 1),
	(1, 'Elvish 2 - Common Eldarin, Quenya and Goldogrin', 'Advanced topics of elvish languages', 1),
	(2, 'Elvish 3 - Noldorin', 'Description of Noldorin', 1),
	(3, 'Elvish 4 - Telerin, Ilkorin, Doriathrin and the Avarin', 'More elvish stuff', 1),
	(4, 'Elvish 5 - Sindarin', 'The language of grey elves', 1),
	(5, 'Language Of Men 1 - Soval Pharë', 'Description of Soval Phare', 1),
	(6, 'Language Of Men 2 - Taliska', 'Description of Taliska', 1),
	(7, 'Language Of Men 3 - Adûnaic', 'Description of Adunaic', 1),
	(8, 'Dwarfish 1 - Basics of Khuzdul', 'Description of Khuzdul', 1),
	(9, 'Dwarfish 2 - Iglishmêk', 'Description of Iglishmek', 1),
	(10, 'Entish 1 - Fundamental Entish', 'Description of Entish', 1),
	(10, 'Entish 1 - Gathering at Isengard', 'A part of Entish 1', 1),
	(11, 'Orc 1 - Orcish', 'Basics of Orcish', 1),
	(12, 'Orc 2 - Black Speech', 'The language of Mordor', 1);
	
/* Group Work Workspaces */
	
insert into Workspace (course_identifier_id, name, description, type_id) values
	(null, 'Public House - Green Dragon', 'Have fun!', 2),
	(null, 'Hidden kingdom of Gondolin', 'Super duper mango banana!', 2),
	(null, 'Minas Morgul - City of the Nazgûl', 'Place of the XXX', 2);	
	
/* Games */	
	
insert into Workspace (course_identifier_id, name, description, type_id) values
	(null, 'MERP', 'Middle Earth Role Playing Game', 3);	