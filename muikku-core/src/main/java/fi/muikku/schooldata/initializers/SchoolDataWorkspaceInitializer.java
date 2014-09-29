package fi.muikku.schooldata.initializers;

import java.util.List;

import fi.muikku.schooldata.entity.Workspace;

public interface SchoolDataWorkspaceInitializer extends SchoolDataEntityInitializer {

	public List<Workspace> init(List<Workspace> workspaces);
	
}
