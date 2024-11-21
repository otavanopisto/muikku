package fi.otavanopisto.muikku.plugins.languageprofile;

import java.nio.file.Paths;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.plugins.languageprofile.dao.LanguageProfileDAO;
import fi.otavanopisto.muikku.plugins.languageprofile.dao.LanguageProfileSampleDAO;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfile;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSample;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSampleType;

public class LanguageProfileController {

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
    return languageProfileSampleDAO.create(languageProfile, language, type, fileId, fileName, contentType);
  }

  public LanguageProfileSample createSample(LanguageProfile languageProfile, String language, LanguageProfileSampleType type, String value) {
    return languageProfileSampleDAO.create(languageProfile, language, type, value, "text/html");
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
  }

}
