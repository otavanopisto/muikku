SET REFERENTIAL_INTEGRITY FALSE;

insert into material (id, title, version, originMaterial_id) values 
  (6, '1.1 Testmaterial sub', 2, null);

insert into htmlmaterial (id, contentType, html, revisionNumber) values 
  (6, 'text/html;editor=CKEditor', '<html><body>
                  <p>Test Matherial:  Lorem ipsum dolor sit amet </p>
                  <p>
                     Proin luctus orci luctus orcisuscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem
                  </p>
               </body></html>', 1);

insert into workspacenode (id, hidden, orderNumber, urlName, parent_id, title) values 
  (4, false, 2, 'Test matherial node', 1, 'Test material 2.0');
  
insert into workspacefolder(id, defaultMaterial_id, folderType) values 
  (4, null, 'DEFAULT');

insert into workspacenode (id, hidden, orderNumber, urlName, parent_id, title) values 
  (43, false, 2, 'Test matherial node', 4, 'Test material 2.0');
  
insert into workspacematerial(id, materialId, assignmentType) values 
  (43, 6, null);
  
insert into material (id, title, version, originMaterial_id) values 
  (7, '2.0 Testmaterial', 2, null);

insert into htmlmaterial (id, contentType, html, revisionNumber) values 
  (7, 'text/html;editor=CKEditor', '<html><body>
                  <p>Test Matherial:  Lorem ipsum dolor sit amet </p>
                  <p>
                     Senim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem
                  </p>
               </body></html>', 1);  

insert into workspacenode (id, hidden, orderNumber, urlName, parent_id, title) values 
  (44, false, 2, 'Test material node3', 4, 'Test material');
  
insert into workspacematerial(id, materialId, assignmentType) values 
  (44, 7, null);
  
SET REFERENTIAL_INTEGRITY TRUE;