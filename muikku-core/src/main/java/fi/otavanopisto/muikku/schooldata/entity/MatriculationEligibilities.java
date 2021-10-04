package fi.otavanopisto.muikku.schooldata.entity;

public class MatriculationEligibilities {

  public MatriculationEligibilities() {
  }
  
  public MatriculationEligibilities(boolean upperSecondarySchoolCurriculum) {
    this.upperSecondarySchoolCurriculum = upperSecondarySchoolCurriculum;
  }

  public boolean isUpperSecondarySchoolCurriculum() {
    return upperSecondarySchoolCurriculum;
  }

  public void setUpperSecondarySchoolCurriculum(boolean upperSecondarySchoolCurriculum) {
    this.upperSecondarySchoolCurriculum = upperSecondarySchoolCurriculum;
  }

  private boolean upperSecondarySchoolCurriculum;
}
