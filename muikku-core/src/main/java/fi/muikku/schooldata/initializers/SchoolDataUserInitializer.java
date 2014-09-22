package fi.muikku.schooldata.initializers;

import java.util.List;

import fi.muikku.schooldata.entity.User;

public interface SchoolDataUserInitializer {

	public List<User> init(List<User> users);
	
}
