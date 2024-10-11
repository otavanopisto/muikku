package fi.otavanopisto.muikku.rest.model;

public class GuiderEducationalLevelStudent {

  public GuiderStudentRestModel getGrammarSchoolStudent() {
    return grammarSchoolStudent;
  }

  public void setGrammarSchoolStudent(GuiderStudentRestModel grammarSchoolStudent) {
    this.grammarSchoolStudent = grammarSchoolStudent;
  }

  public GuiderStudentRestModel getHighSchoolStudent() {
    return highSchoolStudent;
  }

  public void setHighSchoolStudent(GuiderStudentRestModel highSchoolStudent) {
    this.highSchoolStudent = highSchoolStudent;
  }

  private GuiderStudentRestModel grammarSchoolStudent;
  private GuiderStudentRestModel highSchoolStudent;
}
