package fi.muikku.schooldata.entity;

import fi.tranquil.TranquilEntity;

@TranquilEntity
public interface GradingScaleItem extends SchoolDataEntity {
	
	public String getIdentifier();
	
	public String getGradingScaleIdentifier();
	
	public String getName();

}