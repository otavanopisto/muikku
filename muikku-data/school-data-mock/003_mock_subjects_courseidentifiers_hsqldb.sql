/* Subject */

insert into Subject (name) values 
  ('Elvish'), 
  ('Language Of Men'), 
  ('Dwarfish'), 
  ('Ents'), 
  ('Orc'), 
  ('Eä'), 
  ('Fencing'), 
  ('Orcology'), 
  ('Dark Magic');

insert into CourseIdentifier (code, subject_id) values
  ('MEL-ELF-1', (select min(id) from Subject) + 0),
  ('MEL-ELF-2', (select min(id) from Subject) + 0),
  ('MEL-ELF-3', (select min(id) from Subject) + 0),
  ('MEL-ELF-4', (select min(id) from Subject) + 0),
  ('MEL-ELF-5', (select min(id) from Subject) + 0),
  ('MEL-MEN-1', (select min(id) from Subject) + 1),
  ('MEL-MEN-2', (select min(id) from Subject) + 1),
  ('MEL-MEN-3', (select min(id) from Subject) + 1),
  ('MEL-DWF-1', (select min(id) from Subject) + 2),
  ('MEL-DWF-2', (select min(id) from Subject) + 2),
  ('MEL-ENT-1', (select min(id) from Subject) + 3),
  ('MEL-ORC-1', (select min(id) from Subject) + 4),
  ('MEL-ORC-2', (select min(id) from Subject) + 4);