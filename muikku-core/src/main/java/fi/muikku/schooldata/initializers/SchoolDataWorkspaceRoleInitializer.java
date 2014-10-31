package fi.muikku.schooldata.initializers;

import java.util.List;

import fi.muikku.schooldata.entity.WorkspaceRole;

public interface SchoolDataWorkspaceRoleInitializer extends SchoolDataEntityInitializer {

	public List<WorkspaceRole> init(List<WorkspaceRole> roles);
	
}
