<?xml version="1.0" encoding="UTF-8"?>
<update xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.ofw.fi/xml/2011/java-xmldb-updater/UpdaterSchema.xsd">

  <sql>insert into RolePermission (permission_id, role_id) (select p.id, re.id from Permission p, RoleEntity re where p.name='LIST_USER_WORKSPACE_ACTIVITY' and re.name='TEACHER' and (select count(id) from RolePermission where permission_id=(select id from Permission where name='LIST_USER_WORKSPACE_ACTIVITY') and role_id=(select id from RoleEntity where name='TEACHER')) = 0);</sql>

</update> 
