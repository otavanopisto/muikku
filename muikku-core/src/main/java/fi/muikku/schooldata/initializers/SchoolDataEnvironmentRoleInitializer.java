package fi.muikku.schooldata.initializers;

import java.util.List;

import fi.muikku.schooldata.entity.EnvironmentRole;

public interface SchoolDataEnvironmentRoleInitializer extends SchoolDataEntityInitializer {

	public List<EnvironmentRole> init(List<EnvironmentRole> roles);
	
}
