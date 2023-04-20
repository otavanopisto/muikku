package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractWorkspaceUser;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;

public class PyramusWorkspaceUser extends AbstractWorkspaceUser implements WorkspaceUser {

  public PyramusWorkspaceUser(SchoolDataIdentifier identifier, SchoolDataIdentifier userIdentifier, SchoolDataIdentifier workspaceIdentifier,
      WorkspaceRoleArchetype role, OffsetDateTime enrolmentTime) {
    super(identifier, userIdentifier, workspaceIdentifier, role, enrolmentTime);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

}
