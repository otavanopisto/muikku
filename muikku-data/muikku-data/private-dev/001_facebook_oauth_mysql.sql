insert into AuthSource (name, strategy) values ('Facebook', 'facebookoauth');
insert into AuthSourceSetting (settingKey, value, authSource_id) values ('oauth.facebook.apiKey', '487661494678747', (select max(id) from AuthSource));
insert into AuthSourceSetting (settingKey, value, authSource_id) values ('oauth.facebook.apiSecret', 'ec40b03582e694062567989b79b25c02',(select max(id) from AuthSource));
insert into AuthSourceSetting (settingKey, value, authSource_id) values ('oauth.facebook.callbackUrl', 'https://dev.muikku.fi:8443/login?_stg=rsp', (select max(id) from AuthSource));
