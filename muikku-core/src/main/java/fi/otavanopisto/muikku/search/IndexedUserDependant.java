package fi.otavanopisto.muikku.search;

import java.time.OffsetDateTime;
import java.util.Set;

public class IndexedUserDependant {
 
  public IndexedUserDependant() {
  }
  
  public IndexedUserDependant(String studentIdentifier, OffsetDateTime relationExpiryDate, Set<Long> workspaces, Set<Long> groups) {
    this.studentIdentifier = studentIdentifier;
    expires = relationExpiryDate;
    this.workspaces = workspaces;
    this.groups = groups;
  }
  
  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  public Set<Long> getWorkspaces() {
    return workspaces;
  }

  public void setWorkspaces(Set<Long> workspaces) {
    this.workspaces = workspaces;
  }

  public Set<Long> getGroups() {
    return groups;
  }

  public void setGroups(Set<Long> groups) {
    this.groups = groups;
  }

  public OffsetDateTime getExpires() {
    return expires;
  }

  public void setExpires(OffsetDateTime expires) {
    this.expires = expires;
  }

  private String studentIdentifier;
  private OffsetDateTime expires;
  private Set<Long> workspaces;
  private Set<Long> groups;
  
}
