package fi.muikku.plugins.schooldatapyramus;

import java.util.Arrays;

import javax.inject.Inject;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.rest.SystemPyramusClient;
import fi.muikku.schooldata.SchoolDataController;
import fi.muikku.schooldata.initializers.SchoolDataEntityInitializerProvider;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.UserRole;

public class SchoolDataPyramusPluginDescriptor implements PluginDescriptor {

  public static final String SCHOOL_DATA_SOURCE = "PYRAMUS";
  
  @Inject
  private SchoolDataController schoolDataController;

  @Inject
  private SchoolDataEntityInitializerProvider schoolDataEntityInitializerProvider;

  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;

  @Inject
  private SystemPyramusClient pyramusClient;
  
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
    schoolDataEntityInitializerProvider.initRoles(entityFactory.createEntity(pyramusClient.get("/courses/staffMemberRoles", CourseStaffMemberRole[].class)));
    schoolDataEntityInitializerProvider.initRoles(Arrays.asList(entityFactory.createCourseStudentRoleEntity()));
  }
  
  @Override
  public String getName() {
    return "school-data-pyramus";
  }
}
