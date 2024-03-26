package fi.otavanopisto.muikku.schooldata.entity;

public interface StudentGuidanceRelation extends SchoolDataEntity {
  
  public boolean isSpecEdTeacher();
  public boolean isGuidanceCounselor();
  public boolean isCourseTeacher();
  public boolean isStudentParent();
  
}
