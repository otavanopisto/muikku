insert into WorkspaceSettingsTemplate (defaultWorkspaceUserRole_id) values ((select id from RoleEntity where name = 'Workspace Student'));
insert into WorkspaceSettings (workspaceEntity_id, defaultWorkspaceUserRole_id) (select id, (select id from RoleEntity where name = 'Workspace Student') from WorkspaceEntity);
