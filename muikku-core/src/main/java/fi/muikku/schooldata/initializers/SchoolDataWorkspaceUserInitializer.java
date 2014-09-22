package fi.muikku.schooldata.initializers;

import java.util.List;

import fi.muikku.schooldata.entity.WorkspaceUser;

public interface SchoolDataWorkspaceUserInitializer {

	public List<WorkspaceUser> init(List<WorkspaceUser> workspaceUsers);
	
}
