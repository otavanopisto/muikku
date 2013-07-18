package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface Subject extends SchoolDataEntity {

	public String getIdentifier();
	
	public String getName();
	
}