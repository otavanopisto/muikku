package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;

public interface WorkspaceUser extends SchoolDataEntity {

  public SchoolDataIdentifier getIdentifier();
  public SchoolDataIdentifier getUserIdentifier();
  public SchoolDataIdentifier getWorkspaceIdentifier();
  public OffsetDateTime getEnrolmentTime();
  public WorkspaceRoleArchetype getRoleArchetype();
  
}