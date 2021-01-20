package fi.otavanopisto.muikku.plugins.organizationmanagement.rest;

import java.util.List;

public class StudentGroupIdentifiers {

  public List<String> getStudentGroupIdentifiers() {
    return studentGroupIdentifiers;
  }

  public void setStudentGroupIdentifiers(List<String> studentGroupIdentifiers) {
    this.studentGroupIdentifiers = studentGroupIdentifiers;
  }

  private List<String> studentGroupIdentifiers;
}
