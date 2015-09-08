package fi.muikku.controller;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SystemSettingDAO;
import fi.muikku.model.base.SystemSetting;

@Dependent
@Stateless
public class SystemSettingsController {

	@Inject
	private SystemSettingDAO systemSettingDAO;
	
	public String getSetting(String key) {
	  SystemSetting systemSetting = systemSettingDAO.findByKey(key);
	  if (systemSetting == null) {
	    return null;
	  } else {
	    return systemSetting.getValue();
	  }
	}
	
	public SystemSetting setSetting(String key, String value) {
	  SystemSetting systemSetting = systemSettingDAO.findByKey(key);
	  if (systemSetting == null) {
	    return systemSettingDAO.create(key, value);
	  } else {
	    return systemSettingDAO.update(systemSetting, value);
	  }
	  
	}
	
}
