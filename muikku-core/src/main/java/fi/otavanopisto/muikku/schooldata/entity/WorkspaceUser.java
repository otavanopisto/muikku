package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface WorkspaceUser extends SchoolDataEntity {
	
	public SchoolDataIdentifier getIdentifier();
	public SchoolDataIdentifier getUserIdentifier();
	public SchoolDataIdentifier getWorkspaceIdentifier();
	public SchoolDataIdentifier getRoleIdentifier();
	
}