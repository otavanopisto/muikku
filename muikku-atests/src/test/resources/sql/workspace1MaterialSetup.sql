SET REFERENTIAL_INTEGRITY FALSE;

insert into material (id, title, version, originMaterial_id) values 
  (5, '1.0 Testimateriaali', 2, null);

insert into htmlmaterial (id, contentType, html, revisionNumber) values 
  (5, 'text/html;editor=CKEditor', '<html><body>
                  <p>Testi materiaalia:  Lorem ipsum dolor sit amet </p>
                  <p>
                     Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem
                  </p>
               </body></html>', 1);
 
insert into workspacenode (id, hidden, orderNumber, urlName, parent_id, title) values 
  (3, false, 1, 'Test Course material folder', 1, 'Test material folder');
  
insert into workspacefolder(id, defaultMaterial_id, folderType) values 
  (3, null, 'DEFAULT');

insert into workspacenode (id, hidden, orderNumber, urlName, parent_id, title) values 
  (42, false, 1, 'Test Course material folder', 3, 'Test material folder');

insert into workspacematerial(id, materialId, assignmentType) values 
  (42, 5, null);
    
SET REFERENTIAL_INTEGRITY TRUE;