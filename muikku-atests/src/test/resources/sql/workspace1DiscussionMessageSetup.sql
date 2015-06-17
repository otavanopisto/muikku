SET REFERENTIAL_INTEGRITY FALSE;

insert into forummessage (id, archived, created, creator_id, lastModified, lastModifier_id, message, forumArea_id) 
  values (1, 0, '2015-06-17 09:01:21', 1, '2015-06-17 09:01:21', 1, '<p>Testing testing daa daa</p>', 1);

insert into forumthread (locked, sticky, title, updated, id)
  values (0, 0, 'Testing', '2015-06-17 09:01:21', 1);
  
SET REFERENTIAL_INTEGRITY TRUE;