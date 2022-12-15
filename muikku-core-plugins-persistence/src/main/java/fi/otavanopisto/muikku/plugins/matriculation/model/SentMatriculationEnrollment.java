package fi.otavanopisto.muikku.plugins.matriculation.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

@Entity
@Table(
    uniqueConstraints = @UniqueConstraint(columnNames = {"examId", "userIdentifier"})
)
public class SentMatriculationEnrollment {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public SchoolDataIdentifier getUserIdentifier() {
    return SchoolDataIdentifier.fromId(userIdentifier);
  }

  public void setUserIdentifier(SchoolDataIdentifier userIdentifier) {
    this.userIdentifier = userIdentifier.toId();
  }

  public Long getExamId() {
    return examId;
  }

  public void setExamId(Long examId) {
    this.examId = examId;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long examId;
  
  @NotNull
  @NotEmpty
  @Column(nullable = false)
  private String userIdentifier;
}
