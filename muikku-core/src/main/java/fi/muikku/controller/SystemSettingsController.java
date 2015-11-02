package fi.muikku.controller;

import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.dao.base.SystemSettingDAO;
import fi.muikku.model.base.SystemSetting;

@Dependent
@Stateless
public class SystemSettingsController {

  private static final long DEFAULT_UPLOAD_FILE_SIZE_LIMIT = 10_485_760; // 10 mb
  
  @Inject
  private Logger logger;

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

  public long getUploadFileSizeLimit() {
    String uploadFileSizeLimitString = getSetting("uploadFileSizeLimit");
    if (uploadFileSizeLimitString == null) {
      return DEFAULT_UPLOAD_FILE_SIZE_LIMIT;
    }
    
    if (NumberUtils.isDigits(uploadFileSizeLimitString)) {
      return Long.parseLong(uploadFileSizeLimitString, 10);
    } else {
      logger.severe("Invalid upload file size limit: " + uploadFileSizeLimitString);
      return DEFAULT_UPLOAD_FILE_SIZE_LIMIT;
    }
  }
  
  public String getSystemEmailSenderAddress() {
    String systemEmailAddress = getSetting("systemEmailSenderAddress");
    if (systemEmailAddress == null) {
      return ""; // TODO fallback sender address 
    } else {
      return systemEmailAddress;
    }
  }

}
