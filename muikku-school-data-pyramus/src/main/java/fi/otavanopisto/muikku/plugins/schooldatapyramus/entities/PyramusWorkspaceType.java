package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractWorkspaceType;

public class PyramusWorkspaceType extends AbstractWorkspaceType {
	
  public PyramusWorkspaceType() {
    super();
  }  
  
	public PyramusWorkspaceType(SchoolDataIdentifier identifier, String name) {
    super(identifier, name);
  }

  @Override
	public String getSchoolDataSource() {
		return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
	}
}
