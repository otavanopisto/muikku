package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.List;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGrade;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGradingScale;

public class PyramusCompositeGradingScale implements CompositeGradingScale {

	public PyramusCompositeGradingScale(String scaleIdentifier, String scaleName, List<CompositeGrade> grades, boolean active) {
		this.scaleIdentifier = scaleIdentifier;
		this.scaleName = scaleName;
		this.grades = grades;
		this.active = active;
	}

	@Override
	public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

  @Override
  public String getScaleIdentifier() {
    return scaleIdentifier;
  }

  @Override
  public String getScaleName() {
    return scaleName;
  }
  
  @Override
  public List<CompositeGrade> getGrades() {
    return grades;
  }
  
  @Override
  public boolean isActive() {
    return active;
  }
  
  private String scaleIdentifier;
  private String scaleName;
  private List<CompositeGrade> grades;
  private boolean active;

}
