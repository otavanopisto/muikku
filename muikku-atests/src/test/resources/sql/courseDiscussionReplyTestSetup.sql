SET REFERENTIAL_INTEGRITY FALSE;

insert into forumarea (id, archived, name, owner_id, rights_id, group_id) 
  values (1, 0, 'test area', 1, 1, null);
insert into workspaceforumarea (workspace_id, id) values (1, 1);

insert into forummessage (id, archived, created, creator_id, lastModified, lastModifier_id, message, forumArea_id) 
  values (1, 0, '2015-06-17 09:01:21', 1, '2015-06-17 09:01:21', 1, '<p>Testing testing daa daa</p>', 1);

insert into forumthread (locked, sticky, title, updated, id)
  values (0, 0, 'Testing', '2015-06-17 09:01:21', 1);
  
SET REFERENTIAL_INTEGRITY TRUE;