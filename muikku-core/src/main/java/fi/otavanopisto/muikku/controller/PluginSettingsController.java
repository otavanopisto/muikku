package fi.otavanopisto.muikku.controller;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.plugins.PluginSettingDAO;
import fi.otavanopisto.muikku.dao.plugins.PluginSettingKeyDAO;
import fi.otavanopisto.muikku.dao.plugins.PluginUserSettingDAO;
import fi.otavanopisto.muikku.dao.plugins.PluginUserSettingKeyDAO;
import fi.otavanopisto.muikku.dao.users.UserEntityDAO;
import fi.otavanopisto.muikku.model.plugins.PluginSetting;
import fi.otavanopisto.muikku.model.plugins.PluginSettingKey;
import fi.otavanopisto.muikku.model.plugins.PluginUserSetting;
import fi.otavanopisto.muikku.model.plugins.PluginUserSettingKey;
import fi.otavanopisto.muikku.model.users.UserEntity;

public class PluginSettingsController {

  @Inject
  private Logger logger;

  @Inject
	private PluginSettingDAO pluginSettingDAO;

	@Inject
	private PluginSettingKeyDAO pluginSettingKeyDAO;
	
	@Inject
	private PluginUserSettingDAO pluginUserSettingDAO;

	@Inject
	private PluginUserSettingKeyDAO pluginUserSettingKeyDAO;
	
	@Inject
	private UserEntityDAO userEntityDAO;
	
	public PluginSettingKey findPluginSettingKey(String plugin, String name) {
		return pluginSettingKeyDAO.findByPluginAndName(plugin, name);
	}
	
	public PluginSettingKey getPluginSettingKey(String plugin, String name) {
		PluginSettingKey key = findPluginSettingKey(plugin, name);
		if (key == null) {
			key = pluginSettingKeyDAO.create(plugin, name);
		}
		
		return key;
	}
	
	public String findPluginSetting(PluginSettingKey key) {
		PluginSetting setting = pluginSettingDAO.findByKey(key);
		if (setting != null) {
			return setting.getValue();
		}
		
		return null;
	}
	
	public String getPluginSetting(String plugin, String name) {
	  logger.info(String.format("getPluginSetting %s.%s", plugin, name));
	  PluginSettingKey key = findPluginSettingKey(plugin, name);
		
		if (key == null) {
			key = pluginSettingKeyDAO.create(plugin, name);
		}
		
  	return findPluginSetting(key);
	}
	
	public void updatePluginSetting(PluginSettingKey key, String value) {
		PluginSetting setting = pluginSettingDAO.findByKey(key);
		if (setting == null) {
			setting = pluginSettingDAO.create(key, value);
		} else {
			pluginSettingDAO.updateValue(setting, value);
		}
	}
	
	public void setPluginSetting(String plugin, String name, String value) {
		PluginSettingKey key = findPluginSettingKey(plugin, name);
		if (key == null) {
			key = pluginSettingKeyDAO.create(plugin, name);
		}

		updatePluginSetting(key, value);
	}
	
	public PluginUserSettingKey findPluginUserSettingKey(String plugin, String name) {
		return pluginUserSettingKeyDAO.findByPluginAndName(plugin, name);
	}
	
	public PluginUserSettingKey getPluginUserSettingKey(String plugin, String name) {
		PluginUserSettingKey key = findPluginUserSettingKey(plugin, name);
		if (key == null) {
			key = pluginUserSettingKeyDAO.create(plugin, name);
		}
		
		return key;
	}
	
	public PluginUserSetting findPluginUserSetting(PluginUserSettingKey key, UserEntity user) {
		return pluginUserSettingDAO.findByKeyAndUser(key, user);
	}
	
	public String getPluginUserSetting(String plugin, String name, UserEntity user) {
		PluginUserSettingKey key = findPluginUserSettingKey(plugin, name);
		if (key == null) {
			key = pluginUserSettingKeyDAO.create(plugin, name);
		}
		
		PluginUserSetting setting = findPluginUserSetting(key, user);
		if (setting != null) {
			return setting.getValue();
		}
		
		return null;
	}
	
	public void updatePluginUserSetting(PluginUserSettingKey key, String value, UserEntity user) {
		PluginUserSetting setting = pluginUserSettingDAO.findByKeyAndUser(key, user);
		if (setting == null) {
			setting = pluginUserSettingDAO.create(key, user, value);
		} else {
			pluginUserSettingDAO.updateValue(setting, value);
		}
	}
	
	public void setPluginUserSetting(String plugin, String name, String value, UserEntity user) {
		PluginUserSettingKey key = findPluginUserSettingKey(plugin, name);
		if (key == null) {
			key = pluginUserSettingKeyDAO.create(plugin, name);
		}
		
		updatePluginUserSetting(key, value, user);
	}
	
	public List<UserEntity> listUsersWithSetting(PluginUserSettingKey key) {
		return pluginUserSettingDAO.listUsersByKey(key);
	}

	public List<UserEntity> listUsersWithoutSetting(PluginUserSettingKey key) {
		return userEntityDAO.listByUserNotIn(listUsersWithSetting(key));
	}
	
}
