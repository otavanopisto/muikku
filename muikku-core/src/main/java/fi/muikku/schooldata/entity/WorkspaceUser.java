package fi.muikku.schooldata.entity;

import fi.muikku.schooldata.SchoolDataIdentifier;

public interface WorkspaceUser extends SchoolDataEntity {
	
	public SchoolDataIdentifier getIdentifier();
	public SchoolDataIdentifier getUserIdentifier();
	public SchoolDataIdentifier getWorkspaceIdentifier();
	public SchoolDataIdentifier getRoleIdentifier();
	
}