insert into GradingScale (name) values 
  ('Lawful Good / Chaotic Evil');

insert into GradingScaleItem (grading_scale_id, name) values 
  ((select min(id) from GradingScale) + 0, 'Lawful Good'),
  ((select min(id) from GradingScale) + 0, 'Neutral Good'),
  ((select min(id) from GradingScale) + 0, 'Chaotic Good'),
  ((select min(id) from GradingScale) + 0, 'Lawful Neutral'),
  ((select min(id) from GradingScale) + 0, 'True Neutral'),
  ((select min(id) from GradingScale) + 0, 'Chaotic Neutral'),
  ((select min(id) from GradingScale) + 0, 'Lawful Evil'),
  ((select min(id) from GradingScale) + 0, 'Neutral Evil'),
  ((select min(id) from GradingScale) + 0, 'Chaotic Evil');