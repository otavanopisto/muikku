package fi.otavanopisto.muikku.plugins.hops.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

@Entity
//TODO Add userEntityId + category index after conversion
public class HopsHistory {

  public Long getId() {
    return id;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public String getModifier() {
    return modifier;
  }

  public void setModifier(String modifier) {
    this.modifier = modifier;
  }
  
  public String getDetails() {
    return details;
  }

  public void setDetails(String details) {
    this.details = details;
  }

  public String getChanges() {
    return changes;
  }

  public void setChanges(String changes) {
    this.changes = changes;
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
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column
  // TODO Make non-nullable after conversion
  private Long userEntityId;
  
  @Column
  // TODO Make non-nullable after conversion
  private String category;

  @Column
  // TODO Remove after conversion
  private String studentIdentifier;

  @NotNull
  @Column(nullable = false)
  @Temporal(value = TemporalType.TIMESTAMP)
  private Date date;

  @NotNull
  @NotEmpty
  @Column(nullable = false)
  private String modifier;
  
  @Lob
  @Column
  private String details;

  @Column(columnDefinition = "mediumtext")
  private String changes;

}
