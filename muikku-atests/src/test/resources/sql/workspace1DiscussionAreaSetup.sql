SET REFERENTIAL_INTEGRITY FALSE;

insert into forumarea (id, archived, name, owner_id, rights_id, group_id) 
  values (1, 0, 'test area', 1, 1, null);
insert into workspaceforumarea (workspace_id, id) values (1, 1);
  
SET REFERENTIAL_INTEGRITY TRUE;