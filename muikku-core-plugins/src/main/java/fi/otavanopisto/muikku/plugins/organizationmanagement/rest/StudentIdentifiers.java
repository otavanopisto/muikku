package fi.otavanopisto.muikku.plugins.organizationmanagement.rest;

import java.util.Set;

public class StudentIdentifiers {

  public Set<String> getStudentIdentifiers() {
    return studentIdentifiers;
  }

  public void setStudentIdentifiers(Set<String> studentIdentifiers) {
    this.studentIdentifiers = studentIdentifiers;
  }

  public Set<Long> getStudentGroupIds() {
    return studentGroupIds;
  }

  public void setStudentGroupIds(Set<Long> studentGroupIds) {
    this.studentGroupIds = studentGroupIds;
  }

  private Set<String> studentIdentifiers;
  private Set<Long> studentGroupIds;
}
