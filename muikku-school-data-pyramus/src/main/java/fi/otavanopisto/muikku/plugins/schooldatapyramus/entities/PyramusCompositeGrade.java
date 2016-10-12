package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGrade;

public class PyramusCompositeGrade implements CompositeGrade {

	public PyramusCompositeGrade(String scaleIdentifier, String scaleName, String gradeIdentifier, String gradeName) {
		this.scaleIdentifier = scaleIdentifier;
		this.scaleName = scaleName;
		this.gradeIdentifier = gradeIdentifier;
		this.gradeName = gradeName;
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
  public String getGradeIdentifier() {
    return gradeIdentifier;
  }

  @Override
  public String getGradeName() {
    return gradeName;
  }

  private String scaleIdentifier;
  private String scaleName;
  private String gradeIdentifier;
  private String gradeName;

}
