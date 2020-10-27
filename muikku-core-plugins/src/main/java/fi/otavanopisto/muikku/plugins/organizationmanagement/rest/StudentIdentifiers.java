package fi.otavanopisto.muikku.plugins.organizationmanagement.rest;

import java.util.List;

public class StudentIdentifiers {

  public List<String> getStudentIdentifiers() {
    return studentIdentifiers;
  }

  public void setStudentIdentifiers(List<String> studentIdentifiers) {
    this.studentIdentifiers = studentIdentifiers;
  }

  private List<String> studentIdentifiers;
}
