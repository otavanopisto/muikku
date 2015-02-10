update PluginSetting set value = 'https://dev.pyramus.fi:8443/1' where key_id = (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.url');
update PluginSetting set value = 'https://dev.pyramus.fi:8443/oauth2ClientTest/success' where key_id = (select id from PluginSettingKey where plugin = 'school-data-pyramus' and name = 'rest.redirectUrl');
