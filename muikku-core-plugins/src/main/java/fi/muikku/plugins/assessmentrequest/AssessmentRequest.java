package fi.muikku.plugins.assessmentrequest;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
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

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public AssessmentRequestState getState() {
    return state;
  }

  public void setState(AssessmentRequestState state) {
    this.state = state;
  }
  
  public Long getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public void setCommunicatorMessageId(Long communicatorMessageId) {
    this.communicatorMessageId = communicatorMessageId;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (name = "workspace_id")
  private Long workspace;

  @Column (name = "student_id")
  private Long student;

  @NotNull
  @Column (updatable=false, nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date date;
  
  private String message;
  
  @Column (name = "message_id")
  private Long communicatorMessageId;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
  
  @Enumerated(EnumType.STRING)
  private AssessmentRequestState state;
}
