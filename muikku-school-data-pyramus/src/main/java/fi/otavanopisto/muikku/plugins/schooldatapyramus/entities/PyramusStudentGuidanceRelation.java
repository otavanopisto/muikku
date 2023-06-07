package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.StudentGuidanceRelation;

public class PyramusStudentGuidanceRelation implements StudentGuidanceRelation {

  public PyramusStudentGuidanceRelation(boolean isSpecEdTeacher, boolean isGuidanceCounselor, boolean isCourseTeacher) {
    this.isSpecEdTeacher = isSpecEdTeacher;
    this.isGuidanceCounselor = isGuidanceCounselor;
    this.isCourseTeacher = isCourseTeacher;
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public boolean isSpecEdTeacher() {
    return isSpecEdTeacher;
  }

  @Override
  public boolean isGuidanceCounselor() {
    return isGuidanceCounselor;
  }

  @Override
  public boolean isCourseTeacher() {
    return isCourseTeacher;
  }

  private boolean isSpecEdTeacher;
  private boolean isGuidanceCounselor;
  private boolean isCourseTeacher;

}
