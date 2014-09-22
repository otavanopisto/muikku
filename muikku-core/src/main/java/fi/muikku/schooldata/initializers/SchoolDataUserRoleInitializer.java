package fi.muikku.schooldata.initializers;

import java.util.List;

import fi.muikku.schooldata.entity.UserRole;

public interface SchoolDataUserRoleInitializer {

	public List<UserRole> init(List<UserRole> userRoles);
	
}
