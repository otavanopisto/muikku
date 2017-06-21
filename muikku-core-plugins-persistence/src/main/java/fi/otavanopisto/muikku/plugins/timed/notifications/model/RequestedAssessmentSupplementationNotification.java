package fi.otavanopisto.muikku.plugins.timed.notifications.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class RequestedAssessmentSupplementationNotification {
  
  public Long getId() {
    return id;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  public String getWorkspaceIdentifier() {
    return workspaceIdentifier;
  }

  public void setWorkspaceIdentifier(String workspaceIdentifier) {
    this.workspaceIdentifier = workspaceIdentifier;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column (nullable=false)
  private String studentIdentifier;
  
  @NotNull
  @Column (nullable=false)
  private String workspaceIdentifier;
  
}
