SET REFERENTIAL_INTEGRITY FALSE;

insert into material (id, title, version, originMaterial_id) values 
  (8, '1.1 Testmaterial evaluated', 1, null);

insert into htmlmaterial (id, contentType, html, revisionNumber) values 
  (8, 'text/html;editor=CKEditor', '<html><body>
            <p>Ruksilista</p>
            <p>
               <object type="application/vnd.muikku.field.multiselect"><param name="type" value="application/json"/><param name="content" value="{&quot;name&quot;:&quot;param1&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;Vaihtoehto 1&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;kakkonen&quot;,&quot;text&quot;:&quot;Vaihtoehto 2&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;???&quot;,&quot;text&quot;:&quot;Vaihtoehto 3&quot;,&quot;correct&quot;:false}],&quot;listType&quot;:&quot;checkbox-vertical&quot;}"/><input name="param1" type="checkbox" value="1"/><label>Vaihtoehto 1</label><input name="param1" type="checkbox" value="kakkonen"/><label>Vaihtoehto 2</label><input name="param1" type="checkbox" value="???"/><label>Vaihtoehto 3</label></object>
            </p>
         </body></html>', 1);

insert into workspacenode (id, hidden, orderNumber, urlName, parent_id, title) values 
  (9, false, 2, 'Test matherial node', 1, 'Test material');
  
insert into workspacefolder(id, defaultMaterial_id, folderType) values 
  (9, null, 'DEFAULT');

insert into workspacenode (id, hidden, orderNumber, urlName, parent_id, title) values 
  (46, false, 2, 'Test matherial node', 9, 'Test material');
  
insert into workspacematerial(id, materialId, assignmentType) values 
  (46, 8, 'EXERCISE');
  
SET REFERENTIAL_INTEGRITY TRUE;