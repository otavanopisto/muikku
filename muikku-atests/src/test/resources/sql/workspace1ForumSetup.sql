SET REFERENTIAL_INTEGRITY FALSE;
INSERT INTO workspaceforumarea (workspaceid, id) values (1,1)
INSERT INTO forumarea (id, archived, name, owner_id, rights_id, group_id) values (1, 0, 'test', 1, 1, null);
SET REFERENTIAL_INTEGRITY TRUE;