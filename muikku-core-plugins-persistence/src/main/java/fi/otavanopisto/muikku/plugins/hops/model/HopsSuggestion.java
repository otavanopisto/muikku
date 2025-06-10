package fi.otavanopisto.muikku.plugins.hops.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

@Entity
@Table(indexes = @Index(columnList = "userEntityId, category"))
public class HopsSuggestion {

  public Long getId() {
    return id;
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public Integer getCourseNumber() {
    return courseNumber;
  }

  public void setCourseNumber(Integer courseNumber) {
    this.courseNumber = courseNumber;
  }
  
  public String getType() {
    return type;
  }
  
  public void setType(String type) {
    this.type = type;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotNull
  @Column (nullable = false)
  private Long userEntityId;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String category;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String subject;
  
  @Column
  private Integer courseNumber;
  
  @NotNull
  @Column (nullable = false)
  private String type;
  
  @Column
  private Long workspaceEntityId;

  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date created;

}
