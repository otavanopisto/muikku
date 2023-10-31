insert into PluginSettingKey(name, plugin) select 'roles.workspace.TEACHER', 'school-data-pyramus' from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'roles.workspace.TEACHER' having count(*) = 0;
insert into PluginSetting (value, key_id) select '7', (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'roles.workspace.TEACHER') from PluginSetting having count(*) = 0;

insert into EnvironmentDefaults (id, httpPort, httpsPort) values (1, 8081, 8443);

update PluginSetting set value = 'http://dev.muikku.fi:8089/1' where key_id = (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.url');
update PluginSetting set value = 'http://dev.muikku.fi:8089/oauth2ClientTest/success' where key_id = (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.redirectUrl');

insert into AuthSource (name, strategy) values ('Pyramus', 'pyramusoauth');
insert into PluginSettingKey(name, plugin) select 'oauth.clientId', 'pyramus-oauth' from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.clientId' having count(*) = 0;
insert into PluginSettingKey(name, plugin) select 'oauth.clientSecret', 'pyramus-oauth' from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.clientSecret' having count(*) = 0;
insert into PluginSettingKey(name, plugin) select 'oauth.redirectUrl', 'pyramus-oauth' from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.redirectUrl' having count(*) = 0;
insert into PluginSettingKey(name, plugin) select 'oauth.logoutUrl', 'pyramus-oauth' from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.logoutUrl' having count(*) = 0;
insert into PluginSettingKey(name, plugin) select 'oauth.authUrl', 'pyramus-oauth' from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.authUrl' having count(*) = 0;
insert into PluginSettingKey(name, plugin) select 'oauth.tokenUri', 'pyramus-oauth' from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.tokenUri' having count(*) = 0;
insert into PluginSettingKey(name, plugin) select 'oauth.whoamiUrl', 'pyramus-oauth' from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.whoamiUrl' having count(*) = 0;
insert into PluginSetting (value, key_id) select '11111111-1111-1111-1111-111111111111', (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.clientId') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.clientId') having count(*) = 0;
insert into PluginSetting (value, key_id) select '11111111111111111111111111111111111111111111111111111111111111111111111111111111', (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.clientSecret') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.clientSecret') having count(*) = 0;
insert into PluginSetting (value, key_id) select 'https://dev.muikku.fi:8443/login?_stg=rsp', (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.redirectUrl') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.redirectUrl') having count(*) = 0;
insert into PluginSetting (value, key_id) select 'http://dev.muikku.fi:8089/users/logout.page?redirectUrl=http://dev.muikku.fi:8081', (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.logoutUrl') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.logoutUrl') having count(*) = 0;
insert into PluginSetting (value, key_id) select 'http://dev.muikku.fi:8089/users/authorize.page?client_id=%s&response_type=code&redirect_uri=%s', (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.authUrl') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.authUrl') having count(*) = 0;
insert into PluginSetting (value, key_id) select 'http://dev.muikku.fi:8089/1/oauth/token', (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.tokenUri') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.tokenUri') having count(*) = 0;
insert into PluginSetting (value, key_id) select 'http://dev.muikku.fi:8089/1/system/whoami', (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.whoamiUrl') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'pyramus-oauth' and name = 'oauth.whoamiUrl') having count(*) = 0;

insert into PluginSettingKey(name, plugin) select 'webhook.secret', 'school-data-pyramus' from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'webhook.secret' having count(*) = 0;
insert into PluginSetting (value, key_id) select '11111111-1111-1111-1111-111111111111', (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'webhook.secret') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'webhook.secret') having count(*) = 0;

insert into PluginSettingKey(name, plugin) select 'system.authCode', 'school-data-pyramus' from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'system.authCode' having count(*) = 0;
insert into PluginSettingKey(name, plugin) select 'rest.url', 'school-data-pyramus' from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.url' having count(*) = 0;
insert into PluginSettingKey(name, plugin) select 'rest.clientId', 'school-data-pyramus' from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.clientId' having count(*) = 0;
insert into PluginSettingKey(name, plugin) select 'rest.clientSecret', 'school-data-pyramus' from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.clientSecret' having count(*) = 0;
insert into PluginSettingKey(name, plugin) select 'rest.redirectUrl', 'school-data-pyramus' from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.redirectUrl' having count(*) = 0;
insert into PluginSetting (value, key_id) select '1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111', (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'system.authCode') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'system.authCode') having count(*) = 0;
insert into PluginSetting (value, key_id) select 'http://dev.muikku.fi:8089/1', (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.url') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.url') having count(*) = 0;
insert into PluginSetting (value, key_id) select '11111111-1111-1111-1111-111111111111', (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.clientId') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.clientId') having count(*) = 0;
insert into PluginSetting (value, key_id) select '11111111111111111111111111111111111111111111111111111111111111111111111111111111', (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.clientSecret') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.clientSecret') having count(*) = 0;
insert into PluginSetting (value, key_id) select 'http://dev.muikku.fi:8089/oauth2ClientTest/success', (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.redirectUrl') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.redirectUrl') having count(*) = 0;

insert into PluginSetting (value, key_id) select 'http://dev.muikku.fi:8089/dnm', (select id from PluginSettingKey where plugin = 'deus-nex-machina' and name = 'service.url') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'deus-nex-machina' and name = 'service.url') having count(*) = 0;

insert into PluginSettingKey (name, plugin) select 'fileUploadBasePath', 'transcriptofrecords' from PluginSettingKey where plugin = 'transcriptofrecords' and name = 'fileUploadBasePath' having count(*) = 0;
insert into PluginSetting (value, key_id) select '/tmp/', id from PluginSettingKey where plugin = 'transcriptofrecords' and name = 'fileUploadBasePath';
insert into OrganizationEntity (id, identifier, name, archived, dataSource_id,workspaceVisibility) values (1, '1', 'Default', false, 2, 'PUBLIC');
insert into PluginSettingKey (name, plugin) select 'environmentForumOrganizations', 'forum' from PluginSettingKey where plugin = 'forum' and name = 'environmentForumOrganizations' having count(*) = 0;
insert into PluginSetting (value, key_id) select 'PYRAMUS-1', id from PluginSettingKey where plugin = 'forum' and name = 'environmentForumOrganizations';

insert into PluginSettingKey(plugin, name) select 'ceepos', 'server' from PluginSettingKey where plugin = 'ceepos' and name = 'server' having count(*) = 0;
insert into PluginSettingKey(plugin, name) select 'ceepos', 'source' from PluginSettingKey where plugin = 'ceepos' and name = 'source' having count(*) = 0;
insert into PluginSettingKey(plugin, name) select 'ceepos', 'key' from PluginSettingKey where plugin = 'ceepos' and name = 'key' having count(*) = 0;
insert into PluginSettingKey(plugin, name) select 'ceepos', '6MonthCode' from PluginSettingKey where plugin = 'ceepos' and name = '6MonthCode' having count(*) = 0;
insert into PluginSettingKey(plugin, name) select 'ceepos', '12MonthCode' from PluginSettingKey where plugin = 'ceepos' and name = '12MonthCode' having count(*) = 0;
insert into PluginSettingKey(plugin, name) select 'ceepos', 'returnAddress' from PluginSettingKey where plugin = 'ceepos' and name = 'returnAddress' having count(*) = 0;
insert into PluginSettingKey(plugin, name) select 'ceepos', 'notificationAddress' from PluginSettingKey where plugin = 'ceepos' and name = 'notificationAddress' having count(*) = 0;
insert into CeeposProduct (code, description, price, type,line) values ('demo_004', 'Nettilukion opiskelumaksu 6 kk', 10000, 'STUDYTIME','nettilukio');
insert into CeeposProduct (code, description, price, type,line) values ('demo_005', 'Nettilukion opiskelumaksu 12 kk', 15000, 'STUDYTIME','nettilukio');
insert into CeeposProduct (code, description, price, type,line) values ('demo_001', 'Arviointimaksu', 0, 'ASSESSMENTREQUEST','aineopiskelu');
insert into CeeposProduct (code, description, price, type,line) values ('demo_002', 'Arviointimaksu (valtiorahoitteinen)', 0, 'ASSESSMENTREQUEST_FUNDED','aineopiskelu');

insert into PluginSetting (value, key_id) select 'demo_005', id from PluginSettingKey where plugin = 'ceepos' and name = '12MonthCode';
insert into PluginSetting (value, key_id) select 'demo_004', id from PluginSettingKey where plugin = 'ceepos' and name = '6MonthCode';
insert into PluginSetting (value, key_id) select 'xxxxxx', id from PluginSettingKey where plugin = 'ceepos' and name = 'key';
insert into PluginSetting (value, key_id) select 'http://dev.muikku.fi/rest/ceepos/done', id from PluginSettingKey where plugin = 'ceepos' and name = 'returnAddress';
insert into PluginSetting (value, key_id) select 'http://dev.muikku.fi/rest/ceepos/paymentConfirmation', id from PluginSettingKey where plugin = 'ceepos' and name = 'notificationAddress';
insert into PluginSetting (value, key_id) select 'http://dev.muikku.fi:8089/ceeposrequestpayment', id from PluginSettingKey where plugin = 'ceepos' and name = 'server';
insert into PluginSetting (value, key_id) select 'mikkeli_test', id from PluginSettingKey where plugin = 'ceepos' and name = 'source';

insert into PluginSettingKey(name, plugin) select 'enabledOrganizations', 'chat' from PluginSettingKey where plugin = 'chat' and name = 'enabledOrganizations' having count(*) = 0;
insert into PluginSetting (value, key_id) select 'PYRAMUS-1', (select id from PluginSettingKey where plugin = 'chat' and name = 'enabledOrganizations') from PluginSetting where key_id = (select id from PluginSettingKey where plugin = 'chat' and name = 'enabledOrganizations') having count(*) = 0;