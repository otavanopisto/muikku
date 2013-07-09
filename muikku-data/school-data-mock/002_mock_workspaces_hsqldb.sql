insert into WorkspaceType (name) values 
  ('COURSE'),
  ('WORKSPACE');

/** Language Courses **/

insert into Workspace (subject, name, type_id) values
	('MEL-ELF-1', 'Elvish 1 - Primitive Quendian', 0),
	('MEL-ELF-2', 'Elvish 2 - Common Eldarin, Quenya and Goldogrin', 0),
	('MEL-ELF-3', 'Elvish 3 - Noldorin', 0),
	('MEL-ELF-4', 'Elvish 4 - Telerin, Ilkorin, Doriathrin and the Avarin', 0),
	('MEL-ELF-5', 'Elvish 5 - Sindarin', 0),
	('MEL-MEN-1', 'Language Of Men 1 - Soval Pharë', 0),
	('MEL-MEN-2', 'Language Of Men 2 - Taliska', 0),
	('MEL-MEN-3', 'Language Of Men 3 - Adûnaic', 0),
	('MEL-DWF-1', 'Dwarfish 1 - Basics of Khuzdul', 0),
	('MEL-DWF-2', 'Dwarfish 2 - Iglishmêk', 0),
	('MEL-ENT-1', 'Entish 1 - Fundamental Entish', 0),
	('MEL-ORC-1', 'Orcs 1 - Orcish', 0),
	('MEL-ORC-2', 'Orcs 2 - Black Speech', 0);
	
/* Group Work Workspaces */
	
insert into Workspace (subject, name, type_id) values
	(null, 'Public House - Green Dragon', 1),
	(null, 'Hidden kingdom of Gondolin', 1),
	(null, 'Minas Morgul - City of the Nazgûl', 1);	
	
	