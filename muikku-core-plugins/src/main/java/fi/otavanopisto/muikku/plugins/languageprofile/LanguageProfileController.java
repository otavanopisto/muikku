package fi.otavanopisto.muikku.plugins.languageprofile;

import java.nio.file.Paths;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugins.languageprofile.dao.LanguageProfileDAO;
import fi.otavanopisto.muikku.plugins.languageprofile.dao.LanguageProfileSampleDAO;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfile;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSample;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSampleType;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class LanguageProfileController {
  
  @Inject
  private SessionController sessionController;

  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private LanguageProfileDAO languageProfileDAO;

  @Inject
  private LanguageProfileSampleDAO languageProfileSampleDAO;

  @Inject
  private SystemSettingsController systemSettingsController;
  
  public LanguageProfile findByUserEntityId(Long userEntityId) {
    return languageProfileDAO.findByUserEntityId(userEntityId);
  }
  
  public LanguageProfile create(Long userEntityId, String formData) {
    return languageProfileDAO.create(userEntityId, formData);
  }
  
  public LanguageProfileSample createSample(LanguageProfile languageProfile, String language, LanguageProfileSampleType type, String fileId, String fileName, String contentType) {
    LanguageProfileSample sample = languageProfileSampleDAO.create(languageProfile, language, type, fileId, fileName, contentType);
    languageProfileDAO.updateLastModified(languageProfile, sample.getLastModified());
    return sample;
  }

  public LanguageProfileSample createSample(LanguageProfile languageProfile, String language, LanguageProfileSampleType type, String value) {
    LanguageProfileSample sample = languageProfileSampleDAO.create(languageProfile, language, type, value, "text/html");
    languageProfileDAO.updateLastModified(languageProfile, sample.getLastModified());
    return sample;
  }
  
  public LanguageProfileSample updateSample(LanguageProfileSample languageProfileSample, String value) {
    languageProfileSample = languageProfileSampleDAO.updateValue(languageProfileSample, value);
    languageProfileDAO.updateLastModified(languageProfileSample.getLanguageProfile(), languageProfileSample.getLastModified());
    return languageProfileSample;
  }
  
  /**
   * Returns whether the currently logged in user has access to language profile data of the given user.
   * 
   * @param userEntityId Language profile owner
   * @param allowOwnerOnly Limit access check to language profile owner only
   * 
   * @return Whether current user has access to given user's language profile
   */
  public boolean hasAccess(Long userEntityId, boolean allowOwnerOnly) {
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    SchoolDataIdentifier identifier = userEntity.defaultSchoolDataIdentifier();

    // Owner always has access
    
    if (identifier.equals(sessionController.getLoggedUser())) {
      return true;
    }
    
    if (allowOwnerOnly) {
      return false;
    }
    
    // Admins, maangers, and study programme leaders have access
    
    if (sessionController.hasAnyRole(EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER)) {
      return true;
    }
    
    // Guidance counselors have access
    
    if (userSchoolDataController.amICounselor(identifier)) {
      return true;
    }
    
    // Teachers have access if student is in their workspaces
    
    if (sessionController.hasRole(EnvironmentRoleArchetype.TEACHER)) {
      UserSchoolDataIdentifier studentUserSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(identifier);
      if (studentUserSchoolDataIdentifier != null && studentUserSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
        return workspaceUserEntityController.haveSharedWorkspaces(sessionController.getLoggedUserEntity(), studentUserSchoolDataIdentifier.getUserEntity());
      }
    }
    return false;
  }
  
  public boolean hasSampleAccess(Long sampleId, boolean ownerOnly) {
    LanguageProfileSample sample = languageProfileSampleDAO.findById(sampleId);
    if (sample == null) {
      return false;
    }
    return hasAccess(sample.getLanguageProfile().getUserEntityId(), ownerOnly);
  }

  public LanguageProfile update(LanguageProfile languageProfile, String formData) {
    return languageProfileDAO.update(languageProfile, formData);
  }
  
  public LanguageProfileSample findSampleById(Long sampleId) {
    return languageProfileSampleDAO.findById(sampleId);
  }
  
  public List<LanguageProfileSample> getSamples(LanguageProfile languageProfile) {
    return languageProfileSampleDAO.listByLanguageProfile(languageProfile);
  }

  public List<LanguageProfileSample> getSamples(LanguageProfile languageProfile, String language) {
    return languageProfileSampleDAO.listByLanguageProfileAndLanguage(languageProfile, language);
  }
  
  public void deleteSample(LanguageProfileSample sample) {
    if (sample.getType() != LanguageProfileSampleType.TEXT) {
      String basePath = systemSettingsController.getSetting("languageProfile.uploadBasePath");
      java.io.File sampleFile = Paths.get(basePath, sample.getLanguageProfile().getUserEntityId().toString(), sample.getFileId()).toFile();
      if (sampleFile.exists()) {
        sampleFile.delete();
      }
    }
    languageProfileSampleDAO.delete(sample);
    languageProfileDAO.updateLastModified(sample.getLanguageProfile(), new Date());
  }

}
