package fi.muikku.schooldata.initializers;

import java.util.List;

import fi.muikku.schooldata.entity.Role;

public interface SchoolDataRoleInitializer extends SchoolDataEntityInitializer {

	public List<Role> init(List<Role> roles);
	
}
