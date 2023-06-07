package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface SpecEdTeacher extends SchoolDataEntity {
	
	public SchoolDataIdentifier getIdentifier();

	public boolean isGuidanceCouncelor();
	
}