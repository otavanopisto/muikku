package fi.muikku.plugins.schooldatalocal.entities;

import fi.muikku.plugins.schooldatalocal.LocalUserSchoolDataController;
import fi.muikku.schooldata.entity.EnvironmentRole;

public class LocalEnvironmentRoleImpl implements EnvironmentRole {

	public LocalEnvironmentRoleImpl(String identifier, String name) {
		this.identifier = identifier;
		this.name = name;
	}
	
	@Override
	public String getSchoolDataSource() {
		return LocalUserSchoolDataController.SCHOOL_DATA_SOURCE;
	}
	
	@Override
	public String getIdentifier() {
		return identifier;
	}

	@Override
	public String getName() {
		return name;
	}
	
	private String identifier;
	private String name;
}
