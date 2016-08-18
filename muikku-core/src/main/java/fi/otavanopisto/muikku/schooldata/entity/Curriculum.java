package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface Curriculum extends SchoolDataEntity {

	public SchoolDataIdentifier getIdentifier();
	
	public String getName();
	
}