package fi.muikku.plugins.material.coops.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

@Entity
public class HtmlMaterialRevisionProperty {

  public Long getId() {
    return id;
  }
  
  public HtmlMaterialRevision getFileRevision() {
    return htmlMaterialRevision;
  }
  
  public void setFileRevision(HtmlMaterialRevision htmlMaterialRevision) {
    this.htmlMaterialRevision = htmlMaterialRevision;
  }
  
  public String getKey() {
    return key;
  }
  
  public void setKey(String key) {
    this.key = key;
  }
  
  public String getValue() {
    return value;
  }
  
  public void setValue(String value) {
    this.value = value;
  }
  
  @Id
  @GeneratedValue (strategy=GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private HtmlMaterialRevision htmlMaterialRevision;

  @Column (nullable = false, name = "propertyKey")
  private String key;
  
  @Lob
  @Column (nullable = false)
  private String value;
}