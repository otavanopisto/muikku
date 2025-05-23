package fi.otavanopisto.muikku.plugins.hops.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

@Entity
// TODO Add userEntityId + category unique index after conversion
public class HopsGoals {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  public String getGoals() {
    return goals;
  }

  public void setGoals(String goals) {
    this.goals = goals;
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

  @Lob
  @NotNull
  @Column(nullable = false)
  private String goals;

}
