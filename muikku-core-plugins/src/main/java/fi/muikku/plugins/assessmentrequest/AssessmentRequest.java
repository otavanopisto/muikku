package fi.muikku.plugins.assessmentrequest;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class AssessmentRequest {

  public Long getId() {
    return id;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public Long getStudent() {
    return student;
  }

  public void setStudent(Long student) {
    this.student = student;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Long getWorkspace() {
    return workspace;
  }

  public void setWorkspace(Long workspace) {
    this.workspace = workspace;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (name = "workspace_id")
  private Long workspace;

  @Column (name = "student_id")
  private Long student;

  private String message;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}
