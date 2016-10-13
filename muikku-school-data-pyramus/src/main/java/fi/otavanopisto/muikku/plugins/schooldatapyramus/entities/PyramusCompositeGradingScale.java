package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.List;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGrade;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGradingScale;

public class PyramusCompositeGradingScale implements CompositeGradingScale {

	public PyramusCompositeGradingScale(String scaleIdentifier, String scaleName, List<CompositeGrade> grades) {
		this.scaleIdentifier = scaleIdentifier;
		this.scaleName = scaleName;
		this.grades = grades;
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
  
  private String scaleIdentifier;
  private String scaleName;
  private List<CompositeGrade> grades;

}
