package fi.muikku.plugins.schooldatalocal.entities;

import fi.muikku.plugins.schooldatalocal.LocalUserSchoolDataController;
import fi.muikku.schooldata.entity.Role;
import fi.muikku.schooldata.entity.RoleType;

public class LocalRoleImpl implements Role {

	public LocalRoleImpl(String identifier, String name, RoleType type) {
		this.identifier = identifier;
		this.name = name;
		this.type = type;
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

	@Override
	public RoleType getType() {
		return type;
	}
	
	private String identifier;
	private String name;
	private RoleType type;
}
