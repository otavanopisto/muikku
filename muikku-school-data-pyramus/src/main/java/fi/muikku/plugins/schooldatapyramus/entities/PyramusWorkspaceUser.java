package fi.muikku.plugins.schooldatapyramus.entities;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.entity.AbstractWorkspaceUser;
import fi.muikku.schooldata.entity.WorkspaceUser;

public class PyramusWorkspaceUser extends AbstractWorkspaceUser implements WorkspaceUser {

	public PyramusWorkspaceUser(SchoolDataIdentifier identifier, SchoolDataIdentifier userIdentifier, SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier roleIdentifier) {
    super(identifier, userIdentifier, workspaceIdentifier, roleIdentifier);
  }

  @Override
	public String getSchoolDataSource() {
		return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

}
