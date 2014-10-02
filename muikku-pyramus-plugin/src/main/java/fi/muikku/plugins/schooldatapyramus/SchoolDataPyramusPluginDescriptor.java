package fi.muikku.plugins.schooldatapyramus;

import javax.inject.Inject;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.schooldata.SchoolDataController;
import fi.muikku.schooldata.initializers.SchoolDataEntityInitializerProvider;
import fi.pyramus.rest.model.UserRole;

public class SchoolDataPyramusPluginDescriptor implements PluginDescriptor {

  public static final String SCHOOL_DATA_SOURCE = "PYRAMUS";
  
  @Inject
  private SchoolDataController schoolDataController;

  @Inject
  private SchoolDataEntityInitializerProvider schoolDataEntityInitializerProvider;

  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;
  
  @Override
  public void init() {
    /**
     * Ensure that SchoolDataSource is defined
     */
    
    SchoolDataSource schoolDataSource = schoolDataController.findSchoolDataSource(SCHOOL_DATA_SOURCE);
    if (schoolDataSource == null) {
      schoolDataController.createSchoolDataSource(SCHOOL_DATA_SOURCE);
    }
    
    schoolDataEntityInitializerProvider.initRoles(entityFactory.createEntity(UserRole.values()));
  }
  
  @Override
  public String getName() {
    return "school-data-pyramus";
  }
}
