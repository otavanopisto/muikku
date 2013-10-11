
-- Make sure the workspaceEntityId points to a correct workspace entity
INSERT INTO Material(id, type, title, urlName, workspaceEntityId) VALUES (1, 'html', 'Hello World!', 'hello-world', 5);

INSERT INTO HtmlMaterial(id, characterData) VALUES (1, '<p>Hello World!</p>');	