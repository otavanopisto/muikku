package fi.muikku.plugins.schooldatapyramus;

import javax.inject.Inject;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.schooldata.SchoolDataController;

public class SchoolDataPyramusPluginDescriptor implements PluginDescriptor {

  public static final String SCHOOL_DATA_SOURCE = "PYRAMUS";
  public static final String PLUGIN_NAME = "school-data-pyramus";
  
  @Inject
  private SchoolDataController schoolDataController;

  @Override
  public void init() {
    /**
     * Ensure that SchoolDataSource is defined
     */
    
    SchoolDataSource schoolDataSource = schoolDataController.findSchoolDataSource(SCHOOL_DATA_SOURCE);
    if (schoolDataSource == null) {
      schoolDataController.createSchoolDataSource(SCHOOL_DATA_SOURCE);
    }
  }
  
  @Override
  public String getName() {
    return PLUGIN_NAME;
  }
}
