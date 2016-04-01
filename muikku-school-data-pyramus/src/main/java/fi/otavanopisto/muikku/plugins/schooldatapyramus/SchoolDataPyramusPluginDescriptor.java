package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataController;

public class SchoolDataPyramusPluginDescriptor implements PluginDescriptor {

  public static final String SCHOOL_DATA_SOURCE = "PYRAMUS";
  public static final String PLUGIN_NAME = "school-data-pyramus";
  public static final boolean SCHEDULERS_ACTIVE = true;

  @Inject
  private SchoolDataController schoolDataController;

  @Inject
  private SystemOauthController systemOauthController;
  
  @Override
  public void init() {
    /**
     * Ensure that SchoolDataSource is defined
     */
    
    SchoolDataSource schoolDataSource = schoolDataController.findSchoolDataSource(SCHOOL_DATA_SOURCE);
    if (schoolDataSource == null) {
      schoolDataController.createSchoolDataSource(SCHOOL_DATA_SOURCE);
    }
    
    systemOauthController.deleteSystemAccessTokens();
  }
  
  @Override
  public String getName() {
    return PLUGIN_NAME;
  }
}
