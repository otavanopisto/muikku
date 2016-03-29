package fi.otavanopisto.muikku.plugins.material.coops.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;

@Entity
public class CoOpsSession {

  public Long getId() {
    return id;
  }
  
  public String getSessionId() {
    return sessionId;
  }
  
  public void setSessionId(String sessionId) {
    this.sessionId = sessionId;
  }
  
  public CoOpsSessionType getType() {
    return type;
  }
  
  public void setType(CoOpsSessionType type) {
    this.type = type;
  }
  
  public Boolean getClosed() {
    return closed;
  }
  
  public void setClosed(Boolean closed) {
    this.closed = closed;
  }
  
  public HtmlMaterial getHtmlMaterial() {
    return htmlMaterial;
  }
  
  public void setHtmlMaterial(HtmlMaterial htmlMaterial) {
    this.htmlMaterial = htmlMaterial;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }
  
  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }
  
  public String getAlgorithm() {
    return algorithm;
  }
  
  public void setAlgorithm(String algorithm) {
    this.algorithm = algorithm;
  }
  
  public Long getJoinRevision() {
    return joinRevision;
  }
  
  public void setJoinRevision(Long joinRevision) {
    this.joinRevision = joinRevision;
  }
  
  public Date getAccessed() {
    return accessed;
  }
  
  public void setAccessed(Date accessed) {
    this.accessed = accessed;
  }

  @Id
  @GeneratedValue (strategy=GenerationType.IDENTITY)
  private Long id;
  
  @Column (nullable = false, unique = true)
  @NotEmpty
  @NotNull
  private String sessionId;
  
  @Column (nullable = false)
  @NotNull
  @Enumerated (EnumType.STRING)
  private CoOpsSessionType type;
  
  @Column (nullable = false)
  @NotNull
  private Boolean closed;

  @ManyToOne
  private HtmlMaterial htmlMaterial;

  private Long userEntityId;
  
  @Column (updatable = false, nullable = false)
  @NotNull
  @NotEmpty
  private String algorithm;
  
  @Column (updatable = false, nullable = false)
  @NotNull
  private Long joinRevision;
  
  @Column (nullable = false)
  @NotNull
  private Date accessed;
}