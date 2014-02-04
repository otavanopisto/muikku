insert into WorkspaceEntity (id, archived, identifier, urlName, dataSource_id) VALUES (1,0,'1','elvish-1-primitive-quendian',2),(2,0,'2','elvish-2-common-eldarin,-queny',2),(3,0,'3','elvish-3-noldorin',2),(4,0,'4','elvish-4-telerin,-ilkorin,-dor',2),(5,0,'5','elvish-5-sindarin',2),(6,0,'6','language-of-men-1-soval-phare',2),(7,0,'7','language-of-men-2-taliska',2),(8,0,'8','language-of-men-3-adunaic',2),(9,0,'9','dwarfish-1-basics-of-khuzdul',2),(10,0,'10','dwarfish-2-iglishmek',2),(11,0,'11','entish-1-fundamental-entish',2),(12,0,'12','entish-1-gathering-at-isengard',2),(13,0,'13','orc-1-orcish',2),(14,0,'14','orc-2-black-speech',2),(15,0,'15','public-house-green-dragon',2),(16,0,'16','hidden-kingdom-of-gondolin',2),(17,0,'17','minas-morgul-city-of-the-nazgu',2),(18,0,'18','merp',2),(19,0,'19','pool',2),(20,0,'20','s21_oo',2),(21,0,'21','ge1_3',2),(22,0,'22','ena1_2',2);
insert into WorkspaceNode (urlName) select concat('__we-', id) from WorkspaceEntity where id not in (select workspaceEntityId from WorkspaceRootFolder);
insert into WorkspaceRootFolder (id, workspaceEntityId) select id, substring(urlName from 6) from WorkspaceNode where urlName like '__we-%';
-- update WorkspaceNode n set n.urlName = w.urlName from WorkspaceNode n outer join WorkspaceEntity w where w.id = substring(n.urlName from 6);
update WorkspaceNode n set urlName = (select w.urlName from WorkspaceEntity w where w.id = substring(n.urlName from 6));

insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (1, '', 20, 5, false);
insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (1, '', 21, 5, false);
insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (1, '', 22, 5, false);

insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (6, '', 20, 5, false);
insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (6, '', 21, 5, false);
insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (6, '', 22, 5, false);

insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (2, '', 20, 6, false);
insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (3, '', 20, 6, false);
insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (2, '', 21, 6, false);
insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (3, '', 21, 6, false);
insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (2, '', 22, 6, false);
insert into WorkspaceUserEntity (user_id, identifier, workspaceEntity_id, workspaceUserRole_id, archived) values (3, '', 22, 6, false);


