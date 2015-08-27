package fi.muikku.schooldata.entity;

public interface GradingScaleItem extends SchoolDataEntity {
	
	public String getIdentifier();
	
	public String getGradingScaleIdentifier();
	
	public String getName();

	public Boolean isPassingGrade();
}