package fi.otavanopisto.muikku.plugins.schooldatalocal;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;
import fi.otavanopisto.muikku.plugin.PrioritizedPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataController;

public class SchoolDataLocalPluginDescriptor implements PluginDescriptor, PrioritizedPluginDescriptor {

	@Inject
	private SchoolDataController schoolDataController;

	@Override
	public String getName() {
		return "school-data-local";
	}

  @Override
  public void init() {
    /**
     * Ensure that SchoolDataSource is defined
     */
    
    SchoolDataSource schoolDataSource = schoolDataController.findSchoolDataSource(LocalUserSchoolDataController.SCHOOL_DATA_SOURCE);
    if (schoolDataSource == null) {
      schoolDataController.createSchoolDataSource(LocalUserSchoolDataController.SCHOOL_DATA_SOURCE);
    }
  }
	
	@Override
	public int getPriority() {
		// Prioritized as first school data bridge
		return -10;
	}

}
	
	