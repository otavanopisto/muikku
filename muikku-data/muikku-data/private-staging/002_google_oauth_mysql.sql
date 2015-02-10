insert into AuthSource (name, strategy) values ('Google', 'googleoauth');
insert into AuthSourceSetting (settingKey, value, authSource_id) values ('oauth.google.apiKey', '860483284276-4i2g859tbjeumgr2o892ul766vca6mpp.apps.googleusercontent.com', (select max(id) from AuthSource));
insert into AuthSourceSetting (settingKey, value, authSource_id) values ('oauth.google.apiSecret', 'A1UzsIfDGXsLR8n3iMoSgmxA', (select max(id) from AuthSource));
insert into AuthSourceSetting (settingKey, value, authSource_id) values ('oauth.google.callbackUrl', 'https://dev.muikku.fi:8443/login?_stg=rsp', (select max(id) from AuthSource));
