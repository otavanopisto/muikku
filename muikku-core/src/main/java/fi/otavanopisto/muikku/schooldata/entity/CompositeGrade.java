package fi.otavanopisto.muikku.schooldata.entity;

public interface CompositeGrade extends SchoolDataEntity {
	
  public String getScaleIdentifier();
	
	public String getScaleName();
	
	public String getGradeIdentifier();
	
	public String getGradeName();

}