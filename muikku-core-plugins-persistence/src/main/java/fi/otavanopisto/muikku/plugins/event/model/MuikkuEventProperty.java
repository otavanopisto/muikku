package fi.otavanopisto.muikku.plugins.event.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
@Table
public class MuikkuEventProperty {
  
  public MuikkuEventProperty() {
  }

  public MuikkuEventProperty(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Long getId() {
    return id;
  }

  public MuikkuEvent getEvent() {
    return muikkuEvent;
  }

  public void setEvent(MuikkuEvent muikkuEvent) {
    this.muikkuEvent = muikkuEvent;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @NotNull
  private MuikkuEvent muikkuEvent;

  @NotNull
  @Column(nullable = false)
  private Long userEntityId; 

  @NotNull
  @Column(nullable = false)
  @Temporal(value=TemporalType.TIMESTAMP)
  private Date date;
  
  @NotNull
  @Column
  private String name;
  
  @NotNull
  @Column
  private String value;

}
