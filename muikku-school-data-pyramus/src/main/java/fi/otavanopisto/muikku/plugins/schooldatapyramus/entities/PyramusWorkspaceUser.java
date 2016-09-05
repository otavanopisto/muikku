package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractWorkspaceUser;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;

public class PyramusWorkspaceUser extends AbstractWorkspaceUser implements WorkspaceUser {

	public PyramusWorkspaceUser(SchoolDataIdentifier identifier, SchoolDataIdentifier userIdentifier, SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier roleIdentifier, OffsetDateTime enrolmentTime) {
    super(identifier, userIdentifier, workspaceIdentifier, roleIdentifier, enrolmentTime);
  }

  @Override
	public String getSchoolDataSource() {
		return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

}
