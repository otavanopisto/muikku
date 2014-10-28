package fi.muikku.schooldata.initializers;

import java.util.List;

import fi.muikku.schooldata.entity.UserEmail;

public interface SchoolDataUserEmailInitializer extends SchoolDataEntityInitializer {

	public List<UserEmail> init(List<UserEmail> users);
	
}
