package fi.otavanopisto.muikku.schooldata.entity;

import java.util.List;

public interface CompositeGradingScale extends SchoolDataEntity {
	
  public String getScaleIdentifier();
	
	public String getScaleName();
	
	public List<CompositeGrade> getGrades();
	
	public boolean isActive();

}