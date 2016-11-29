package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.entity.CompositeGrade;

public class PyramusCompositeGrade implements CompositeGrade {

	public PyramusCompositeGrade(String gradeIdentifier, String gradeName) {
		this.gradeIdentifier = gradeIdentifier;
		this.gradeName = gradeName;
	}

  @Override
  public String getGradeIdentifier() {
    return gradeIdentifier;
  }

  @Override
  public String getGradeName() {
    return gradeName;
  }

  private String gradeIdentifier;
  private String gradeName;

}
