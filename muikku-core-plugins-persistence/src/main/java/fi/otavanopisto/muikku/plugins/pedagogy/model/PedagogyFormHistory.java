package fi.otavanopisto.muikku.plugins.pedagogy.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
public class PedagogyFormHistory {

  public Long getId() {
    return id;
  }

  public PedagogyForm getForm() {
    return form;
  }

  public void setForm(PedagogyForm form) {
    this.form = form;
  }

  public String getFields() {
    return fields;
  }

  public void setFields(String fields) {
    this.fields = fields;
  }

  public String getDetails() {
    return details;
  }

  public void setDetails(String details) {
    this.details = details;
  }

  public Long getCreator() {
    return creator;
  }

  public void setCreator(Long creator) {
    this.creator = creator;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }
  
  public PedagogyFormHistoryType getType() {
    return type;
  }

  public void setType(PedagogyFormHistoryType type) {
    this.type = type;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private PedagogyForm form;
  
  @Lob
  private String fields;

  @Lob
  private String details;

  @NotNull
  @Column (nullable=false)
  private Long creator;

  @NotNull
  @Column (updatable=false, nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date created;
  
  @Enumerated (EnumType.STRING)
  @Column (nullable = false)
  private PedagogyFormHistoryType type;

}
