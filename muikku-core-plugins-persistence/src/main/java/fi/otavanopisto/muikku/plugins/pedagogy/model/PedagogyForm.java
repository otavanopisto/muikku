package fi.otavanopisto.muikku.plugins.pedagogy.model;

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
@Table(
    uniqueConstraints = @UniqueConstraint(
        columnNames = { "userEntityId" }
    )
)
public class PedagogyForm {

  public Long getId() {
    return id;
  }

  public String getFormData() {
    return formData;
  }

  public void setFormData(String formData) {
    this.formData = formData;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public boolean isPublished() {
    return published;
  }

  public void setPublished(boolean published) {
    this.published = published;
  }

  public Date getPublishDate() {
    return publishDate;
  }

  public void setPublishDate(Date publishDate) {
    this.publishDate = publishDate;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Column (nullable = false)
  private Long userEntityId;

  @Lob
  @NotNull
  @Column(nullable = false)
  private String formData;
  
  @NotNull
  @Column(nullable = false)
  private boolean published;
  
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date publishDate;

}
