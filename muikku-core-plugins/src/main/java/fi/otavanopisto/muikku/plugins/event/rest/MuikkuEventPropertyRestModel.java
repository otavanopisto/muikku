package fi.otavanopisto.muikku.plugins.event.rest;

import java.util.Date;

public class MuikkuEventPropertyRestModel {

  public Long getId() {
    return id;
  }

  public MuikkuEventRestModel getEvent() {
    return muikkuEvent;
  }

  public void setEvent(MuikkuEventRestModel muikkuEvent) {
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

  private Long id;
  private MuikkuEventRestModel muikkuEvent;
  private Long userEntityId;
  private Date date;
  private String name;
  private String value;

}
