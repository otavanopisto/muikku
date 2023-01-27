package fi.otavanopisto.muikku.plugins.evaluation.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity
@Table (
    uniqueConstraints = @UniqueConstraint(
        columnNames = { "student", "workspaceEntityId" }
    )
)
public class WorkspaceJournalFeedback {

  public Long getId() {
    return id;
  }
  
  public Long getStudent() {
    return student;
  }

  public void setStudent(Long student) {
    this.student = student;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public String getFeedback() {
    return feedback;
  }

  public void setFeedback(String feedback) {
    this.feedback = feedback;
  }

  public Long getCreator() {
    return creator;
  }

  public void setCreator(Long creator) {
    this.creator = creator;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column (nullable=false)
  private Long student;
  
  @Lob
  private String feedback;
  
  @NotNull
  @Column (nullable=false)
  private Long workspaceEntityId;
  
  @NotNull
  @Column (nullable=false)
  private Long creator;
  
  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date created;

}
