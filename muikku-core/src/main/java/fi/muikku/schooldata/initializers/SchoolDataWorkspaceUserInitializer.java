package fi.muikku.schooldata.initializers;

import java.util.List;

import fi.muikku.schooldata.entity.WorkspaceUser;

public interface SchoolDataWorkspaceUserInitializer extends SchoolDataEntityInitializer {

	public List<WorkspaceUser> init(List<WorkspaceUser> workspaceUsers);
	
}
