package fi.otavanopisto.muikku.plugins.exam.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity
@Table (uniqueConstraints = {@UniqueConstraint(columnNames = {"workspaceFolderId", "userEntityId"})})
public class ExamAttendance {

  public Long getId() {
    return id;
  }

  public Long getWorkspaceFolderId() {
    return workspaceFolderId;
  }

  public void setWorkspaceFolderId(Long examId) {
    this.workspaceFolderId = examId;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Date getBegan() {
    return began;
  }

  public void setBegan(Date began) {
    this.began = began;
  }

  public Date getEnded() {
    return ended;
  }

  public void setEnded(Date ended) {
    this.ended = ended;
  }

  public String getWorkspaceMaterialIds() {
    return workspaceMaterialIds;
  }

  public void setWorkspaceMaterialIds(String workspaceMaterialIds) {
    this.workspaceMaterialIds = workspaceMaterialIds;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column(nullable = false)
  private Long workspaceFolderId;

  @NotNull
  @Column(nullable = false)
  private Long userEntityId;

  @Column
  @Temporal(value = TemporalType.TIMESTAMP)
  private Date began;

  @Column
  @Temporal(value = TemporalType.TIMESTAMP)
  private Date ended;
  
  @Column(columnDefinition = "mediumtext")
  private String workspaceMaterialIds; // CDT of assignment ids randomly assigned for this user when they began the exam

}