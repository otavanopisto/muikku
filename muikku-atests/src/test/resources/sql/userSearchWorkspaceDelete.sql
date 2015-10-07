SET REFERENTIAL_INTEGRITY FALSE;

delete from WorkspaceUserEntity where id in (1, 2);

delete from WorkspaceEntity where id in (1);

SET REFERENTIAL_INTEGRITY TRUE;
