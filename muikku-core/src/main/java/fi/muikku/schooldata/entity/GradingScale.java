package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface GradingScale extends SchoolDataEntity {
	
	public String getIdentifier();
	
	public String getName();

}