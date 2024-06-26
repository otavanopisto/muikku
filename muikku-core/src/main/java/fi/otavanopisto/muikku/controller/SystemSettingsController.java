package fi.otavanopisto.muikku.controller;

import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.dao.base.SystemSettingDAO;
import fi.otavanopisto.muikku.model.base.SystemSetting;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

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

  /**
   * Returns true if given organizationIdentifier points to an organization that
   * is the default organization.
   * 
   * @param organizationIdentifier
   * @return true, if the given organization is default organization, 
   *         false is given organization identifier is null or if default organization is not set
   */
  public boolean isDefaultOrganization(SchoolDataIdentifier organizationIdentifier) {
    if (organizationIdentifier == null) {
      return false;
    }
    
    String defaultOrganizationIdentifier = getSetting("defaultOrganization");
    if (StringUtils.isBlank(defaultOrganizationIdentifier)) {
      return false;
    }
    
    return StringUtils.equals(defaultOrganizationIdentifier, organizationIdentifier.toId());
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
      return "no-reply@muikkuverkko.fi";
    } else {
      return systemEmailAddress;
    }
  }

}
