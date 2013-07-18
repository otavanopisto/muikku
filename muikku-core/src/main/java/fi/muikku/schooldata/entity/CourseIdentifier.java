package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface CourseIdentifier extends SchoolDataEntity {

	public String getIdentifier();
	
	public String getCode();
	
	public String getSubjectIdentifier();
	
}