package fi.otavanopisto.muikku.plugins.hops.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class HopsAlternativeStudyOptions {

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
  
  public Boolean getFinnishAsLanguage() {
    return finnishAsLanguage;
  }
  
  public void setFinnishAsLanguage(Boolean finnishAsLanguage) {
    this.finnishAsLanguage = finnishAsLanguage;
  }
  
  public Boolean getReligionAsEthics() {
    return religionAsEthics;
  }
  
  public void setReligionAsEthics(Boolean religionAsEthics) {
    this.religionAsEthics = religionAsEthics;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @NotEmpty
  @Column(nullable = false)
  private String studentIdentifier;

  @Column
  private Boolean finnishAsLanguage;

  @Column
  private Boolean religionAsEthics;
}
