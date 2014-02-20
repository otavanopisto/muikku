-- Using ID range 11000-11999
SET REFERENTIAL_INTEGRITY FALSE;
delete from WorkspaceNode where id BETWEEN 11000 AND 11999;
delete from WorkspaceRootFolder where id BETWEEN 11000 AND 11999;
delete from WorkspaceEntity where id BETWEEN 11000 AND 11999;
SET REFERENTIAL_INTEGRITY TRUE;